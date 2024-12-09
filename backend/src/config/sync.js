const sequelize = require("./conn");

sequelize
  .sync()
  .then((res) => {
    // console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
