/*
Handles requests that do not match any valid route.

This middleware must be registered after all valid routes.
*/
const notFound = (req, res) => {

    return res.status(404).json({
        error: "Route not found."
    });

};

/*
Exports the middleware.
*/
module.exports = notFound;