# 概述
**仓库名称：eduword，因此[vite.config.ts](vite.config.ts)加上了base的判断条件**
1. 不使用自定义域名，使用github.io，要加上eduword后缀，因为要查询你的项目名称的目录，所以base加上eduword。
2. 使用自定义域名（cf）,base置空即可。


## Run 本地

**必需:**  Node.js

1. 依赖
   `npm install --registry=https://registry.npmmirror.com`
 
2. 本地运行
   `npm run dev`


## Run 远程（github pages）

1. 执行 `npm run build:custom` 是使用域名访问 或者`npm run build` 不需要使用域名，打包生成docs的文件夹。
2. 上传github远程。
3. 使用域名访问：https://eduword.bingxiangtie.top
