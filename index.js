// import modules
const readline = require("readline");
const { mysqlWriteMain } = require("./mysql/write");
const { mysqlDeleteMain } = require("./mysql/delete");
const { mysqlReadMain } = require("./mysql/read");
const { mongodbWriteMain } = require("./mongodb/write");
const { mongodbDeleteMain } = require("./mongodb/delete");
const { mongodbReadMain } = require("./mongodb/read");

// 导入环境变量
require("dotenv").config();

// 连接 MongoDB
require("./database/mongodb");

// 连接 MySQL
require("./database/mysql");

// 获取命令行输入参数
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = {
  1: "MySQL 写操作",
  2: "MySQL 读操作",
  3: "MySQL 重置",
  4: "MongoDB 写操作",
  5: "MongoDB 读操作",
  6: "MongoDB 重置",
  exit: "退出程序",
  display() {
    console.log(this);
  },
};

options.display();

function ask() {
  rl.question("请输入您要执行的操作：", async (answer) => {
    if (answer !== "exit") console.log(`执行操作：${options[answer]}`);
    switch (answer) {
      case "1":
        console.log(await mysqlWriteMain());
        break;
      case "2":
        console.log(await mysqlReadMain());
        break;
      case "3":
        console.log(await mysqlDeleteMain());
        break;
      case "4":
        console.log(await mongodbWriteMain());
        break;
      case "5":
        console.log(await mongodbReadMain());
        break;
      case "6":
        console.log(await mongodbDeleteMain());
        break;
      case "exit":
        rl.close();
        process.exit();
        break;
      default:
        console.log("操作不合法！");
        break;
    }
    if (answer !== "exit") {
      ask();
    }
  });
}

ask();
