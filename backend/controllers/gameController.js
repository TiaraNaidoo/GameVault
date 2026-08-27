/*
Imports Mongoose so ObjectId format can be validated before it
is used to query MongoDB.
*/
const mongoose = require("mongoose");
/*
Imports the shared temporary games collection.
*/
const Game = require("../models/Game");

/*
Returns all games.
*/
const getAllGames = async (req, res, next) => {
try {
        /*
        Queries every document in the games collection.
        */
    const games = await Game.find();

    return res.status(200).json({
        count: games.length,
        data: games
    });

    } catch(error) {
    // sends unexpected database errors to the central express handler
      next(error);
    }
};

/*
Returns one game using the ID supplied in the route.
*/
const getGameById = async (req, res, next) => {
try {

    const gameId = req.params.id;
    /*
    Rejects values that cannot be converted into a whole-number
    game ID.
    */
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        return res.status(400).json({
            error: "Game ID must be a valid MongoDB ObjectId."
        });
    }

    /*
    Searches the games array for a game with the requested ID.
    */
    const game = await Game.findById(gameId);

    /*
    Returns 404 when no matching game exists.
    */
    if (!game) {
        return res.status(404).json({
            error: "Game not found."
        });
    }

    /*
    Returns the matching game.
    */
    return res.status(200).json({
        data: game
    });

   } catch(error) {
    next(error);
   }
};

/*
Creates a new game.

The request reaches this function only after it has passed
through the validateGame middleware.
*/
const createGame = async (req, res, next) => {
    try {

    /*
    Retrieves the cleaned values prepared by the validation
    middleware.
    */
    const {
        title,
        genre,
        platform,
        releaseYear,
        ageRating
    } = req.validatedGame;

    /*
    Creates the new game object.
    */
    const newGame = await Game.create({
        title,
        genre,
        platform,
        releaseYear,
        ageRating
        // "available" is not supplied here because the schema already defaults it to true.
    });

    /*
    Returns a 201 Created response.

    The response includes the game that was created.
    */
    return res.status(201).json({
        message: "Game created successfully.",
        data: newGame
    });

    } catch(error) {
       next(error);
    }
};

/*
Replaces a game completely (PUT).
 
The full-update validation middleware is responsible for
enforcing that every editable field is supplied. This controller
is only responsible for talking to MongoDB.
*/
const replaceGame = async (req, res, next) => {
    try{
        const gameId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
          error: "Game ID must be a valid MongoDB ObjectId."      
            });
        }

        const {
            title,
            genre,
            platform,
            releaseYear,
            ageRating
        } = req.validatedGame;

        /*
        findByIdAndUpdate locates the document by ID and applies
        the full set of validated fields.
        */
       const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        {
            title,
            genre,
            platform,
            releaseYear,
            ageRating
        },
        {
            new: true,
            runValidators: true
        }
       );

       if (!updatedGame) {
        return res.status(404).json({
            error: "Game not found."
        });
       }

       return res.status(200).json({
        message: "Game replaced successfully.",
        data: updatedGame
       });

    } catch(error) {
        next(error);
    }
};

/*
Updates only the supplied fields on a game (PATCH).
 
The partial-update validation middleware is responsible for
rejecting empty bodies and unexpected fields. This controller
only applies whatever req.validatedGame already contains.
*/
const updateGame = async (req, res, next) => {
    try{
        const gameId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
                error: "Game ID must be a valid MongoDB ObjectId."
            });
        }

        /*
        req.validatedGame contains only the fields the client
        actually supplied. Any field not included here is left
        untouched by MongoDB.
        */
       const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        req.validatedGame,
        {
            new: true,
            runValidators: true
        }
       );
       if (!updatedGame) {
        return res.status(404).json({
            error: "Game not found."
        });
       }

       return res.status(200).json({
        message: "Game updated successfully.",
        data: updatedGame
       });

    } catch(error) {
        next(error);
    }

};

/*
Deletes a game permanently.
 
Because MongoDB is persistent storage, this deletion survives a
server restart, unlike deletions from the old in-memory array.
*/

const deleteGame = async (req, res, next) => {
    try{
        const gameId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
                error: "Game ID must be a valid MongoDB ObjectId."
            });
        }

         /*
        Finds and deletes the document in a single operation,
        returning the document as it existed just before deletion.
        */
       const deletedGame = await Game.findByIdAndDelete(gameId);

       if (!deletedGame) {
        return res.status(404).json({
            error: "Game not found."
        });
       }

       return res.status(200).json({
        message: "Game deleted successfully.",
        data: deletedGame
       });

    } catch(error) {
        next(error);
    }
};

/*
Exports the controller functions so that the route file can use
them.
*/
module.exports = {
    getAllGames,
    getGameById,
    createGame,
    replaceGame,
    updateGame,
    deleteGame
};