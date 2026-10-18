import fs from 'fs';
import path from 'path';

const visited = new Set();
const order = [];

function resolveImport(spec, fromDir) {
  if (spec === 'three') return path.resolve('node_modules/three/build/three.module.js');
  if (spec.startsWith('three/addons/')) {
    return path.resolve('node_modules/three/examples/jsm', spec.slice('three/addons/'.length));
  }
  return path.resolve(fromDir, spec);
}

function toModId(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

function trace(filePath) {
  if (visited.has(filePath)) return;
  visited.add(filePath);
  const code = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const importRegex = /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRegex.exec(code)) !== null) {
    trace(resolveImport(m[1], dir));
  }
  order.push(filePath);
}

trace(path.resolve('src/main.js'));

function transformESMtoCJS(code, fromDir) {
  // 1. Replace `import * as X from 'spec';`
  code = code.replace(/import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"]\s*;?/g, (_, name, spec) => {
    const id = toModId(resolveImport(spec, fromDir));
    return `const ${name} = __require(${JSON.stringify(id)});`;
  });

  // 2. Replace `import { a, b as c } from 'spec';`
  code = code.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g, (_, list, spec) => {
    const id = toModId(resolveImport(spec, fromDir));
    const bindings = list
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const parts = s.split(/\s+as\s+/);
        return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : parts[0].trim();
      })
      .join(', ');
    return `const { ${bindings} } = __require(${JSON.stringify(id)});`;
  });

  // 3. Replace `export * from 'spec';`
  code = code.replace(/export\s*\*\s*from\s*['"]([^'"]+)['"]\s*;?/g, (_, spec) => {
    const id = toModId(resolveImport(spec, fromDir));
    return `Object.assign(__exports, __require(${JSON.stringify(id)}));`;
  });

  // 4. Replace `export { a, b as c } from 'spec';`
  code = code.replace(/export\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g, (_, list, spec) => {
    const id = toModId(resolveImport(spec, fromDir));
    const tmp = `__reexp_${Math.random().toString(36).slice(2, 8)}`;
    const lines = list
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const parts = s.split(/\s+as\s+/);
        const orig = parts[0].trim();
        const exported = parts.length === 2 ? parts[1].trim() : orig;
        return `__exports.${exported} = ${tmp}.${orig};`;
      })
      .join('\n');
    return `const ${tmp} = __require(${JSON.stringify(id)});\n${lines}`;
  });

  // 5. Replace `export const/let/var NAME = ...`
  code = code.replace(/export\s+(const|let|var)\s+([A-Za-z0-9_$]+)\s*=/g, (_, kw, name) => {
    return `${kw} ${name} = __exports.${name} =`;
  });

  // 6. Replace `export function NAME(...)`
  code = code.replace(/export\s+function\s+([A-Za-z0-9_$]+)\s*\(/g, (_, name) => {
    return `__exports.${name} = ${name}; function ${name}(`;
  });

  // 7. Replace `export { a, b as c };`
  code = code.replace(/export\s*\{([\s\S]*?)\}\s*;?/g, (_, list) => {
    return list
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const parts = s.split(/\s+as\s+/);
        const local = parts[0].trim();
        const exported = parts.length === 2 ? parts[1].trim() : local;
        return `__exports.${exported} = ${local};`;
      })
      .join('\n');
  });

  return code;
}

let bundle = `(function() {\nconst __modules = {};\nconst __cache = {};\nfunction __require(id) {\n  if (__cache[id]) return __cache[id];\n  const exports = {};\n  __cache[id] = exports;\n  __modules[id](exports, __require);\n  return exports;\n}\n\n`;

for (const filePath of order) {
  const id = toModId(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const transformed = transformESMtoCJS(raw, path.dirname(filePath));
  bundle += `__modules[${JSON.stringify(id)}] = function(__exports, __require) {\n${transformed}\n};\n\n`;
}

bundle += `__require("src/main.js");\n})();\n`;

fs.writeFileSync('bundle.js', bundle, 'utf8');
console.log('Successfully generated bundle.js (' + (bundle.length / 1024).toFixed(1) + ' KB)');
