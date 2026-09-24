/*
Generic, reusable version of validateGameId.js - checks that a
named URL parameter is a validly-FORMATTED MongoDB ObjectId,
without querying the database and without knowing which
resource (game, collection entry, review) the ID belongs to.
 
validateGameId.js is hardcoded to always check req.params.id.
This version is a middleware FACTORY (the same pattern already
used by authoriseRoles.js) so it can check any param name -
useful here for routes like DELETE /collection/:gameId, where
the parameter is not called "id".
 
Usage:
    validateObjectIdParam("gameId")
*/
const mongoose = require("mongoose");
 
const validateObjectIdParam = (paramName) => {
 
    return (req, res, next) => {
 
        const value = req.params[paramName];
 
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return res.status(400).json({
                success: false,
                error: `${paramName} must be a valid MongoDB ObjectId.`
            });
        }
 
        next();
 
    };
 
};
 
module.exports = validateObjectIdParam;
 