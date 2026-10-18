---
name: ai-lab-curator
description: >-
  Orchestrate benchmark evaluation archiving and publishing workflows for the
  l4place0/ai-lab repository: resolve or create initial prompts in prompts/,
  sanitize and bundle project deliverables into <model>/<task>/, capture 1080p
  WebGL/HTML cover screenshots, generate meta.json and README.md, rebuild
  manifest.json, and push with Git LFS and showcase site notification.
---

# AI Lab Curator（AI Benchmark Lab 评测归档与发布工作流）

`ai-lab-curator` 是面向 [`l4place0/ai-lab`](https://github.com/l4place0/ai-lab) 评测内容仓的标准归档与发布技能（Workflow Orchestrator）。当用户完成模型评测并给出评分（`S` / `A` / `B` / `C` / `不合格`）要求上传至 `l4place0/ai-lab` 时，严格按本工作流执行。

---

## 核心工作流（Standard Operating Procedure）

```text
[用户给出评分 & 上传指令]
  │
  ├─► 1. 提示词溯源 (Prompt Resolution):
  │      ├─ 检查 prompts/ 下是否已有对应任务的初始提示词
  │      ├─ 若有 -> 直接引用相对路径 (如 prompts/场景_3D/<Task>.md)
  │      └─ 若无 -> 提取初始提示词创建 prompts/<分类>/<Task>.md，再指向该路径
  │
  ├─► 2. 工程净化与免服务打包 (Sanitization & Standalone Bundle):
  │      ├─ 剔除 node_modules/、临时缓存、日志及本地视频成片 (.mp4/.webm 仅留外链)
  │      └─ WebGL/Three.js 项目生成离线 bundle.js 与 index.html / index.htm 免服务双入口
  │
  ├─► 3. 封面截图与视觉复核 (Cover Capture & Verification):
  │      ├─ 确保存在封面图（优先 preview/01-hero.png）
  │      ├─ 若缺失 -> 调度 Chrome Headless CDP (SwiftShader WebGL) 截取 1920x1080 画面
  │      └─ 强制调用 view_file 肉眼复核封面图（严禁黑屏或未渲染完成的截图入库）
  │
  ├─► 4. 元数据与文档落盘 (Metadata & Documentation):
  │      ├─ 落盘路径: <model>/<task>/（如 gemini-4-argon/London Rainy Cafe/）
  │      ├─ 生成 meta.json（含 model, provider, harness, task, prompt, grade, attempts 等）
  │      ├─ 生成项目级 README.md（含评测信息、封面、实现要点与运行方式）
  │      └─ 更新仓库根 README.md 的「模型总表」与「任务类型表」
  │
  └─► 5. 索引重建与远端同步 (Manifest Rebuild & Git Push):
         ├─ 执行 tools/build-manifest.ps1 更新 manifest.json 并核验字段完备性
         ├─ git add -> git commit -> git push origin main（含 Git LFS 二进制上传）
         └─ 执行 tools/notify-site.ps1 触发展示站 (l4place0-cloud/ai-lab-site) 自动同步
```

---

## 步骤详解与仓库铁律

### 阶段一：提示词溯源与补齐（Prompt Resolution）

- **唯一自变量原则**：`prompts/` 目录存放所有横评任务的原始提示词，按任务类型归类：
  - `prompts/场景_3D/<Task>.md`（3D 场景类，如 `City Corner P1.md`、`London Rainy Cafe.md`、`Rural China P1.md`、`Sakura Station.md`）
  - `prompts/WebGL/<Task>.md`（WebGL 交互类，如 `Pure Line Room.md`、`Time Gallery.md`）
  - `prompts/<Task>.md`（MV / 游戏 / 其他类，如 `World.Execute(me) MV.md`、`My Soul Knight.md`）
- **存在性检查与自动创建**：
  1. 先在 `prompts/` 下检索是否存在对应任务的 `.md` 文件。
  2. **若已存在**：在 `meta.json` 的 `prompt` 字段中直接填入其相对路径（使用正斜杠 `/`）。
  3. **若不存在**：将用户本轮测试的原始提示词完整写入 `prompts/<分类>/<Task>.md`，随后在 `meta.json` 中指向该新建文件。

### 阶段二：目录命名与工程净化（Layout & Sanitization）

- **扁平二级目录结构**：`<model>/<task>/`
  - `<model>`：统一使用小写连字符格式（如 `claude-opus-5.5`、`deepseek-v4.1-flash`、`gemini-3.8-flash`、`gemini-4-argon`、`glm-5.3-flash`、`gpt-6-astra`、`gpt-6.1-sol`）。
  - `<task>`：使用规范英文任务名（如 `London Rainy Cafe`、`Rural China P1 Plus`、`Sakura Station`）。
- **版本保留原则**：
  - 每个 `<model>/<task>/` 目录只平铺保留**效果最好的一次**工程文件（记录在 `meta.json` 的 `kept` 字段，如 `"shot01"` 或 `"ld02"`）。
  - 落选版本不保留文件，但须在 `meta.json` 的 `rejected` 数组中登记 `{ "version": "...", "grade": "...", "reason": "..." }`。
- **文件清理红线**：
  - **严禁上传**：`node_modules/`、`_build/`、`dist/`、`.chrome*` 临时目录、Python 虚拟环境、日志（`*.log`）、缓存及本地 `.mp4`/`.webm`/`.mov` 视频文件（视频成片须发布至外部平台并填入 `deliverables.videoUrl`）。
  - **免服务可直接运行**：交互式网页作品应保留预览直接引用的打包脚本（如 `bundle.js`）与 `index.html`（确保双击 `file://` 或静态托管均可直接运行）。

### 阶段三：封面截图捕获与 Git LFS 规范（Cover & LFS）

- **封面自动识别优先级**（由 `tools/build-manifest.ps1` 的 `Get-Cover` 定义）：
  1. `preview/01-hero.png`（推荐首选）
  2. `output/cover.jpg` / `output/cover_4x3.jpg` / `cover.jpg` / `output/cover.png`
  3. `preview/02-overview.png` / `preview_03s.png`
- **WebGL 作品无头截图方案**：
  - 确保 `THREE.WebGLRenderer` 开启 `preserveDrawingBuffer: true`。
  - 使用 Chrome Headless CDP（配合 `--headless=new --no-sandbox --enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader`）通过 `Page.navigate` 加载页面，等待 3~4 秒渲染稳定后调用 `Page.captureScreenshot` 保存至 `preview/01-hero.png`。
  - **强制视觉复核**：截图生成后必须调用 `view_file` 检查图片内容，确认画面完整渲染、无黑屏或报错。

### 阶段四：元数据契约（`meta.json` Schema）

每个 `<model>/<task>/meta.json` 必须严格遵循以下结构（参考 [`resources/meta.template.json`](./resources/meta.template.json)）：

```json
{
    "$schema": "./meta.schema.json",
    "model": "gemini-4-argon",
    "provider": {
        "kind": "official",
        "channel": null
    },
    "harness": "antigravity",
    "task": "London Rainy Cafe",
    "prompt": "prompts/场景_3D/London Rainy Cafe.md",
    "date": "2026-10-18",
    "environment": {
        "os": "Windows 11 专业版 (build 26300, x64)",
        "cpu": "Intel Core i5-1135G7 (4C/8T @ 2.40GHz)",
        "gpu": "NVIDIA GeForce GTX 1650 Ti 4GB + Intel Iris Xe",
        "ram": "16 GB"
    },
    "grade": "A",
    "gradeReason": null,
    "attempts": 1,
    "kept": "ld02",
    "rejected": [],
    "deliverables": {
        "kind": "interactive",
        "entry": "index.html",
        "videoUrl": null
    },
    "reviewNotes": null
}
```

- `provider.kind`：官方直连/订阅填 `"official"`（`channel: null`）；第三方中转填 `"third-party"` 并在 `channel` 填写渠道名（如 `"cb2api"`）。
- `grade`：仅限 `"S"`、`"A+"`、`"A"`、`"A-"`、`"B+"`、`"B"`、`"B-"`、`"C"`、`"不合格"` 或 `null`。

### 阶段五：一键归档脚本与索引同步（Automation & Sync）

可直接调用本技能附带的自动化脚本 [`scripts/publish-work.ps1`](./scripts/publish-work.ps1) 完成文件净化拷贝、`meta.json` 生成、`manifest.json` 重建与 Git 推送：

```powershell
powershell -ExecutionPolicy Bypass -File "skills/ai-lab-curator/scripts/publish-work.ps1" `
  -RepoRoot "d:/tmp/ai-lab" `
  -SourceDir "d:/tmp/ld02" `
  -Model "gemini-4-argon" `
  -Task "London Rainy Cafe" `
  -Grade "A" `
  -Harness "antigravity" `
  -PromptRelPath "prompts/场景_3D/London Rainy Cafe.md" `
  -Kept "ld02" `
  -Push
```

每次新增或更新作品后，必须验证：
1. `tools/build-manifest.ps1` 输出中无 `directories without meta.json` 警告。
2. `manifest.json` 中对应条目的 `entry`、`cover`、`grade`、`prompt`、`hasDoc` 均已正确解析。
3. 仓库根目录 `README.md` 的模型与任务表格已同步包含新条目。
