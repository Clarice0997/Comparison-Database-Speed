const pidusage = require("pidusage");
const nodeXlsx = require("node-xlsx");
const fs = require("fs");
const path = require("path");
const Users = require("../database/usersModel");

const writeExcel = (fileName, data, sheetName) => {
  const buffer = nodeXlsx.build([
    { name: sheetName, data: data.map((item) => [item]) },
  ]);
  fs.writeFileSync(path.join(__dirname, "..", "data", fileName), buffer, {
    flag: "w",
  });
};

const mongodbReadMain = async () => {
  return new Promise(async (resolve, reject) => {
    // 每秒 MongoDB CPU占用
    const cpus = [];
    // 每秒 MongoDB 内存占用
    const memories = [];
    // 每次读取耗时
    const selectTimes = [];
    // 设置计时器 动态获取进程 CPU占用 内存占用
    let interval;
    // 延迟触发
    setTimeout(() => {
      interval = setInterval(() => {
        pidusage(5200, function (err, stats) {
          cpus.push(stats.cpu);
          memories.push(stats.memory);
        });
      }, 1000);
    }, 100);
    // 循环读取 MongoDB
    for (let i = 0; i < 5000; i++) {
      const start = Date.now();
      await Users.find();
      const end = Date.now();
      selectTimes.push(end - start);
    }
    // 清除定时器
    clearInterval(interval);
    // 保存 excel 表格
    writeExcel("MongoDB读操作CPU占用.xlsx", cpus, "sheet");
    writeExcel("MongoDB读操作内存占用.xlsx", memories, "sheet");
    writeExcel("MongoDB读操作耗时.xlsx", selectTimes, "sheet");
    let totalTime = selectTimes.reduce((total, value) => (total += value), 0);
    console.log(`总耗时: ${totalTime} ms`);
    resolve("MongoDB 读操作完成！");
  });
};

module.exports = { mongodbReadMain };
