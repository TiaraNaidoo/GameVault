const express = require("express");

/*
Imports the route files.
*/
const systemRoutes = require("./routes/systemRoutes");
const gameRoutes = require("./routes/gameRoutes");

/*
Imports the middleware that handles invalid routes and
unexpected errors.
*/
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

/*
Creates the Express application.
*/
const app = express();

/*
Enables the application to read JSON request bodies.

Without this middleware, req.body may be undefined when a
client sends JSON.
*/
app.use(express.json());

/*
Registers the system routes.

The system router defines:

GET /
GET /about
GET /health
*/
app.use("/", systemRoutes);

/*
Registers the game routes under the /games base path.

The routes inside gameRoutes.js are combined with this path.

For example:

router.get("/") becomes GET /games
router.get("/:id") becomes GET /games/:id
router.post("/") becomes POST /games
*/
app.use("/games", gameRoutes);

/*
Handles requests that do not match a valid route.

This must be registered after the valid routes.
*/
app.use(notFound);

/*
Handles unexpected application errors.

This must be registered after the routes and not-found
middleware.
*/
app.use(errorHandler);

/*
Exports the configured Express application.

server.js will import the application and use it to create the
HTTPS server.
*/
module.exports = app;