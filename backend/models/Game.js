const mongoose = require("mongoose");

const ALLOWED_AGE_RATINGS = ["E", "E10+", "T", "M", "18"];

const gameSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minLength: [2,"Title must be atleast 2 characters long."],
            maxLength: [100, "Name cannot exceed 100 characters."],
        },

        genre: {
            type: String,
            required: [true, "Genre is required"],
            trim: true,
            minLength: [2,"Genre must be atleast 2 characters long."],
            maxLength: [50,"Genre cannot exceed 50 characters."],
        },

        platform: {
            type: String,
            required: [true, "Platform is required"],
            trim: true,
            minLength: [2, "Platform must be atleast 2 characters long."],
            maxLength: [50, "Platform cannot exceed 50 characters."],
        },

        releaseYear: {
            type: Number,
            required:[true, "Release Year is required"],
            min: [1950, "Release Year cannot be earlier than 1950."],
            max: [new Date().getFullYear() + 2, "Release Year cannot be more than ${new Date().getFullYear() + 2}."],
            validate: {
                validator: Number.isInteger,
                message: "Release year must be a whole number.",
            },
        },

        ageRating: {
            type: String,
            required: [true, "Age Rating is required"],
            trim: true,
            uppercase: true,
            enum: {
                values: ALLOWED_AGE_RATINGS,
                message: 'Age Rating must be one of: ${ALLOWED_AGE_RATINGS.join(",")}.',
            },
        },

        available: {
            type: Boolean,
            default: true,
        },
    },
        {
        timestamps: true,
        }

);

/*
Creates the Game model, associating it with the schema above.
 
Mongoose will pluralise and lowercase this name to determine the
actual MongoDB collection name: "Game" -> "games".
*/
const Game = mongoose.model("Game", gameSchema);

module.exports = Game;