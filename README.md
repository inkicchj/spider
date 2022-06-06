# spider-weibo

### 简介

使用node + puppeteer制作的weibo数据爬取小工具，可搜索关键字和选择日期范围，爬取完成后会将每一天的数据分别存入xlsx文件。

### 安装

```
$ git clone https://github.com/inkicchj/spider.git
$ cd ./spider
$ npm install
```

### 使用

1. 在浏览器安装EditThisCookie扩展插件
2. 登录weibo官网，在插件中复制cookie到项目根目录中的loginstate.json文件
3. 终端中 cd 到项目根目录
4. 执行
```
$ node index.js
```
5. 根据提示输入信息后回车即可
6. 文件输出：项目根目录/files/搜索关键字/xxx.xlsx
