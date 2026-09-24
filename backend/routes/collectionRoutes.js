const express = require("express");
 
const {
    getMyCollection,
    addToCollection,
    removeFromCollection
} = require("../controllers/collectionController");
 
const authenticateToken = require("../middleware/authenticateToken");
const validateObjectIdParam = require("../middleware/validateObjectIdParam");
 
const router = express.Router();
 
/*
GET /collection
 
A collection belongs to a specific user, so this is
authenticated - there is no "browse everyone's collections"
public view.
*/
router.get("/", authenticateToken, getMyCollection);
 
/*
POST /collection
 
Body: { gameId }
 
gameId's FORMAT is checked inside addToCollection itself
(it arrives in the body, not a URL param, so the param-based
validateObjectIdParam middleware does not apply here).
*/
router.post("/", authenticateToken, addToCollection);
 
/*
DELETE /collection/:gameId
 
validateObjectIdParam("gameId") checks the URL parameter's
format before the controller runs, the same way validateGameId
protects the game routes.
*/
router.delete(
    "/:gameId",
    authenticateToken,
    validateObjectIdParam("gameId"),
    removeFromCollection
);
 
module.exports = router;
 