# KKM

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Release](https://img.shields.io/github/v/release/Pidbid/kkm)](https://github.com/Pidbid/kkm/releases/latest) <br>
[Releases](https://github.com/Pidbid/kkm/releases) · [Issues](https://github.com/Pidbid/kkm/issues) · [Upstream documentation](https://moonshotai.github.io/kimi-code/en/) · [中文](README.zh-CN.md)

![Demo of using KKM](./docs/media/intro.gif)

## What is KKM

KKM is a portable fork of Kimi Code CLI with curated upstream fixes, multi-skill prompts, and native releases under the `kkm` command. It can read and edit code, run shell commands, search files, fetch web pages, and use Kimi or other compatible model providers.

## Install

Download the archive for your platform from the [latest GitHub Release](https://github.com/Pidbid/kkm/releases/latest). Each archive contains a single `kkm` executable and is accompanied by a SHA-256 checksum.

- **Linux x64**:

```sh
unzip kkm-linux-x64.zip
chmod +x kkm
sudo install kkm /usr/local/bin/kkm
```

- **Windows x64 (PowerShell)**:

```powershell
Expand-Archive .\kkm-win32-x64.zip -DestinationPath .\kkm
.\kkm\kkm.exe --version
```

> On Windows, install [Git for Windows](https://gitforwindows.org/) before first launch because KKM uses its Git Bash environment. If Git Bash is installed in a custom location, set `KIMI_SHELL_PATH` to the absolute path of `bash.exe`.

Then run:

```sh
kkm --version
```

The npm package retains `kimi` as a compatibility alias, while KKM releases use `kkm`.

## Quick Start

Open a project and start the interactive UI:

```sh
cd your-project
kkm
```

On first launch, run `/login` inside KKM and choose either Kimi Code OAuth or a Moonshot AI Open Platform API key. After login, try your first task:

```
Take a look at this project and explain its main directories.
```

## Key Features

- **Single-binary distribution.** Install with one command: no Node.js setup, PATH gymnastics, or global module conflicts.
- **Blazing-fast startup.** The TUI is ready in milliseconds, so starting a session never feels heavy.
- **Purpose-built TUI.** A carefully tuned interface, optimized end to end for long, focused agent sessions.
- **Video input.** Drop a screen recording or demo clip into the chat and let the agent watch what is hard to describe in words — turn a reference clip into a LUT, a long video into a short, a screen recording into working code, and more.
- **AI-native MCP configuration.** Add, edit, and authenticate Model Context Protocol servers conversationally with `/mcp-config`, without hand-editing JSON.
- **Rich plugin ecosystem.** Install skills, MCP servers, and data sources from the marketplace or any GitHub repo, with each install's trust level surfaced up front.
- **Subagents for focused, parallel work.** Dispatch built-in `coder`, `explore`, and `plan` subagents in isolated contexts while keeping the main conversation clean.
- **Lifecycle hooks.** Run local commands at key points to gate risky tool calls, audit decisions, trigger desktop notifications, or connect to your own automation.
- **Editor & IDE integration (ACP).** Drive a KKM session straight from Zed, JetBrains, or any [Agent Client Protocol](https://agentclientprotocol.com/) client with `kkm acp`.

## Use it in your editor (ACP)

KKM speaks the [Agent Client Protocol](https://agentclientprotocol.com/), so ACP-compatible editors and IDEs (Zed, JetBrains, …) can drive a session over stdio. Log in once, then point your editor at the `kkm acp` subcommand — no extra login needed.

For Zed, add this to `~/.config/zed/settings.json`:

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

Then open a new conversation in Zed's Agent panel. See the upstream [Using in IDEs](https://moonshotai.github.io/kimi-code/en/guides/ides) guide for JetBrains setup and troubleshooting.

## Docs

- [Getting Started](https://moonshotai.github.io/kimi-code/en/guides/getting-started)
- [Interaction and approvals](https://moonshotai.github.io/kimi-code/en/guides/interaction)
- [Sessions](https://moonshotai.github.io/kimi-code/en/guides/sessions)
- [Using in IDEs (ACP)](https://moonshotai.github.io/kimi-code/en/guides/ides)
- [Configuration](https://moonshotai.github.io/kimi-code/en/configuration/config-files)
- [Command reference](https://moonshotai.github.io/kimi-code/en/reference/kimi-command)

## Develop

Requirements: Node.js ≥ 24.15.0, pnpm 10.33.0.

```sh
git clone https://github.com/Pidbid/kkm.git
cd kkm
pnpm install
```

```sh
pnpm dev:cli    # run the CLI in dev mode
pnpm test       # run tests
pnpm typecheck  # TypeScript check
pnpm lint       # oxlint
pnpm build      # build all packages
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guide.

## Community

- [Issues](https://github.com/Pidbid/kkm/issues)
- For security vulnerabilities, see [SECURITY.md](SECURITY.md).

## Acknowledgements

KKM is forked from [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code). Its TUI is built on [`pi-tui`](https://github.com/earendil-works/pi-mono/tree/main/packages/tui).

## License

Released under the [MIT License](LICENSE).
