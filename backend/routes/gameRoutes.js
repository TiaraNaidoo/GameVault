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
Imports the authentication middleware.

This middleware checks whether the user has provided
a valid JWT before they are allowed to create a game.
*/
const authenticateToken = require("../middleware/authenticateToken");

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

The request first passes through authenticateToken.
If authentication succeeds, the request passes to validateGame.
If validation succeeds, createGame runs next.
If authentication fails, validateGame and createGame are not called.
*/
router.post("/", authenticateToken, validateGame, createGame);

/*
Exports the router.
*/
module.exports = router;