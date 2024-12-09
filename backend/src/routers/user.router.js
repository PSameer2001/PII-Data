const {
  register,
  login,
  checkAuth,
  logout,
  updateData,
  verifyJwtMiddleware,
  getData,
} = require("../controller/user.controller");
const {
  registeroption,
  loginoption,
  updateoption,
} = require("../routerOption/userrouter.option");

const router = [
  {
    method: "POST",
    path: "/api/register",
    options: registeroption,
    handler: register,
  },
  {
    method: "POST",
    path: "/api/login",
    options: loginoption,
    handler: login,
  },
  {
    method: "GET",
    path: "/api/checkAuth",
    handler: checkAuth,
  },
  {
    method: "POST",
    path: "/api/logout",
    handler: logout,
  },
  {
    method: "PATCH",
    path: "/api/updatedata",
    options: updateoption,
    handler: updateData,
  },
  {
    method: "GET",
    path: "/api/getdata",
    options: {
      ext: {
        onPreHandler: {
          method: verifyJwtMiddleware, // Correctly define the middleware method
        }, // Apply JWT authorization middleware
      },
    },
    handler: getData,
  },
];

module.exports = router;
