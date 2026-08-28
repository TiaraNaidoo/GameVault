/*
Validates the request body for a partial game update
(PATCH /games/:id).
 
The client only sends the fields they want to change. But:
 
- The body must not be empty (nothing to update).
- Only recognised game fields are allowed (no silently ignored
  typos or unexpected properties).
- Any field that IS supplied must still pass the same rules used
  for creation (same length limits, same allowed age ratings,
  same release year range).
- Fields that are NOT supplied are left out of req.validatedGame
  entirely, so the controller's findByIdAndUpdate only touches
  what was actually sent.
*/
const validatePartialGame = (req, res, next) => {
 
    /*
    Rejects an empty request body - there is nothing to update.
    */
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Request body cannot be empty."
        });
    }
 
    const {
        title,
        genre,
        platform,
        releaseYear,
        ageRating,
        available
    } = req.body;
 
    /*
    The set of fields GameVault allows a client to update via
    PATCH.
    */
    const allowedFields = [
        "title",
        "genre",
        "platform",
        "releaseYear",
        "ageRating",
        "available"
    ];
 
    /*
    Rejects any field in the request body that is not one of the
    fields GameVault recognises. This catches typos and prevents
    a client from silently sending fields that would otherwise be
    ignored.
    */
    const suppliedFields = Object.keys(req.body);
    const unexpectedFields = suppliedFields.filter(
        field => !allowedFields.includes(field)
    );
 
    if (unexpectedFields.length > 0) {
        return res.status(400).json({
            error: `Unexpected field(s): ${unexpectedFields.join(", ")}.`
        });
    }
 
    /*
    Builds up only the fields that were actually supplied.
    */
    const validatedGame = {};
 
    if (title !== undefined) {
 
        if (typeof title !== "string") {
            return res.status(400).json({
                error: "Title must be text."
            });
        }
 
        const cleanedTitle = title.trim();
 
        if (
            cleanedTitle.length < 2 ||
            cleanedTitle.length > 100
        ) {
            return res.status(400).json({
                error: "Title must contain between 2 and 100 characters."
            });
        }
 
        validatedGame.title = cleanedTitle;
    }
 
    if (genre !== undefined) {
 
        if (typeof genre !== "string") {
            return res.status(400).json({
                error: "Genre must be text."
            });
        }
 
        const cleanedGenre = genre.trim();
 
        if (
            cleanedGenre.length < 2 ||
            cleanedGenre.length > 50
        ) {
            return res.status(400).json({
                error: "Genre must contain between 2 and 50 characters."
            });
        }
 
        validatedGame.genre = cleanedGenre;
    }
 
    if (platform !== undefined) {
 
        if (typeof platform !== "string") {
            return res.status(400).json({
                error: "Platform must be text."
            });
        }
 
        const cleanedPlatform = platform.trim();
 
        if (
            cleanedPlatform.length < 2 ||
            cleanedPlatform.length > 50
        ) {
            return res.status(400).json({
                error: "Platform must contain between 2 and 50 characters."
            });
        }
 
        validatedGame.platform = cleanedPlatform;
    }
 
    if (releaseYear !== undefined) {
 
        const currentYear = new Date().getFullYear();
 
        if (
            typeof releaseYear !== "number" ||
            !Number.isInteger(releaseYear) ||
            releaseYear < 1950 ||
            releaseYear > currentYear + 2
        ) {
            return res.status(400).json({
                error:
                    `Release year must be a whole number between 1950 and ${currentYear + 2}.`
            });
        }
 
        validatedGame.releaseYear = releaseYear;
    }
 
    if (ageRating !== undefined) {
 
        if (typeof ageRating !== "string") {
            return res.status(400).json({
                error: "Age rating must be text."
            });
        }
 
        const cleanedAgeRating = ageRating.trim().toUpperCase();
 
        const allowedAgeRatings = [
            "E",
            "E10+",
            "T",
            "M",
            "18"
        ];
 
        if (!allowedAgeRatings.includes(cleanedAgeRating)) {
            return res.status(400).json({
                error: `Age rating must be one of: ${allowedAgeRatings.join(", ")}.`
            });
        }
 
        validatedGame.ageRating = cleanedAgeRating;
    }
 
    if (available !== undefined) {
 
        if (typeof available !== "boolean") {
            return res.status(400).json({
                error: "Available must be true or false."
            });
        }
 
        validatedGame.available = available;
    }
 
    /*
    Stores only the supplied, validated fields. The controller
    passes this straight to Game.findByIdAndUpdate, so any field
    left out here is left untouched in MongoDB.
    */
    req.validatedGame = validatedGame;
 
    next();
 
};
 
module.exports = validatePartialGame;
 