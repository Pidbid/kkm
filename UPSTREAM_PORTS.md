# KKM 上游移植记录

本文件是 KKM 从 [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code) 选择性移植通用功能的唯一长期记录。  
目标是让后续维护者能够明确判断：哪些上游 PR 已经进入 KKM、采用的是哪个提交、移植时上游是否已合并，以及哪些改动被有意排除。

## 规则

- 只采用基础能力、通用兼容性、可靠性、性能和跨平台修复。
- 默认排除 Kimi 账号、登录、额度、反馈、托管配置、遥测身份和其他厂商业务。
- “Upstream merged” 表示移植时已被上游合并。
- “Pinned open PR” 表示 KKM 提前采用了当时仍开放的 PR，并固定到表中的 head SHA；该 PR 后续新增的提交不自动视为已进入 KKM。
- KKM 对补丁进行了冲突融合，不保证 KKM 提交 SHA 与上游一致；上游 PR 与固定 head SHA 是来源依据。
- 每次同步都必须更新本文件，并在 KKM PR 与 Release Notes 中引用对应批次。

## Batch 2026-08-04 — 官方与社区通用修复

KKM 分支：`agent/upstream-port-20260804`  
目标基线：KKM `main` @ `f6fb808749e421bf1a6d767993a70889e65db863`  
KKM PR：待创建  
状态：移植完成，等待 KKM CI 验证与合并。

本批次重新检查了上游已合并 PR 与仍开放的社区 PR。筛选标准仍是基础能力、可靠性、跨平台和协议兼容；不移植 Kimi 账号、登录、额度、托管配置、反馈、遥测身份等厂商业务。

### 上游已合并（官方采纳）

