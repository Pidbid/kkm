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
