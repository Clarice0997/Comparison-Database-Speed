const Users = require("../database/usersModel");

const mongodbDeleteMain = async () => {
  return new Promise(async (resolve, reject) => {
    await Users.deleteMany({});
    resolve("MongoDB 重置完成");
  });
};

module.exports = { mongodbDeleteMain };
