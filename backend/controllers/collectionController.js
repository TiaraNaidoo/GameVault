/*
collectionController.js handles a logged-in user's personal
game collection.
 
Every function here assumes authenticateToken has already run,
so req.user.userId is available and trustworthy - a collection
always belongs to the authenticated user, never to a
client-supplied user ID.
*/
const mongoose = require("mongoose");
 
const Collection = require("../models/Collection");
const Game = require("../models/Game");
 
/*
GET /collection
 
Returns the full game details for every game in the current
user's collection - not just the raw collection entries - so the
frontend can render a GameCard-style list directly, matching the
same shape returned by GET /games.
*/
const getMyCollection = async (req, res, next) => {
 
    try {
 
        /*
        populate("gameId") replaces each entry's gameId
        (an ObjectId) with the full matching Game document.
        */
        const entries = await Collection.find({
            userId: req.user.userId
        }).populate("gameId");
 
        /*
        If a game was deleted after being added to someone's
        collection, populate() leaves gameId as null rather than
        throwing. Those orphaned entries are filtered out here
        so the frontend never receives a null "game".
        */
        const games = entries
            .filter(entry => entry.gameId !== null)
            .map(entry => entry.gameId);
 
        return res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
 
    } catch (error) {
        next(error);
    }
 
};
 
/*
POST /collection
 
Body: { gameId }
 
Adds one game to the current user's collection. The user is
never asked for or trusted to supply their own user ID - it
comes from the verified JWT.
*/
const addToCollection = async (req, res, next) => {
 
    try {
 
        const { gameId } = req.body;
 
        if (!gameId || !mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
                success: false,
                error: "A valid gameId is required."
            });
        }
 
        /*
        Confirm the game actually exists before linking it to a
        collection - prevents collections silently pointing at
        games that were never real.
        */
        const game = await Game.findById(gameId);
 
        if (!game) {
            return res.status(404).json({
                success: false,
                error: "Game not found."
            });
        }
 
        /*
        Check for an existing entry first, for a clean, specific
        error message. The schema's unique index (userId +
        gameId) is the race-proof backstop if two requests for
        the same addition arrive at almost the same time - see
        Collection.js and errorHandler.js's 11000 handling.
        */
        const existingEntry = await Collection.findOne({
            userId: req.user.userId,
            gameId
        });
 
        if (existingEntry) {
            return res.status(409).json({
                success: false,
                error: "This game is already in your collection."
            });
        }
 
        const newEntry = await Collection.create({
            userId: req.user.userId,
            gameId
        });
 
        return res.status(201).json({
            success: true,
            message: "Game added to your collection.",
            data: newEntry
        });
 
    } catch (error) {
        next(error);
    }
 
};
 
/*
DELETE /collection/:gameId
 
Removes one game from the current user's collection.
 
validateObjectIdParam("gameId") has already confirmed the format
before this runs - see routes/collectionRoutes.js.
*/
const removeFromCollection = async (req, res, next) => {
 
    try {
 
        const { gameId } = req.params;
 
        /*
        The filter includes userId, not just gameId - this is
        what stops one user from being able to remove an entry
        from someone else's collection just by guessing/copying
        a gameId. findOneAndDelete only matches a document that
        satisfies BOTH conditions.
        */
        const deletedEntry = await Collection.findOneAndDelete({
            userId: req.user.userId,
            gameId
        });
 
        if (!deletedEntry) {
            return res.status(404).json({
                success: false,
                error: "This game is not in your collection."
            });
        }
 
        return res.status(200).json({
            success: true,
            message: "Game removed from your collection.",
            data: deletedEntry
        });
 
    } catch (error) {
        next(error);
    }
 
};
 
module.exports = {
    getMyCollection,
    addToCollection,
    removeFromCollection
};
 