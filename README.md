# AI Benchmark Lab

**AI 模型实战评测、横评数据与视频展示实验室。**

用同一批真实创意编程任务横评不同 AI 模型与 Agent 工具链，公开完整过程记录、可复现交付物与评审结论——不是跑分表，而是「同一个需求交给不同模型，谁真的做出来了」的实战对照。

---

## 这是什么

把同一份提示词分别交给不同厂商的模型、在不同 IDE / Agent 工具链里执行，然后保留全部原始产物：源码、素材、中间分析数据、渲染脚本、成片视频、评审意见与复盘结论。

评测结论按 **S / A / B / C / 不合格** 分级，评分理由与反驳意见一并留档，包括被用户当场推翻的自评——失败案例同样是数据。

## 目录结构

顶层为**模型**，其下为**任务**。每个任务只保留效果最好的一次，工程文件直接平铺在任务目录内，旁边是一份 `meta.json`。

```
<模型>/
└── <任务名称>/
    ├── meta.json     # 工具链、提供商、环境、评分、交付物形态
    ├── README.md     # 该次运行的经过与评测记录
    └── ...           # 工程文件与交付物
```

`meta.json` 是机器可读的索引，[`tools/build-manifest.ps1`](tools/build-manifest.ps1) 据此生成 [`manifest.json`](manifest.json)，供展示站消费。

| 模型 | 工具链（提供商） | 已保留任务 |
|---|---|---|
| **Claude Opus 5.5** | `antigravity` | World.Execute(me) |
| **DeepSeek v4.1 Flash** | `dsh`、`dsh` (cb2api) | Pure Line Room, World.Execute(me), World.Execute(me) MV, Rural China P1 Plus |
| **Gemini 3.8 Flash** | `antigravity` | World.Execute(me) MV, Sakura Station, Rural China P1, Rural China P1 Plus, Pure Line Room, Time Gallery, My Soul Knight |
| **Gemini 4 Argon** | `antigravity` | London Rainy Cafe |
| **GLM 5.3 Flash** | `zcode` | World.Execute(me), Pure Line Room, Sakura Station, Rural China P1, Rural China P1 Plus, Time Gallery, My Soul Knight, Riding Pelican |
| **GPT-6 Astra** | `codex` | World.Execute(me) MV |
| **GPT-6.1 Sol** | `codex` | World.Execute(me) MV |

工具链名称带括号表示经**第三方渠道**接入，括号内为渠道名（如 `cb2api`）；不带括号即为官方 API / 订阅。渠道记在 `meta.json` 的 `provider` 字段。

> 同一模型可经不同工具链执行；任务名因此可能重复，此时保留全部并在 `meta.json` 中区分 `harness`。

### 任务类型

| 类型 | 任务 | 提示词 |
|---|---|---|
| 音乐视频 / 程序化 MV | World.Execute(me) MV | [`prompts/World.Execute(me) MV.md`](prompts/World.Execute%28me%29%20MV.md) |
| 3D 场景 | City Corner P1, City Corner P1 Plus, London Rainy Cafe, Rural China P1, Rural China P1 Plus, Sakura Station | [`prompts/场景_3D/`](prompts/场景_3D) |
| WebGL 交互 | Pure Line Room, Time Gallery | [`prompts/WebGL/`](prompts/WebGL) |
| 游戏 / 其他 | My Soul Knight, Riding Pelican | [`prompts/My Soul Knight.md`](prompts/My%20Soul%20Knight.md), [`prompts/Riding%20Pelican.md`](prompts/Riding%20Pelican.md) |

- [`prompts/`](prompts) —— 原始任务提示词，按任务类型整理，是横评的**唯一自变量**。
- 各模型目录 —— 平铺该模型保留下来的任务。
- 每个作品 —— 运行方式、素材来源、渲染参数与评测记录见其目录内的 README。

很多任务会在不同模型下重复出现（如 `Pure Line Room`、`World.Execute(me) MV`），这些同名目录就是**同题横评的对照样本**。

### 落选版本

每个任务只留最后效果最好的一次。落选版本的文件不保留，但会记进 `meta.json` 的 `rejected` 字段，说明是第几次、什么原因，避免「只看得见胜者」。

## 获取完整交付物

仓库保留源码、素材与**封面/截图**；**视频成片不纳入版本控制**，统一发布到视频平台（见各作品的 README 链接）。

图片、音频、字体、体素及二进制模型等文件使用 Git LFS。克隆前安装 Git LFS，然后执行：

```sh
git lfs install
git clone https://github.com/l4place0/ai-lab.git
cd ai-lab
git lfs pull
```

> 未执行 `git lfs pull` 时，二进制文件只会是几百字节的指针文件，贴图与模型无法正常显示。

## 仓库拆分

本仓库是**内容仓**，存放工程文件与交付物；展示站（[`ai-lab-site`](https://github.com/l4place0-cloud/ai-lab-site)）是独立的**展示仓**，通过 `manifest.json` 与本仓库解耦——展示层只引用路径与元数据，不复制资产。

## 文件管理

保留源码、提示词、素材、交付物、展示截图、评测记录与 `meta.json`。**视频成片、临时渲染片段、浏览器用户数据、缓存、日志和原始 PCM 等不纳入版本控制。**

`node_modules`、`_build`、Python 虚拟环境、便携 Node / FFmpeg / Chrome 和下载的模型属于本地运行依赖，不上传；需要重建作品时，请按各项目说明准备对应依赖。预览和分析脚本直接引用的随附 JavaScript 库及许可证保留在仓库中。
