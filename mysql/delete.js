const { mysqlHandler } = require("../database/mysql");
const mysqlDeleteMain = async () => {
  return new Promise(async (resolve, reject) => {
    await mysqlHandler("delete from users");
    resolve("MySQL 重置完成");
  });
};

module.exports = { mysqlDeleteMain };
