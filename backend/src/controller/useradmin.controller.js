const User = require("../models/user.model");
const UserData = require("../models/userdata.model");
const { Op } = require('@sequelize/core');
require("../config/sync");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");

const login = async (req, h) => {
  try {
    const { email, password } = req.payload;

    // Check if the user already exists
    const userExists = await User.findOne({
      where: { email: email, isAdmin: true },
    });

    if (!userExists) {
      return h.response({ message: "Invalid Credentials" }).code(400);
    }

    const isCorrectpassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!isCorrectpassword) {
      return h.response({ message: "Invalid Credentials" }).code(400);
    }

    // Create a JWT token after successful signup
    const token = await jwt.sign(
      { email: email, name: userExists.name }, // In real apps, you should use a unique ID, e.g., user.id
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    h.state("admintoken", token, {
      ttl: 60 * 60 * 1000, // 1 hour
      isHttpOnly: true,
      isSecure: false, // Should be true in production with HTTPS
      path: "/",
      sameSite: "Lax",
    });

    // Return the token
    return h
      .response({
        message: "Login successful",
        token,
        email,
        name: userExists.name,
      })
      .code(201);
  } catch (error) {
    return h.response({ message: error.message }).code(400);
  }
};

const logout = async (req, h) => {
  h.unstate("admintoken"); // This removes the 'token' cookie from the client

  return h.response({
    status: "success",
    message: "Logged out successfully",
  });
};

const checkAdminAuth = async (request, h) => {
  const token = request.state?.admintoken; // Get the token from the cookie

  if (!token) {
    return h.response({ message: "unauthorized User" });
  }

  try {
    // Verify the token and decode user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userExists = await User.findOne({
      where: { email: decoded.email, isAdmin: true },
    });
    
    if (!userExists) {
      return h.response({ message: "Invalid" }).code(400);
    }

    return h.response({ message: "Verified", decoded }).code(201);
  } catch (err) {
    // If token is invalid or expired, throw unauthorized error
    return h.response({ message: "Invalid Token" });
  }
};

const getAllData =  async (req, h) => {
  try {

    const token = req.state?.admintoken; // Get the token from the cookie

    if (!token) {
      return h.response({ message: "unauthorized User" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user along with the associated profile using 'include'
    const user = await User.findAll({
      where : {
        [Op.not]: {
          email: decoded.email // except logged email
        },
        isAdmin: false // except admin data
      },
      attributes: { exclude: ['password'] },
      include: {
        model: UserData,  
      },
    });

    return h.response({
      user,
    }).code(200);
  } catch (error) {
    return h.response({ message: 'Error fetching user', error: error.message }).code(500);
  }
}

module.exports = { login, checkAdminAuth, logout, getAllData };
