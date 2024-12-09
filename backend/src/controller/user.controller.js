const User = require("../models/user.model");
const UserData = require("../models/userdata.model");
require("../config/sync");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");

const register = async (req, h) => {
  try {
    const { fullName: name, email, password } = req.payload;

    // Check if the user already exists
    const userExists = await User.findOne({
      where: { email: email },
    });
    if (userExists) {
      return h
        .response({ message: "User with this email already exists" })
        .code(400);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    };
    await User.create(newUser);

    // Return the token
    return h.response({ message: "Signup successful" }).code(201);
  } catch (error) {
    return h.response({ message: error.message }).code(400);
  }
};

const login = async (req, h) => {
  try {
    const { email, password } = req.payload;

    // Check if the user already exists
    const userExists = await User.findOne({
      where: { email: email },
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

    h.state("token", token, {
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
  h.unstate("token"); // This removes the 'token' cookie from the client

  return h.response({
    status: "success",
    message: "Logged out successfully",
  });
};

const checkAuth = async (request, h) => {
  const token = request.state.token; // Get the token from the cookie

  if (!token) {
    return h.response({ message: "unauthorized User" });
  }

  try {
    // Verify the token and decode user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userExists = await User.findOne({
      where: { email: decoded.email },
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

const verifyJwtMiddleware = async (request, h) => {
  try {
    const token = request.state?.token; // Get the token from the cookie

    if (!token) {
      return h
        .response({ message: "Invalid or expired token" })
        .code(401)
        .takeover();
    }

    // Verify the token and decode user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach the decoded user data to request.auth.credentials
    request.user = decoded;
  } catch (err) {
    // If token is invalid or expired, throw unauthorized error
    return h
      .response({ message: "Invalid or expired token" })
      .code(401)
      .takeover();
  }

  // Continue the request handling
  return h.continue;
};

const updateData = async (req, h) => {
  try {
    const { name, address, phone, aadhar, pan, gender, dob } = req.payload;

    // Check if the user already exists
    const userExists = await User.findOne({
      where: { email: req.user.email },
    });

    if (!userExists) {
      return h.response({ message: "Invalid User" }).code(400);
    }

    userExists.name = name;
    await userExists.save();

    // Check if the user already exists
    const userdataExists = await UserData.findOne({
      where: { user_id: userExists.id },
    });

    if (!userdataExists) {
      const newUserData = {
        user_id: userExists.id,
        phone,
        dob,
        address,
        gender,
        aadhar,
        pan,
      };
      await UserData.create(newUserData);
    } else {
      await UserData.update(
        { phone, dob, address, gender, aadhar, pan },
        {
          where: { user_id: userExists.id }, // Filter by user ID
        }
      );
    }

    const updatedUser = await UserData.findOne({
      where: { user_id: userExists.id },
    });

    updatedUser.name = userExists.name

    return h
    .response({
      message: "User updated successfully",
      user: updatedUser,
    })
    .code(200);
  } catch (err) {
    return h
    .response({
      message: err.message,
    })
    .code(400);
  }
};

const getData = async (req, h) => {
  try {
    // Find the user along with the associated profile using 'include'
    const user = await User.findOne({
      where: { email: req.user.email },
      attributes: { exclude: ['password'] },  // Find the user by ID
      include: {
        model: UserData,  // Include the Profile model
          // Only fetch the phone and address fields from the profile
      },
    });

    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    return h.response({
      message: 'User fetched successfully',
      user,
    }).code(200);
  } catch (error) {
    return h.response({ message: 'Error fetching user', error: error.message }).code(500);
  }
}

module.exports = {
  register,
  login,
  checkAuth,
  verifyJwtMiddleware,
  logout,
  updateData,
  getData
};
