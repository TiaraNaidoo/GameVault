/* validate the game id in the url
eg: GET /games/:id
PUT /games/:id
DELETE /games/:id
PATCH /games/:id

the value after games can be found through req,params.id
*/

/*
Imports Mongoose so its built-in ObjectId format checker can be
used here.
*/
const mongoose = require("mongoose");

const validateGameId = (req, res, next)=> {
    // route parameters are received as text/string
    // Number changes the supplied ID into a int --> const gameId = Number(req.params.id);  OLD ONE!!
    const gameId = req.params.id;

    //a valid game id must be a whole number
    // be >0

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        return res.status(400).json({
            error: "Game ID must be a valid MongoDB ObjectId."
        });
    }

    /*
    Access control passes to the next middleware/controller in
    the route (e.g. gameRoutes.js).
    */
   next();

};

  /*
Exports the middleware so route files can reuse the same
validation for GET, PUT, PATCH and DELETE by ID, instead of each
controller repeating this check individually.
*/
    module.exports = validateGameId;



// every controller would need to repeat
// const gameId = Number(req.params.id); and the validation code
// and then repeat the same validation