| Upstream PR | 固定 head SHA | 功能 | KKM 处理 |
|---|---|---|---|
| [#744](https://github.com/MoonshotAI/kimi-code/pull/744) | `3462a77c7785` | legacy SSE MCP：配置、ACP、插件、OAuth 与文档 | 与 KKM 已有实现对照融合，补齐缺口 |
| [#2565](https://github.com/MoonshotAI/kimi-code/pull/2565) | `5d8ff30c6c77` | `/fork` 后保持在原会话，避免中断运行中的任务 | 按 KKM 品牌与现有会话 API 适配，并保留测试 |
| [#2567](https://github.com/MoonshotAI/kimi-code/pull/2567) | `0dd51b89310a` | 恢复会话时回放 `profile.bind`，保留工具配置 | 完整移植 v1 兼容路径与测试 |
| [#2585](https://github.com/MoonshotAI/kimi-code/pull/2585) | `b35eb4d54d22` | 支持包含冒号的 question/tool-call ID | 融合 KKM 的 session lifecycle 路径 |
| [#2596](https://github.com/MoonshotAI/kimi-code/pull/2596) | `5387387a4208` | MCP `structuredContent` / `_meta` 传递给模型 | 移植当前 v1/v2 输出路径；不创建缺失的新版 `mcpCore` 树 |
| [#2600](https://github.com/MoonshotAI/kimi-code/pull/2600) | `422c0d8e970a` | 过滤 MCP 协议保留的 `_meta` 键 | 与 #2596 成组移植并覆盖序列化测试 |
| [#2609](https://github.com/MoonshotAI/kimi-code/pull/2609) | `a46bc7610e49` | OAuth token 更新时保留 `expiresAt` | 完整移植兼容路径与测试 |
| [#2620](https://github.com/MoonshotAI/kimi-code/pull/2620) | `8cef67f8af8c` | OAuth 回调地址变化时废弃陈旧 client registration | 移植现有 v1 OAuth 路径；新版 `mcpCore` 部分暂缓 |

### KKM 提前采用的开放社区 PR

| Upstream PR | 固定 head SHA | 功能 | 风险控制 |
|---|---|---|---|
| [#2430](https://github.com/MoonshotAI/kimi-code/pull/2430) | `523b048e37cd` | Windows 下托管插件更新规避 `EBUSY` | rename-swap 小补丁，带回滚/测试 |
| [#2452](https://github.com/MoonshotAI/kimi-code/pull/2452) | `6c2e94a12d0a` | Web 静态资源缓存头 | 上游 CI 已通过；仅缓存策略 |
| [#2500](https://github.com/MoonshotAI/kimi-code/pull/2500) | `cf75a345e1d6` | 工具参数中字符串形式的 number/boolean/array 定向纠正 | 仅对类型失败字段重试，避免全局强制转换 |
| [#2501](https://github.com/MoonshotAI/kimi-code/pull/2501) | `63677cd0db72` | provider 刷新时保留 fallback/default | 原子刷新路径与测试一并移植 |
| [#2502](https://github.com/MoonshotAI/kimi-code/pull/2502) | `089d59a09b64` | 将成功的 PreToolUse hook stdout 追加到模型上下文 | 覆盖 turn、subagent、后台任务与 projector |
| [#2508](https://github.com/MoonshotAI/kimi-code/pull/2508) | `1ce0e7ec0f8c` | 跳过空 reasoning 流片段 | KKM 已有更严格兼容逻辑；补齐关联路径 |
| [#2509](https://github.com/MoonshotAI/kimi-code/pull/2509) | `09e6a339ac65` | Web 重载历史时合并连续流式文本/思考片段 | 按 KKM 已有块渲染逻辑手工融合，保留边界 |
| [#2510](https://github.com/MoonshotAI/kimi-code/pull/2510) | `0265111eca76` | WSL 图片粘贴使用 PowerShell STA 与 PNG 格式 | 保留 KKM 的安全临时路径传递，补齐测试 |
| [#2511](https://github.com/MoonshotAI/kimi-code/pull/2511) | `eb224a2c7143` | Edit 拒绝意外的大范围空替换删除 | v1/v2 编辑器实现与测试同步 |
| [#2513](https://github.com/MoonshotAI/kimi-code/pull/2513) | `3314f6a731a1` | Web 超长代码行稳定渲染 | CSS/渲染性能小修复 |
| [#2537](https://github.com/MoonshotAI/kimi-code/pull/2537) | `82958df646ef` | v1 正确遵守 `[tools].disabled` | 配置层小修复与单测 |
| [#2541](https://github.com/MoonshotAI/kimi-code/pull/2541) | `72514bc0aef8` | Bash 退出后仍保留迟到 stdout | 生命周期与 e2e 测试同步 |
| [#2544](https://github.com/MoonshotAI/kimi-code/pull/2544) | `eade0e38a592` | 展开 `KIMI_CODE_HOME=~/...` | 跨平台路径小修复 |
| [#2603](https://github.com/MoonshotAI/kimi-code/pull/2603) | `1dee7cfbc9ad` | transcript fold 后回收旧 UI entry | 上游 CI 已通过；加入独立回归测试 |
| [#2621](https://github.com/MoonshotAI/kimi-code/pull/2621) | `43446ed556f8` | 裁剪 shell-only transcript turn，并限制保存输出大小 | 上游 CI 已通过；与 KKM TUI 逻辑融合 |

### 建议继续关注但本批次不合并

| Upstream PR | 原因 / 后续条件 |
|---|---|
| [#2586](https://github.com/MoonshotAI/kimi-code/pull/2586) | MCP 非阻塞启动依赖 KKM 尚未引入的 v2 workspace/session lifecycle；需整套架构到位后移植 |
| [#2608](https://github.com/MoonshotAI/kimi-code/pull/2608) | v2 MCP OAuth opt-in 全部位于缺失的新版 `mcpCore`；不能只移植半套 |
| [#2573](https://github.com/MoonshotAI/kimi-code/pull/2573) | 自定义 Agent identity 涉及约 79 个文件且以 v2 为主，需单独设计迁移批次 |
| [#2612](https://github.com/MoonshotAI/kimi-code/pull/2612) | Skill watcher 的 FD 修复依赖 #2366 的新 skill service 架构 |
| [#2202](https://github.com/MoonshotAI/kimi-code/pull/2202) | 终端鼠标选择跨约 33 个文件，仍属实验性 UI 行为 |
| [#2604](https://github.com/MoonshotAI/kimi-code/pull/2604) | minidb 大型重构，基础收益不足以覆盖迁移风险 |
| [#2593](https://github.com/MoonshotAI/kimi-code/pull/2593) | engine-native image refs 仍为 draft，且依赖 v2 turn/wire |
| [#2610](https://github.com/MoonshotAI/kimi-code/pull/2610) | session effort flag 跨 24 个文件，需先确认 KKM 对模型 effort 的统一策略 |
| [#2578](https://github.com/MoonshotAI/kimi-code/pull/2578), [#2579](https://github.com/MoonshotAI/kimi-code/pull/2579) | Web UI 小修可用但优先级低，等待与下一次 Web 专项批次合并 |

### 本批次验证

- 验证提交：待 CI
- CI：待运行
- Nix Build：待运行
- 合并提交：待合并

## Batch 2026-07-31 — 通用基础更新

KKM 分支：`agent/upstream-port-20260731`  
目标基线：KKM `main` @ `41dd24a4ec55350f3fb02da95b05af9feb96d695`  
KKM PR：[Pidbid/kkm#4](https://github.com/Pidbid/kkm/pull/4)  
状态：已完成移植与基线核验；全套 CI 通过后由 PR #4 合并到 `main`。

### 移植时已被上游合并

| Upstream PR | 固定 head SHA | 功能 | KKM 处理 |
|---|---|---|---|
| [#2395](https://github.com/MoonshotAI/kimi-code/pull/2395) | `ac32b1463b88` | 损坏或字段缺失的会话缓存按冷缓存处理并从磁盘重建 | 完整移植并保留测试 |
| [#2410](https://github.com/MoonshotAI/kimi-code/pull/2410) | `8fe78831daee` | 模型供应商刷新使用原子配置转换，避免临时出现“model is not configured” | 完整移植；融合 KKM 测试桩 |
| [#2415](https://github.com/MoonshotAI/kimi-code/pull/2415) | `bc630c02567c` | Web 代码块启用 Monaco 高亮 | 完整移植，包含依赖与锁文件 |
| [#2125](https://github.com/MoonshotAI/kimi-code/pull/2125) | `41eb00898907` | 统一 Web 权限模式顺序与风险颜色 | 完整移植；保留 KKM 设置页面扩展 |
| [#2449](https://github.com/MoonshotAI/kimi-code/pull/2449) | `08c9b1ffff2e` | 次级模型实验关闭时移除无效的 Agent `model` 参数 | 完整移植到 v1/v2 Agent 与 AgentSwarm |
| [#2442](https://github.com/MoonshotAI/kimi-code/pull/2442) | `47ab1f4d18c6` | 减少 TUI 破坏性全屏重绘 | 完整移植；融合 KKM 终端鼠标跟踪逻辑 |
| [#2459](https://github.com/MoonshotAI/kimi-code/pull/2459) | `b85b1d78529f` | 修复 Monaco/markstream 升级后的代码块字体、行号和布局 | 与 #2415 成组移植并固定依赖版本 |
| [#2416](https://github.com/MoonshotAI/kimi-code/pull/2416) | `2aa3e9e67170` | models.dev 不可访问时使用内置目录快照 | 完整移植到 CLI、TUI 与 SDK 测试 |

### KKM 提前采用的开放 PR

| Upstream PR | 固定 head SHA | 功能 | 风险控制 |
|---|---|---|---|
| [#1987](https://github.com/MoonshotAI/kimi-code/pull/1987) | `d224948189bf` | Skill 加载失败时显示明确警告 | 同时覆盖 v1、v2、server 与测试 |
| [#2137](https://github.com/MoonshotAI/kimi-code/pull/2137) | `52c1606a4585` | 流式读取 `wire.jsonl`，降低长会话峰值内存 | 保留原 API 语义并移植读取路径 |
| [#2249](https://github.com/MoonshotAI/kimi-code/pull/2249) | `a7c94d234e1e` | 阻止空图片数据污染并永久卡死会话 | 覆盖 Web、v1/v2 Agent、server、klient 与测试 |
| [#2306](https://github.com/MoonshotAI/kimi-code/pull/2306) | `4501fb563b31` | 新增 `/context` 上下文占用明细 | 移植 CLI/TUI、RPC、SDK、文档与测试 |
| [#2307](https://github.com/MoonshotAI/kimi-code/pull/2307) | `f6127aeed816` | 校验 `installed.json` 插件记录，拒绝损坏数据 | 基线能力已存在；核对固定 SHA，并修正 changeset 的包归属 |
| [#2338](https://github.com/MoonshotAI/kimi-code/pull/2338) | `cd39572bc83e` | Anthropic 请求省略不兼容的工具 Schema | 基线能力已存在；核对固定 SHA，未用上游整文件覆盖 KKM 基线 |
| [#2423](https://github.com/MoonshotAI/kimi-code/pull/2423) | `6066b21a6a59` | 注册 MCP server 时过滤已禁用工具，并修正 Agent 超时描述 | 完整移植小型补丁及测试 |
| [#2446](https://github.com/MoonshotAI/kimi-code/pull/2446) | `ea96d2286648` | 为停滞的 LLM 流增加超时和错误分类 | 同时覆盖 kosong 与 agent-core-v2 适配层及测试 |

### 本批次明确未合并

| Upstream PR | 原因 |
|---|---|
| [#2453](https://github.com/MoonshotAI/kimi-code/pull/2453) | 仅面向实验性 v2 的工作区信任流程，需要先确定 KKM 的 v2 默认策略 |
| [#2400](https://github.com/MoonshotAI/kimi-code/pull/2400) | 中断提醒和部分输出持久化依赖新的 v2 turn/wire 架构 |
| [#2457](https://github.com/MoonshotAI/kimi-code/pull/2457) | `turn.ended` 持久化依赖新的 v2 transcript/wire 架构 |
| [#2437](https://github.com/MoonshotAI/kimi-code/pull/2437) | 混合 106 个文件的 Workspace/Server 重构，不适合整包移植 |
| [#2366](https://github.com/MoonshotAI/kimi-code/pull/2366), [#2451](https://github.com/MoonshotAI/kimi-code/pull/2451), [#2460](https://github.com/MoonshotAI/kimi-code/pull/2460) | 大规模内部架构重构，缺少与风险不匹配的直接用户收益 |
| Kimi 登录、账号、额度、反馈、托管配置、遥测身份相关 PR | 厂商业务逻辑，不符合 KKM 的便携目标 |

## Batch 2026-07-30 — KKM 0.30.0-kkm.1

- KKM PR：[Pidbid/kkm#3](https://github.com/Pidbid/kkm/pull/3)
- Release：[v0.30.0-kkm.1](https://github.com/Pidbid/kkm/releases/tag/v0.30.0-kkm.1)
- Main commit：`41dd24a4ec55350f3fb02da95b05af9feb96d695`
- 内容：自定义 Agent、次级模型、多 Skill、插件 Agent/系统提示、ACP、MCP 恢复、Hooks/权限规则、Anthropic 兼容、Todo/Task/Shell、VS Code、Windows、Web UI 和 Agent catalog 等通用修复。
- 明确排除：Kimi 登录、账号、额度、反馈、托管配置、标题服务、遥测身份与已撤销补丁。

## 验证记录

每个批次合并前至少记录：

- lint
- typecheck
- build
- tests
- GitHub Actions 状态
- 如发布原生包，记录每个平台构建状态及 Release 链接

### Batch 2026-07-31

- KKM PR：[Pidbid/kkm#4](https://github.com/Pidbid/kkm/pull/4)
- 验证提交：`ec48b0594898dfb6fa5e4aba61066e70486f2b42`
- [CI run 30633232982](https://github.com/Pidbid/kkm/actions/runs/30633232982)：`lint`、`typecheck`、`build`、5 个测试分片和 `pi-tui` 全部通过；Windows job 按工作流条件跳过。
- [Nix Build run 30633233016](https://github.com/Pidbid/kkm/actions/runs/30633233016)：flake workspace 同步检查和 `nix build .#kimi-code` 全部通过。
- 合并后以 PR #4 和本文件共同作为该批次的可追溯记录。
