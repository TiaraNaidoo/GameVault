/*
Server.js now has one main responsibility => Start the HTTPS server

Loads environment variables before the other application files
are imported.

This ensures that the HTTPS configuration and controllers can
access process.env values.
*/
require("dotenv").config();

/*
Imports the built-in Node.js HTTPS module.
*/
const https = require("https");

/*
Imports the configured Express application from app.js.
*/
const app = require("./app");

/*
Imports the private-key and certificate configuration.
*/
const httpsOptions = require("./config/httpsConfig");

/*
Reads the server configuration from the environment variables.

Fallback values are provided when the environment variables are
not available.
*/
const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
const APP_NAME =
    process.env.APP_NAME || "GameVault API";

/*
Creates and starts the HTTPS server.

httpsOptions contains the private key and certificate.

app contains the configured Express application.
*/
const server = https.createServer(httpsOptions, app);

/*
Starts listening for incoming HTTPS requests.
*/
server.listen(HTTPS_PORT, () => {

    console.log(
        `${APP_NAME} is running securely on https://localhost:${HTTPS_PORT}`
    );

});

/*
Handles server startup errors.

For example, EADDRINUSE occurs when another application is
already using the selected port.
*/
server.on("error", error => {

    console.error("The GameVault server could not start.");
    console.error(error.message);

});