# 内容仓重构 · 干跑报告（dry run）

**状态：未执行任何改动。** 本文档只描述「如果执行，会发生什么」，供你确认。

---

## 一、目标结构

按你的决定：扁平为 **一级=模型名，二级=工程**，工程内部保留原样（方案 C）。

```
<模型>/
└── <任务名>/
    ├── meta.json          ← 新增：工程元数据
    └── （原工程目录原样保留：src/ assets/ output/ index.html …）
```

工具链（harness）从**路径**移到 **meta.json**。原二级目录 `antigravity` / `dsh` / `zcode` / `codex` 等消失。

---

## 二、迁移总览

| 项目 | 数量 |
|---|---|
| 模型 | 6 |
| 现有作品（shot/revision 叶子） | 39 |
| 扁平化后保留 | **32** |
| 被淘汰（落选版本） | **7** |
| 需新建 meta.json | 32 |

淘汰的 7 个只是**不保留工程文件**；按你的说明，其经过与淘汰理由会写进保留版本的 meta 里（见第四节）。

---

## 三、多版本裁决（7 组）

判定依据：README 自述的迭代关系 + 评分 + 交付完整度。**没有一组是靠编号猜的。**

### 3.1 `gemini-3.8-flash / Sakura Station`
| 版本 | 评分 | 保留 | 理由 |
|---|---|---|---|
| shot01 | 无 | ❌ 淘汰 | 首版被评审指出「车窗垂直于车身」等建模错误（评级 C） |
| shot02 | **不合格** | ⚠️ **见下方冲突** | 针对首版问题做了全面修复 |

**冲突**：shot01 被指有 C 级问题（未落评分），shot02 修了问题但**判定不合格**。
两者都不理想。**倾向保留 shot02**——它修复了确切缺陷、文档更完整；但也可能你希望保留 shot01 的评级记录。**此项请你确认。**

### 3.2 `glm-5.3-flash / World.Execute(me)`
| 版本 | 评分 | 保留 | 理由 |
|---|---|---|---|
| shot01 | 无 | ❌ | 第一版「终端/机房风格」 |
| shot02 | 无 | ❌ | 第二版「白纸提线木偶剧场」 |
| shot03 | 无 | ✅ **保留** | 第三版「黄铜浑天仪 + 星野」 |
| shot04 | **不合格** | ❌ | 明确测试不合格 |

理由：shot01~03 是 README 明示的**三版视觉重做**（非修补），shot03 是最新一版；shot04 被判定不合格。**保留 shot03。**

### 3.3 `glm-5.3-flash / Sakura Station`
| 版本 | 保留 | 理由 |
|---|---|---|
| shot01 | ❌ | 首版（4.4 MB，含 5 张媒体，无修复记录） |
| shot02 | ✅ **保留** | README 明示「针对首版评审（评级 C）已完成同类错误全面排查与修复」 |

理由：shot02 是对 shot01 的**修复版**，语义上取代前版。

### 3.4 `deepseek-v4.1-flash / dsh / Pure Line Room`
| 版本 | 保留 | 说明 |
|---|---|---|
| shot01 | ❌ | 中文 README，83 文件 / 1.5 MB |
| shot02 | ❌ | 中文 README，37 文件 / 0.9 MB |
| shot03 | ✅ **保留** | **英文 README**，描述最完整（含真实时钟、唱片机等细节） |

理由：三次是**同题不同演绎**，无评分、无修复关系。shot03 文档最完整、功能描述最丰富。**此项把握度较低，建议你复核。**

### 3.5 `glm-5.3-flash / Pure Line Room`
| 版本 | 保留 | 说明 |
|---|---|---|
| shot01 | ❌ | 14 文件 |
| shot02 | ❌ | 28 文件，含昼夜交替 |
| shot03 | ✅ **保留** | 37 文件，文档最全，含 `_dev/serve.js` |

理由同 3.4：无评分，取内容与文档最完整者。**把握度较低。**

### 3.6 `deepseek-v4.1-flash / dsh / World.Execute(me)`
| 版本 | 保留 | 说明 |
|---|---|---|
| shot01 | ✅ **保留** | 29.9 MB / 54 文件，含 8 个媒体交付物 |
| shot02 | ❌ | 7.4 MB / 32 文件，**无媒体交付物** |

理由：shot01 明显是完整交付（含成片与截图）；shot02 体量小且无产物。**保留 shot01。**

### 3.7 `gemini-3.8-flash / World.Execute(me) MV`
| 版本 | 评分 | 保留 | 理由 |
|---|---|---|---|
| shot01 | 无 | ❌ | 「浏览器原生程序化生成」 |
| shot02 | **C** | ✅ **保留** | 加入「AI 意象原画 + 3D/4D 几何」 |

理由：shot02 是 shot01 的**能力升级版**（增加了 AI 生图环节），且有明确评分记录 C。**保留 shot02。**

---

## 四、meta.json 设计

