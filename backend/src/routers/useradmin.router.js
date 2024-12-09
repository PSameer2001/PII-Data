const {  login, checkAdminAuth, logout, getAllData } = require("../controller/useradmin.controller");
const { loginoption } = require("../routerOption/userrouter.option");

const adminrouter = [
  {
    method: "POST",
    path: "/admin/api/adminlogin",
    options: loginoption,
    handler: login,
  },
  {
    method: "GET",
    path: "/admin/api/checkAdminAuth",
    handler: checkAdminAuth,
  },
  {
    method: "POST",
    path: "/admin/api/adminlogout",
    handler: logout,
  },
  {
    method: "GET",
    path: "/admin/api/getalldata",
    handler: getAllData,
  }
];

module.exports = adminrouter;
