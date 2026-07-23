const express = require("express");

/*
Imports the game controller functions.
*/
const {
    getAllGames,
    getGameById,
    createGame
} = require("../controllers/gameController");

/*
Imports the validation middleware used when creating a game.
*/
const validateGame = require("../middleware/validateGame");

/*
Creates the game router.
*/
const router = express.Router();

/*
GET /games

The /games base path will be added inside app.js.
Therefore, this route only needs "/".
*/
router.get("/", getAllGames);

/*
GET /games/:id

The value after /games/ will be available through req.params.id.
*/
router.get("/:id", getGameById);

/*
POST /games

The request first passes through validateGame.

If validation succeeds, createGame runs next.
If validation fails, createGame is not called.
*/
router.post("/", validateGame, createGame);

/*
Exports the router.
*/
module.exports = router;