```jsonc
{
  "$schema": "./meta.schema.json",

  "model":     "gemini-3.8-flash",
  "provider":  "Antigravity 订阅（Google 官方）",   // 自由文本，按你的要求
  "harness":   "antigravity",

  "task":      "Sakura Station",
  "prompt":    "prompts/场景_3D/Sakura Station.md",
  "date":      "2026-10-03",

  "environment": {
    "os":   "Windows 11 专业版 (build 26300, x64)",
    "cpu":  "Intel Core i5-1135G7 (4C/8T @ 2.40GHz)",
    "gpu":  "NVIDIA GeForce GTX 1650 Ti 4GB + Intel Iris Xe",
    "ram":  "16 GB"
  },

  "grade":       null,          // "A-" | "不合格" | null（无留存结论）
  "gradeReason": null,          // 评分依据原文摘要

  "attempts": 2,
  "kept":     "shot02",
  "rejected": [                 // 落选版本：只留记录，不留工程文件
    { "version": "shot01", "grade": null,
      "reason": "首版被评审指出「车窗垂直于车身」等建模错误" }
  ],

  "deliverables": {
    "kind":  "interactive",     // interactive | video | assets
    "entry": "index.html",
    "videoUrl": null            // 视频外链，发布后回填
  },

  "reviewNotes": "..."          // 评审原文，含负面意见
}
```

### 字段来源说明（诚实标注）

| 字段 | 来源 |
|---|---|
| `model` / `harness` / `task` | **从现有路径机器提取**，准确 |
| `environment` | **本机实测**（见上），39 个作品共用 |
| `prompt` | 按任务名映射到 `prompts/` 下文件，**需人工确认映射** |
| `grade` / `gradeReason` | **从 README 正则提取**，仅 9/39 命中，其余为 `null` |
| `date` | 从 README 提取，**部分缺失** |
| `provider` | ⚠️ **README 中完全无此信息**，无法自动填充 |
| `deliverables.kind` | 由实际文件推断（有 `index.html` → interactive） |
| `reviewNotes` | 需从 README 截取，**建议先留空由你后补** |

---

## 五、必须你确认的阻塞项

### 阻塞 1：`provider` 无任何数据来源
我扫描了全部 39 个 README，**没有任何一处提到 provider**（官方 API / 订阅 / 三方 API）。
按你说的「灵活填写」，我会写成自由文本，但**具体值只能你来给**。建议给一份对应表，例如：

| harness | provider（待你填） |
|---|---|
| `antigravity` | ? |
| `dsh` | ? |
| `dsh(cb2api)` | ? |
| `zcode` | ? |
| `codex` / `codex(agy2api)` | ? |
| `pi(agy2api)` | ? |

在你给出之前，我会先写 `"provider": null`，不编造。

### 阻塞 2：3.1（gemini Sakura Station）取舍
**已确认：保留 shot02。**（shot01 有「车窗垂直于车身」等建模错误记录，shot02 已修复）

### 阻塞 3：prompt 映射
**已确认：`City Corner P1 Plus` 项目整体去掉**（两个模型下的各一个），因为它没有对应提示词。
其余任务与 `prompts/` 逐一对应：

| 任务名 | prompt 状态 |
|---|---|
| Pure Line Room | ✅ 精确 |
| City Corner P1 | ✅ 精确 |
| Rural China P1 | ✅ 精确 |
| Rural China P1 Plus | ✅ 精确 |
| Sakura Station | ✅ 精确 |
| Time Gallery | ✅ 精确 |
| My Soul Knight | ✅ 精确 |
| Riding Pelican | ✅ 精确 |
| World.Execute(me) MV | ✅ 精确 |
| **World.Execute(me)** | ⚠️ 只有 `World.Execute(me) MV.md`，但这是**两个不同任务**，仍写 `null` |

### 阻塞 1（已解除）：`provider` 来源
**provider 一直编码在工具链目录名的括号里**，此前被忽略：

| harness 写法 | 含义 |
|---|---|
| 无括号，如 `antigravity` / `dsh` / `zcode` / `codex` | 官方 API / 订阅 |
| 有括号，如 `dsh(cb2api)` / `codex(agy2api)` / `pi(agy2api)` | 特殊渠道（括号内为渠道名） |

实测 9 个工具链目录**全部符合**该规律。迁移时按此归一到 meta：

```jsonc
// 官方
"harness": "antigravity",  "provider": { "kind": "official", "channel": null }
// 特殊渠道
"harness": "dsh",          "provider": { "kind": "third-party", "channel": "cb2api" }
```

即：`harness` 取括号前的部分，渠道名移入 `provider.channel`。

---

## 六、执行时会做什么（确认后）

1. 新建 `tools/rebuild-structure.ps1`，**先备份** `.git` 外的工作树到 `../ai-benchmark-backup/`；
2. 按第三节裁决，`git mv` 保留版本到 `<模型>/<任务>/`（保留 git 历史）；
3. 删除落选版本的工程文件（记录写入 meta）；
4. 为 32 个作品生成 `meta.json`；
5. 更新 `tools/build-manifest.ps1` 以读取新结构；
6. 更新根 `README.md` 的目录结构章节与模型表；
7. 同步更新展示仓的 `build.mjs`（manifest 格式不变，理论上无需改动）；
8. 全量验证：路径引用、展示仓重建、矩阵渲染。

---

## 七、风险

| 风险 | 缓解 |
|---|---|
| 工程内相对路径断裂 | 方案 C 保留工程内部结构，**移动整目录**不影响内部相对路径 |
| 落选版本误删且无法恢复 | 执行前完整备份到仓库外；且均已在 git 历史中，可回溯 |
| 展示仓 manifest 失效 | 保持 `manifest.json` 字段兼容，仅 `path` 变化 |
| provider 字段长期空缺 | 先置 `null`，schema 允许为空 |
