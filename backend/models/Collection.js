/*
Collection.js defines the Mongoose schema and model for a
user's personal game collection.
 
Rather than one document per user with an array of game IDs,
this uses one document PER (user, game) PAIR. This makes adding
and removing a single game a simple insert/delete of one
document, rather than pushing/pulling an element out of an
array field.
*/
const mongoose = require("mongoose");
 
const collectionSchema = new mongoose.Schema(
    {
        /*
        The user this collection entry belongs to. Always set
        from req.user.userId (the verified JWT payload) inside
        the controller - never trusted from the request body,
        the same principle already used for the game's role
        field during registration.
        */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "userId is required."]
        },
 
        /*
        The game being collected. Comes from the request (either
        params or body, depending on the route), but its FORMAT
        is checked before this schema ever sees it, and its
        EXISTENCE is checked in the controller before creating
        this document.
        */
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: [true, "gameId is required."]
        }
    },
    {
        timestamps: true
    }
);
 
/*
A compound unique index prevents the same user from adding the
same game to their collection twice, even under a race condition
(two "Add to Collection" clicks arriving at almost the same
time) 
*/
collectionSchema.index(
    { userId: 1, gameId: 1 },
    { unique: true }
);
 
const Collection = mongoose.model("Collection", collectionSchema);
 
module.exports = Collection;
 