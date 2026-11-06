# 安装或更新小黑盒搜索技能

这份说明供收到安装请求的 Agent 执行，也可以手动照做。技能源是 [xleft/xiaoheihe-search](https://github.com/xleft/xiaoheihe-search)。装好后，使用用户授权的、已登录小黑盒的 Chrome 做一次只读查询。

## 1. 按当前宿主安装

先确认自己运行在 Codex、WorkBuddy 还是 Hermes Agent，并检查是否已加载同名技能。升级时沿用现有的有效安装位置。若它是来源正确、工作区干净的 Git 副本，在原目录执行 `git pull --ff-only`；有本地修改或来源不明时保留原文件并说明情况。不要并存两个同名副本。

### Codex 桌面版

新装到用户技能目录 `~/.agents/skills/xiaoheihe-search`。如果已有有效的旧安装目录（例如 `~/.codex/skills/xiaoheihe-search`），优先更新现有副本。

Windows PowerShell：

```powershell
$skillParent = Join-Path $env:USERPROFILE '.agents/skills'
New-Item -ItemType Directory -Force -Path $skillParent | Out-Null
git clone https://github.com/xleft/xiaoheihe-search.git (Join-Path $skillParent 'xiaoheihe-search')
```

macOS/Linux：

```sh
mkdir -p "$HOME/.agents/skills"
git clone https://github.com/xleft/xiaoheihe-search.git "$HOME/.agents/skills/xiaoheihe-search"
```

确认技能已加载；若当前会话没有刷新，开启新会话，必要时重启 Codex。使用 Codex 的浏览器操作工具连接用户授权的 Chrome。[Codex 技能文档](https://developers.openai.com/codex/skills)

### WorkBuddy 桌面版

下载或提供 [WorkBuddy 技能 ZIP](https://github.com/xleft/xiaoheihe-search/releases/latest/download/xiaoheihe-search.zip)，在「专家·技能·连接器 → 技能 → 添加技能 → 上传技能」导入；升级时更新已有的同名技能。若无法操作导入界面，请告诉用户需要点击的入口，并提供 ZIP 链接。

在「设置 → 智能体 → 浏览器操控」使用 Chrome 扩展连接用户授权的 Chrome。这个 ZIP 使用 WorkBuddy 的浏览器工具；它不包含 Codex 专用脚本。[WorkBuddy 技能文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market)

### Hermes Agent（可搭配 DeepSeek）

新装到当前 Hermes 配置的技能目录。默认路径为 `~/.hermes/skills/xiaoheihe-search`；如果启用了独立配置，先核实该配置的实际目录。以下是 macOS/Linux 默认路径的示例：

```sh
mkdir -p "$HOME/.hermes/skills"
git clone https://github.com/xleft/xiaoheihe-search.git "$HOME/.hermes/skills/xiaoheihe-search"
```

确认能找到 `/xiaoheihe-search`，再按[浏览器操作指引](../references/browser-workflow.md)配置 Hermes 的浏览器工具。即使已选用 DeepSeek 模型，也要单独完成浏览器连接。[Hermes 技能文档](https://hermes-agent.nousresearch.com/docs/guides/work-with-skills)

Codex 或 Hermes 没有 Git 时，可下载[仓库源码 ZIP](https://github.com/xleft/xiaoheihe-search/archive/refs/heads/main.zip)，把解压出的目录改名为 `xiaoheihe-search`，放到相应的技能目录，保留 `SKILL.md`、`scripts/` 和 `references/`。升级手动安装的副本前，先确认是否有本地修改。

## 2. 检查是否能用

1. **技能已加载**：确认宿主识别 `xiaoheihe-search`，区分「文件已放好」和「技能已加载」。
2. **Chrome 已连接**：在用户授权的 Chrome 中打开 [小黑盒](https://www.xiaoheihe.cn/)，核实页面显示已登录。需要登录、验证码或浏览器授权时，请用户在浏览器完成。不要读取 Cookie、索取密码或换到另一个未授权的浏览器。
3. **查询已通过**：按 [SKILL.md](../SKILL.md) 查《尼尔：机械纪元》的小黑盒评分，返回网页实际显示的数值和游戏页链接。浏览器未连接或页面受限时，说明卡在哪一步；不要用搜索引擎摘要替代验收。

向用户分别报告以上三项的结果。技能可以先装好，但只有浏览器和实际查询也通过，才能确认当前环境可用。
