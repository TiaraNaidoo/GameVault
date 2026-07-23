/*
Returns information for the root endpoint.

The controller receives the request and response objects from
the route file.
*/
const getRoot = (req, res) => {

    const appName = process.env.APP_NAME || "GameVault API";

    return res.status(200).json({
        application: appName,
        message: "Welcome to the GameVault API"
    });

};

/*
Returns information about the GameVault application.
*/
const getAbout = (req, res) => {

    const appName = process.env.APP_NAME || "GameVault API";

    return res.status(200).json({
        application: appName,
        description:
            "GameVault is a secure video game collection and review platform.",
        currentStage:
            "Learning Unit 2 - Refactoring the Backend"
    });

};

/*
Returns the current health status of the application.

The timestamp is generated whenever the endpoint is requested.
*/
const getHealth = (req, res) => {

    const appName = process.env.APP_NAME || "GameVault API";

    return res.status(200).json({
        application: appName,
        status: "OK",
        protocol: "HTTPS",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });

};

/*
Exports the controller functions.

The system route file will import these functions and connect
them to the correct endpoints.
*/
module.exports = {
    getRoot,
    getAbout,
    getHealth
};