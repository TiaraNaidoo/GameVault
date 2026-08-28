/*
Handles unexpected errors passed through the Express
application.

An Express error-handling middleware function must have four
parameters:

err, req, res and next
*/
const errorHandler = (err, req, res, next) => {

    /*
    Checks whether the application is running in development
    mode.
    */
    const isDevelopment = process.env.NODE_ENV === "development";
 
     /*
    Mongoose validation error.
 
    Thrown when a document fails the rules defined in a schema
    (e.g. title too short, ageRating not in the allowed enum,
    releaseYear out of range). 
    */
   if (err.name === "ValidationError") {
 
        const validationErrors = Object.values(err.errors).map(
            fieldError => fieldError.message
        );
 
        return res.status(400).json({
            success: false,
            error: "Validation failed.",
            details: validationErrors
        });
    }

     /*
    Mongoose CastError.
 
    Thrown when a value cannot be cast to the type a schema
    field expects - most commonly when a malformed value is
    used to query by ID somewhere it was not caught earlier by
    validateGameId. Treated as a client mistake, not a server
    fault.
    */
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: "Invalid ID format."
        });
    }

     /*
    MongoDB duplicate-key error.
 
    error.code 11000 means a unique index (e.g. the unique email
    field on the User schema) was violated. This can happen even
    after an application-level "does this email already exist"
    check, because two requests can race each other - MongoDB's
    own unique constraint is the final, race-proof source of
    truth.
    */
    if (err.code === 11000) {
 
        const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
 
        return res.status(409).json({
            success: false,
            error: `An account or record with this ${duplicateField} already exists.`
        });
    }

    /*
    Uses the status code attached to the error where available.
 
    If no status code exists, the server returns 500.
    */
    const statusCode = err.statusCode || 500;

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