/*
Review.js defines the Mongoose schema and model for a game
review.
*/
const mongoose = require("mongoose");
 
const reviewSchema = new mongoose.Schema(
    {
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: [true, "gameId is required."]
        },
 
        /*
        Always set from req.user.userId (the verified JWT
        payload) inside the controller - a review is always
        attributed to whoever is actually authenticated, never
        to a name or ID the client could supply themselves.
        */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "userId is required."]
        },
 
        rating: {
            type: Number,
            required: [true, "Rating is required."],
            min: [1, "Rating must be at least 1."],
            max: [5, "Rating cannot exceed 5."],
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number."
            }
        },
 
        reviewText: {
            type: String,
            required: [true, "Review text is required."],
            trim: true,
            minlength: [5, "Review must be at least 5 characters long."],
            maxlength: [1000, "Review cannot exceed 1000 characters."]
        }
    },
    {
        timestamps: true
    }
);
 
/*
Design choice: one review per user per game. This compound
unique index enforces it at the database layer (the controller
also checks first, for a clean error message - same
defence-in-depth pattern used throughout GameVault).
 
If your lecturer's spec allows multiple reviews per user per
game instead, simply remove this index.
*/
reviewSchema.index(
    { gameId: 1, userId: 1 },
    { unique: true }
);
 
const Review = mongoose.model("Review", reviewSchema);
 
module.exports = Review;
 