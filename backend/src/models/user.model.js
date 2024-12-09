const Sequelize = require("sequelize");
const sequelize = require("../config/conn");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name cannot be empty",
      },
      isAlpha: {
        msg: "Name must contain only letters",
      },
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Email is required",
      },
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is required",
      },
    },
  },
  isAdmin: { type: Sequelize.BOOLEAN, defaultValue: false },
});

module.exports = User;
