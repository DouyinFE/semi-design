# 贡献指南

我们很高兴您有兴趣为 Semi UI 做出贡献。 在提交您的贡献之前，请务必花点时间阅读以下指南：

## 分支管理
Semi 团队会维护两个常驻分支：`main` 和 `release`，根据我们的[发布周期](https://semi.design/zh-CN/start/changelog)，我们会定期合并代码发布版本
 - main: 该分支仅作为**最新稳定版本**代码的快照。每次 minor 版本发布后，我们会将 `release` 的代码合并到此分支。
 - release: bug 修复和 feature 开发等改动，都会率先合并到此分支。在发布日会基于此分支发布新版本。
## Bug
我们使用 Github issues 来追踪 bug。为了更快地了解和解决 bug，在提交 issue 时，你也可以通过我们提供的模板来重现问题。
## 新特性
如果你有提供或者优化功能的想法，我们推荐你使用 Github issues 来新建一个添加新功能的 issue。

## Pull Request 指南
Semi Design 团队会认真对待每一个 Pull Request。我们会 review 并合并你的代码。也有可能对你的代码提出一些修改意见。

要提交一个 Pull Request，请遵循以下步骤：
 - Fork 项目并克隆下来
```bash
git clone https://github.com/<your-username>/semi-design.git
cd semi-design
```
 - 检出你的主题分支
```bash
git checkout -b <TOPIC_BRANCH_NAME>
```
>安装环境前确保本地有 `lerna` 和 `yarn` 的依赖，如果没有则运行：
```bash
npm install --global lerna yarn
```
 - 完成项目依赖安装
```bash
npm run bootstrap
```
 - 接下来进行你想要做的修改，可以是 bug 修复，也可以是新功能的开发
 - 你可以通过运行 storybook(`npm start`)和官网(`npm run docsite`)来验证逻辑
 - 为你的修改编写测试用例，并确保测试通过
```bash
npm run test:unit
```
 - 新建一个 Pull Request 到源项目的 `release` 分支

我们可能会根据情况要求或帮助你修改PR，对于不合适的PR我们会给予解释后关闭

## 帮助改善文档
文档站基于 [gatsby](https://www.gatsbyjs.com/) 构建，核心代码在 `src` 目录。

**组件文档位于 `semi-ui` 组件文件夹下的 md 文件。** 以 tooltip 为例：

* 中文文档 `packages/semi-ui/tooltip/index.md` 
* 英文文档 `packages/semi-ui/tooltip/index-en-US.md`

启动文档站点
```sh
npm run docsite
```
如果您有兴趣帮助我们提高文档的质量，请修改对应组件的 md 文件，按照 Pull Request 指南提交您的改动
