const Hapi = require("@hapi/hapi");
const router = require("./src/routers/user.router");
const adminrouter = require("./src/routers/useradmin.router");
const path = require('path');

require('dotenv').config();

const server = Hapi.server({
  port: 5000,
  host: "localhost",
  routes: {
    cors: {
      origin: ['http://localhost:5173'], 
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
      headers: ['Content-Type', 'Authorization'],  // Allow these headers
      exposedHeaders: ['X-Custom-Header'],  // Optionally expose custom headers
    },
  },
});

const init = async () => {
  await server.register(require('@hapi/inert'));  // Register Inert plugin for static files

  router.forEach((path) => server.route(path));
  adminrouter.forEach((path) => server.route(path));

  // Start the server
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

module.exports = server;

init().catch((err) => {
  console.error(err);
  process.exit(1);
});