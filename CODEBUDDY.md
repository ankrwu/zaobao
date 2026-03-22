# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## 项目概述

每日时报是一个基于 VuePress 的国家政策日报静态网站，以国家政策体系为主要分享课题，内容分为政策、法规、通知、财税等板块。

## 常用命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 本地开发预览（http://localhost:8080/zaobao/）
pnpm doc:dev

# 构建静态网站
pnpm doc:build

# 部署到 GitHub Pages
pnpm doc:deploy

# Markdown 文档规范检查
pnpm lint:md

# JavaScript 代码检查
pnpm lint:js

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 项目结构

```
├── docs/                    # VuePress 文档目录
│   ├── .vuepress/          # VuePress 配置
│   │   ├── config.js       # 主配置文件（包含侧边栏导航配置）
│   │   └── theme/          # 自定义主题（扩展自 @vuepress/theme-default）
│   ├── 20xx/               # 按年份组织的日报目录
│   │   └── 01-12/          # 按月份组织的日报目录
│   │       └── dd.md       # 每日日报文件（如 16.md）
│   ├── other/              # 其他页面
│   │   ├── latest.md       # 最新日报入口
│   │   └── talk.md         # 留言页面
│   └── README.md           # 首页
├── scripts/
│   └── build.js            # 读取日报文件列表的工具函数
├── test/                   # Jest 测试
├── commitlint.config.js    # Commit 规范配置（conventional commits）
└── .lintmdrc               # Markdown 规范配置
```

## 架构要点

### 侧边栏自动生成

`docs/.vuepress/config.js` 使用 `scripts/build.js` 中的 `readFileList(year, month)` 函数动态读取对应年月目录下的日报文件，自动生成侧边栏导航。

### 日报文件格式

日报文件存放在 `docs/{年份}/{月份}/{日期}.md`，例如 `docs/2026/03/16.md`。文件格式示例：

```markdown
### 2026.03.16 今天是每日时报陪伴您的第 N 天

[分类] 标题：链接
```

分类包括：政策、法规、通知、财税、科技等。

### 提交规范

项目使用 commitlint + conventional commits 规范。提交信息格式：`type: description`

### 部署流程

`deploy.sh` 脚本执行：构建 → 进入 dist 目录 → 初始化 git → 强制推送到 gh-pages 分支。

### 信息来源

光伏行业新闻信息主要来源（已验证可访问）：

**行业门户网站**
- 光伏们：https://www.guangfu.com.cn/
- 光伏资讯：https://www.solarbe.com/
- 索比光伏网：https://www.solarbe.com/
- 北极星太阳能光伏网：https://guangfu.bjx.com.cn/
- 光伏商讯网：https://www.solarpvsources.com/

**行业协会与机构**
- 中国光伏行业协会 (CPIA)：https://www.chinapv.org.cn/
- 中国可再生能源学会：https://www.cres.org.cn/
- 国家可再生能源中心：https://www.nrec.org.cn/

**企业资讯平台**
- 光伏们企业频道：https://www.guangfu.com.cn/qiye/
- 北极星光伏企业库：https://guangfu.bjx.com.cn/qiye/

**政策与数据来源**
- 国家能源局：https://www.nea.gov.cn/
- 中国政府网能源政策：https://www.gov.cn/zhengce/
- 国家发改委新能源政策：https://www.ndrc.gov.cn/xxgk/zcfb/ghwb/

## 包管理器

项目使用 pnpm 作为包管理器，配置文件为 `.pnpmrc` 和 `.npmrc`。
