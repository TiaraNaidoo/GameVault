const express = require("express");

/*
Imports the game controller functions.
*/
const {
    getAllGames,
    getGameById,
    createGame,
    replaceGame,
    updateGame,
    deleteGame
} = require("../controllers/gameController");

/*
Imports the validation middleware used when creating a game.
*/
const validateGame = require("../middleware/validateGame");

/*
Imports the reusable MongoDB ObjectId format validator.
*/
const validateGameId = require("../middleware/validateGameId");

/*
Imports the full-update and partial-update validation middleware.
*/
const validateFullGame = require("../middleware/validateFullGame");
const validatePartialGame = require("../middleware/validatePartialGame");

/*
Imports the authentication middleware.

This middleware checks whether the user has provided
a valid JWT before they are allowed to create a game.
*/
const authenticateToken = require("../middleware/authenticateToken");

const authoriseRoles = require("../middleware/authoriseRoles");

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

validateGameId checks the ID format before the controller runs.
 
Malformed ObjectId -> 400 (from validateGameId)
Valid ObjectId, no document -> 404 (from getGameById)
*/
router.get("/:id", validateGameId, getGameById);

/*
POST /games

The request first passes through authenticateToken.
If authentication succeeds, the request passes to validateGame.
If validation succeeds, createGame runs next.
If authentication fails, validateGame and createGame are not called.
*/
router.post("/", authenticateToken, authoriseRoles("admin"), validateGame, createGame);

/*
PUT /games/:id
 
Full replace. Every editable field is required by
validateFullGame.
 
authenticateToken -> validateGameId -> validateFullGame -> replaceGame
*/
router.put("/:id", authenticateToken, authoriseRoles("admin"), validateGameId, validateFullGame, replaceGame);

/*
PATCH /games/:id
 
Partial update. Only supplied fields are validated/applied by
validatePartialGame.
 
authenticateToken -> validateGameId -> validatePartialGame -> updateGame
*/
router.patch("/:id", authenticateToken, authoriseRoles("admin"), validateGameId, validatePartialGame, updateGame);
/*
DELETE /games/:id
 
authenticateToken -> validateGameId -> deleteGame
*/
router.delete("/:id", authenticateToken, authoriseRoles("admin"), validateGameId, deleteGame);
/*
Exports the router.
*/
module.exports = router;