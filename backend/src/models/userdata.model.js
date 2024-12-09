const Sequelize = require("sequelize");
const sequelize = require("../config/conn");
const User = require("./user.model");  // Import the User model to set the relation

const UserData = sequelize.define("user_data", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",  // If the user is deleted, their related data will be deleted
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isMobilePhone: {
        msg: "Phone number must be a valid phone number",
      },
    },
  },
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: "Must be a valid date",
      },
      isBefore: {
        args: new Date().toISOString().slice(0, 10),
        msg: "Date of birth cannot be in the future",
      },
    },
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [10, 255],
        msg: "Address must be between 10 and 255 characters long",
      },
    },
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [["male", "female", "other"]],
        msg: "Gender must be 'male', 'female', or 'other'",
      },
    },
  },
  aadhar: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isNumeric: {
        msg: "Aadhaar must be a 12-digit number",
      },
      len: {
        args: [12, 12],
        msg: "Aadhaar number must be exactly 12 digits long",
      },
    },
  },
  pan: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,  // PAN Card format: 5 letters, 4 digits, 1 letter
        msg: "Pan Card must be in the format XXXXX1234X",
      },
    },
  },
});

// Defining a one-to-one relationship between User and UserData
User.hasOne(UserData, {
  foreignKey: "user_id",  // userId will be the foreign key in UserData table
});
UserData.belongsTo(User, {
  foreignKey: "user_id",  // foreign key on UserData
});

module.exports = UserData;
