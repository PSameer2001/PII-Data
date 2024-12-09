const sequelize = require("./conn");

// Syncing the database as model added in model folder. It will add the table and column into db as given in model
sequelize
  .sync()
  .then((res) => {
    // console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
