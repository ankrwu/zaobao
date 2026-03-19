---
home: false
footer: MIT Licensed | Copyright © 2019-present
---

### 项目背景
不知道大家有没有跟我一样的情况，总是需要了解一些最新的国家政策法规；其目的可能是为了工作需要，也有可能是关注国家发展动态；总之需要从各类官方网站了解一些政策信息。

以我举例，我经常在以下网站获取信息：

**政策数据库**
- [人民数据国家政策数据库](https://data.people.com.cn/pd/gjzcxx/index.html) - 中共中央、国务院及各部委政策文件
- [人民数据政策库](https://data.people.com.cn/pd/zck) - 国家政策、各地政策、产业政策

**国务院及综合部门**
- [中国政府网](https://www.gov.cn/) - 国务院政策文件、最新政策
- [国家发改委](https://www.ndrc.gov.cn/) - 发展规划、投资审批、价格政策
- [国务院新闻办公室](http://www.scio.gov.cn/) - 新闻发布会、政策解读

**经济金融部门**
- [财政部](https://www.mof.gov.cn/) - 财政政策、税收优惠
- [中国人民银行](http://www.pbc.gov.cn/) - 货币政策、金融监管
- [商务部](https://www.mofcom.gov.cn/) - 外贸政策、贸易救济

**社会民生部门**
- [教育部](https://www.moe.gov.cn/) - 教育政策、招生规定
- [人社部](https://www.mohrss.gov.cn/) - 就业社保、人才政策
- [民政部](https://www.mca.gov.cn/) - 社会救助、社会组织
- [国家医保局](https://www.nhsa.gov.cn/) - 医保政策、药品目录
- [文化和旅游部](https://www.mct.gov.cn/) - 文旅政策、旅游监管

**产业建设部门**
- [工信部](https://www.miit.gov.cn/) - 产业政策、行业标准
- [住建部](https://www.mohurd.gov.cn/) - 房地产、工程建设
- [应急管理部](https://www.mem.gov.cn/) - 安全生产、应急救援

**司法执法机关**
- [最高人民法院](https://www.court.gov.cn/) - 司法解释、典型案例
- [最高人民检察院](https://www.spp.gov.cn/) - 检察工作、法律监督

通过整理后，把每天值得分享的内容发布出来，让大家同时受益。

学习和整理政策信息是非常耗时的，所以我希望有一个像日报一样的平台，来快速了解有价值的政策动态。

这个项目会以国家政策体系为主要分享课题。
内容会以：政策、法规、通知、财税等几大板块作为主要分类。
如果我的分享对你有所帮助，还请大家给个 ⭐️ 让更多的人知道[它](https://github.com/wubaiqing/zaobao)。

> 访问地址 : <https://wubaiqing.github.io/zaobao/other/latest.html>

> GitHub : <https://github.com/wubaiqing/zaobao>

> RSS : <https://wubaiqing.github.io/zaobao/rss.xml>

### 资源分享，参与奉献
项目安装方式极其简单，如果有更好的资源非常欢迎给大家分享出来，你可以选择提交 Issue 或提交 PR。
如何提交 PR，参考 [GitHub Help](https://help.github.com/articles/working-with-forks/) 即可。

### 安装

下载源码, 请执行下列命令：
```bash
# 克隆代码
$ git clone https://github.com/wubaiqing/zaobao.git
$ cd zaobao
```

代码下载完成后, 需要安装依赖：
```bash
# 安装依赖
$ pnpm install

# 检查是否符合文档规范
$ pnpm lint:md

# 开始阅读
$ pnpm doc:dev
```

在浏览器中打开 <http://localhost:8080/zaobao/>

### 更新

在 `zaobao` 文件夹中运行下面的命令就会从 GitHub 仓库拉取最新版本。

```bash
# 拉取代码
$ git pull
```
