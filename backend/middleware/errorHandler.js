/*
Handles unexpected errors passed through the Express
application.

An Express error-handling middleware function must have four
parameters:

err, req, res and next
*/
const errorHandler = (err, req, res, next) => {

    /*
    Uses the status code attached to the error where available.

    If no status code exists, the server returns 500.
    */
    const statusCode = err.statusCode || 500;

    /*
    Checks whether the application is running in development
    mode.
    */
    const isDevelopment =
        process.env.NODE_ENV === "development";

    /*
    Returns a controlled JSON response.

    The stack trace is included only during development.
    Production users should not receive internal technical
    information.
    */
    return res.status(statusCode).json({
        error:
            statusCode === 500
                ? "An unexpected server error occurred."
                : err.message,
        stack: isDevelopment ? err.stack : undefined
    });

};

/*
Exports the error-handling middleware.
*/
module.exports = errorHandler;