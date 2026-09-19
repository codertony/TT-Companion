请分析当前 Web 项目，并将其改造成一个 Claude Code 可以自主完成：

```text
理解项目
→ 修改代码
→ 编译
→ 测试
→ 启动
→ 浏览器真实验证
→ 发现问题
→ 修复
→ 再次验证

```

的闭环开发环境。

## 第一阶段：分析

首先不要修改代码。

检查：

- Node.js 版本
- package manager
- lockfile
- framework
- build tool
- package.json scripts
- TypeScript
- lint
- test
- e2e
- 当前 dev server
- 当前 build 状态
- [CLAUDE.md](http://CLAUDE.md)
- `.claude`
- `.mcp.json`
- GitHub Actions

输出当前状态。

---

## 第二阶段：统一命令入口

保证项目至少存在：

```bash
<package-manager> dev
<package-manager> build
<package-manager> lint
<package-manager> typecheck
<package-manager> test
<package-manager> verify

```

其中：

```text
verify =
lint
+ typecheck
+ test
+ build

```

根据当前项目实际情况设计。

不得更换现有 package manager。

---

## 第三阶段：[CLAUDE.md](http://CLAUDE.md)

创建或者完善根目录：

```text
CLAUDE.md

```

要求明确说明：

- 项目架构
- 技术栈
- 目录结构
- 开发命令
- 编译命令
- 测试命令
- 验证命令
- 编码约束
- 修改原则
- Definition of Done

必须明确：

> 任何代码修改完成后必须执行 verify。

以及：

> 任何用户可见 Web UI 修改，都必须进行真实浏览器验证。

不得仅根据代码推断 UI 工作正常。

---

## 第四阶段：Playwright MCP

检查 Claude Code 是否已经配置 Playwright MCP。

如果没有，不要擅自修改用户全局配置。

告诉用户执行：

```bash
claude mcp add playwright npx @playwright/mcp@latest

```

如果项目已经提供可用 MCP，则使用已有配置。

---

## 第五阶段：Claude Skills

创建：

```text
.claude/skills/project-verify/SKILL.md
.claude/skills/run-webapp/SKILL.md
.claude/skills/verify-webapp/SKILL.md

```

### project-verify

负责：

```text
lint
typecheck
test
build

```

遇到失败时定位根因并修复。

### run-webapp

负责：

```text
启动项目
等待 dev server ready
找到实际 URL
确认 HTTP 可以访问

```

不得无依据硬编码端口。

### verify-webapp

负责：

```text
启动 Web Application
↓
使用 Playwright MCP 打开应用
↓
验证当前修改涉及的用户流程
↓
检查 page error
↓
检查 console error
↓
检查明显的 network error

```

验证失败必须继续修复。

---

## 第六阶段：Stop Hook

评估当前 Claude Code 版本支持的 Hook 配置方式。

增加一个尽可能简单、确定性的 Stop Hook。

目标：

当 Claude 准备声明开发任务完成时：

检查：

```text
verify 是否执行成功

```

如果代码存在修改但验证失败，则不允许把任务当作成功完成。

优先使用 command hook。

不要设计复杂的 LLM Hook。

---

## 第七阶段：GitHub Actions

创建或者调整：

```text
.github/workflows/ci.yml

```

使用与本地完全一致的 package manager 和 verify 命令。

目标：

```text
checkout
→ setup Node
→ install frozen dependencies
→ verify

```

本地验证和 CI 不允许存在两套独立标准。

---

## 第八阶段：实际闭环测试

完成配置后，实际运行：

```text
install
lint
typecheck
test
build
dev

```

然后：

使用 Playwright MCP 真实访问应用。

至少完成：

```text
页面可以打开
核心内容可以渲染
一个主要交互流程可以执行
无阻断性 browser error

```

如果失败，继续修复。

---

# 最终输出

最后给我：

## Environment

- Node
- package manager
- framework
- build tool
- test framework

## Commands

- dev
- build
- test
- verify

## Claude Configuration

- [CLAUDE.md](http://CLAUDE.md)
- Skills
- Hooks
- MCP

## Validation

- install
- lint
- typecheck
- tests
- build
- dev server
- browser verification

分别标明：

```text
PASS
FAIL
N/A

```

## Manual Actions

只列出 Claude 无法自己完成、确实需要用户手工执行的步骤。

不要把 Claude 可以自行执行的 shell command 留给用户。