# KKM

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Release](https://img.shields.io/github/v/release/Pidbid/kkm)](https://github.com/Pidbid/kkm/releases/latest)

[Release](https://github.com/Pidbid/kkm/releases) · [Issues](https://github.com/Pidbid/kkm/issues) · [上游文档](https://moonshotai.github.io/kimi-code/zh/) · [English](README.md)


![KKM 的使用演示](./docs/media/intro.gif)


## 什么是 KKM

KKM 是 Kimi Code CLI 的便携增强分支，筛选并合入通用上游修复，支持同轮多 Skill 对话，并以 `kkm` 命令发布原生可执行文件。它既可使用 Kimi 模型，也可配置其他兼容厂商。

## 安装

从 [GitHub Release](https://github.com/Pidbid/kkm/releases/latest) 下载对应平台的压缩包。每个压缩包只包含一个 `kkm` 可执行文件，并附带 SHA-256 校验文件。

- **Linux x64**：

```sh
unzip kkm-linux-x64.zip
chmod +x kkm
sudo install kkm /usr/local/bin/kkm
```

- **Windows x64（PowerShell）**：

```powershell
Expand-Archive .\kkm-win32-x64.zip -DestinationPath .\kkm
.\kkm\kkm.exe --version
```

> Windows 用户首次启动前还需要安装 [Git for Windows](https://gitforwindows.org/)，KKM 会使用其中的 Git Bash 作为 Shell 环境。如果 Git Bash 安装在非标准路径，请把 `KIMI_SHELL_PATH` 设为 `bash.exe` 的绝对路径。

随后在新的终端会话中运行：

```sh
kkm --version
```

npm 包仍保留 `kimi` 兼容命令；KKM Release 使用 `kkm`。

## 快速开始

进入项目目录并启动交互界面：

```sh
cd your-project
kkm
```

首次启动时，在 KKM 里输入 `/login`，选择 Kimi Code OAuth 或 Moonshot AI Open Platform API 密钥登录。登录完成后，可以先让它熟悉项目：

```
帮我看一下这个项目的目录结构，简单介绍一下每个目录是做什么的
```

## 核心特性

- **二进制发行，零环境依赖** 一行命令安装，不需要预装 Node.js，不用折腾 PATH，也不会和全局模块冲突。
- **极速启动** TUI 在毫秒级就绪，开一个新会话没有任何心智负担。
- **精致的 TUI 体验** 端到端打磨的交互界面，专为长时间、专注的 Agent 会话优化。
- **视频也能输入** 把屏幕录像、演示视频拖进对话，让 Agent 看那些难以用文字描述的东西——把参考片段做成 LUT、把长视频剪成短视频、把录屏变成代码，等等。
- **AI-native 的 MCP 配置** 通过 `/mcp-config` 对话式添加、编辑、认证 MCP 服务器，无需手写 JSON。
- **丰富的插件生态** 从插件市场或任意 GitHub 仓库安装 skills、MCP 服务器和数据源，每次安装都会标明来源的信任级别。
- **子 Agent 聚焦并行工作** 内置 `coder`、`explore`、`plan` 子 Agent 在隔离上下文中处理子任务，主对话保持清爽。
- **生命周期 hooks** 在关键节点执行本地命令：拦截高风险工具调用、审计决策、发送桌面通知，或对接你自己的自动化脚本。
- **编辑器 / IDE 集成（ACP）** 用 `kkm acp` 让 Zed、JetBrains 等任意 [Agent Client Protocol](https://agentclientprotocol.com/) 客户端直接驱动会话。


## 在编辑器里使用（ACP）

KKM 支持 [Agent Client Protocol](https://agentclientprotocol.com/)，ACP 兼容的编辑器 / IDE（Zed、JetBrains……）可以通过 stdio 直接驱动会话。登录一次后，把编辑器指向 `kkm acp` 子命令即可，无需重复登录。

以 Zed 为例，在 `~/.config/zed/settings.json` 中加入：

```json
{
  "agent_servers": {
    "KKM": {
      "type": "custom",
      "command": "kkm",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

随后在 Zed 的 Agent 面板新建对话即可。JetBrains 配置与排障可参考上游的[在 IDE 中使用](https://moonshotai.github.io/kimi-code/zh/guides/ides)文档。

## 文档

- [上游移植记录](UPSTREAM_PORTS.md)

- [快速上手](https://moonshotai.github.io/kimi-code/zh/guides/getting-started)
- [交互与审批](https://moonshotai.github.io/kimi-code/zh/guides/interaction)
- [会话](https://moonshotai.github.io/kimi-code/zh/guides/sessions)
- [在 IDE 中使用（ACP）](https://moonshotai.github.io/kimi-code/zh/guides/ides)
- [配置](https://moonshotai.github.io/kimi-code/zh/configuration/config-files)
- [命令参考](https://moonshotai.github.io/kimi-code/zh/reference/kimi-command)

## 本地开发

环境要求：Node.js ≥ 24.15.0，pnpm 10.33.0。

```sh
git clone https://github.com/Pidbid/kkm.git
cd kkm
pnpm install
```

```sh
pnpm dev:cli    # 以开发模式运行 CLI
pnpm test       # 运行测试
pnpm typecheck  # TypeScript 检查
pnpm lint       # 运行 oxlint
pnpm build      # 构建所有包
```

完整贡献流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 社区

- [Issues](https://github.com/Pidbid/kkm/issues)
- 安全漏洞反馈，请见 [SECURITY.md](SECURITY.md)。

## 致谢

KKM 基于 [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)，其 TUI 构建在 [`pi-tui`](https://github.com/earendil-works/pi-mono/tree/main/packages/tui) 之上。

## 许可证

基于 [MIT](LICENSE) 协议发布。
