# webpack-vue
这是一个考虑基于前后端分离开发，基于webpack + vue + sass的前端开发架构

## 快速使用

- 安装依赖
```test
npm i
```
- 快速开发
<table>
  <thead>
    <td>开发环境</td>
    <td>命令</td>
    <td>介绍</td>
  </thead>
  <tbody>
    <tr>
      <td>开发</td>
      <td>npm run dev</td>
      <td>运行后打开localhost:8081（可在config中更改）</td>
    </tr>
    <tr>
      <td>调试</td>
      <td>npm run watch</td>
      <td></td>
    </tr>
    <tr>
      <td>发布</td>
      <td>npm run build</td>
      <td></td>
    </tr>
  </tbody>
</table>

## 目录结构
```text
- build
  -- dev-client.js // 热更新并刷新浏览器
  -- dev-server.js  // 启动dev,设置代理端口
  -- webpack.base.config.js // 基础webpack配置
  -- webpack.dev.js // dev特性配置
  -- webpack.entry.js // webpack多入口文件遍历
  -- webpack.prod.js  // build特性配置
  -- webpack.watch.js // watch特性配置
- config
  -- deafult.js // config
- pages
  -- assets // 静态资源文件
  -- common // 公有Js文件
  -- components // 公共组件文件
  -- modules // 页面入口文件
- .babelrc // babelrc配置
- .eslintignore
- .eslintrc.js // eslint配置
- .stylelintrc // stylelint配置
- .vcmrc // validate-commit-msg配置
- app.js
```
**初始项目下，pages下module是必须的**

## 特性
- 集成eslint,规范js,在commit时检测，不通过不能提交commit,在-.eslintrc配置。
- 集成stylelint,规范css,在dev和watch检测(会打印报错，不影响代码的提交和编写),在-.stylelintrc中配置
- 集成validate-commit-msg,规范commit msg信息，commit时检测，在-.vcmrc中配置