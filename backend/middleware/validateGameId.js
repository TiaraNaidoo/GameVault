/* validate the game id in the url
eg: GET /games/:id
PUT /games/:id
DELETE /games/:id
PATCH /games/:id

the value after games can be found through req,params.id
*/

const validateGameId = (req,res,next)=> {
    // route parameters are received as text/string
    // Number changes the supplied ID into a int
    const gameId = Number(req.params.id);

    //a valid game id must be a whole number
    // be >0

    if (
        !Number.isSafeInteger(gameId) ||
        gameId <= 0
    ){
        return res.status(400).json({
            success:false,
            error: "Game ID must be a whole number + >0."
        });
    }

    /*
    stores the validated number on the requested object

    controllers can now use req.gameId instead of req.params.id
    tp access the validated number
    */

    req.gameId = gameId;

    // access the control of the next middleware/controller
    next();

    // pass to be accessed to the next function in the route
    // gamesRoute.js
    Module.exports = validateGameId;

}

// every controller would need to repeat
// const gameId = Number(req.params.id); and the validation code
// and then repeat the same validation



