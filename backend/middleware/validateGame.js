/*
Validates the request body before a new game is created.

Middleware runs before the controller function.
*/
const validateGame = (req, res, next) => {

    /*
    Extracts the expected values from the request body.
    */
    const {
        title,
        genre,
        platform,
        releaseYear,
        ageRating
    } = req.body;

    /*
    Checks that all required fields were supplied.

    releaseYear is compared with undefined because a number
    should not be checked in exactly the same way as text.
    */
    if (
        !title ||
        !genre ||
        !platform ||
        releaseYear === undefined ||
        !ageRating
    ) {
        return res.status(400).json({
            error:
                "Title, genre, platform, release year and age rating are required."
        });
    }

    /*
    Checks that all expected text fields contain strings.
    */
    if (
        typeof title !== "string" ||
        typeof genre !== "string" ||
        typeof platform !== "string" ||
        typeof ageRating !== "string"
    ) {
        return res.status(400).json({
            error:
                "Title, genre, platform and age rating must be text."
        });
    }

    /*
    Removes unnecessary spaces from the beginning and end of
    each text value.

    The age rating is also changed to uppercase so that values
    such as "t" and "m" can be handled consistently.
    */
    const cleanedTitle = title.trim();
    const cleanedGenre = genre.trim();
    const cleanedPlatform = platform.trim();
    const cleanedAgeRating = ageRating.trim().toUpperCase();

    /*
    Validates the length of the game title.
    */
    if (
        cleanedTitle.length < 2 ||
        cleanedTitle.length > 100
    ) {
        return res.status(400).json({
            error:
                "Title must contain between 2 and 100 characters."
        });
    }

    /*
    Validates the length of the genre.
    */
    if (
        cleanedGenre.length < 2 ||
        cleanedGenre.length > 50
    ) {
        return res.status(400).json({
            error:
                "Genre must contain between 2 and 50 characters."
        });
    }

    /*
    Validates the length of the platform.
    */
    if (
        cleanedPlatform.length < 2 ||
        cleanedPlatform.length > 50
    ) {
        return res.status(400).json({
            error:
                "Platform must contain between 2 and 50 characters."
        });
    }

    /*
    Creates the maximum permitted release year dynamically.

    Games announced for the near future may use a release year
    up to two years after the current year.
    */
    const currentYear = new Date().getFullYear();

    /*
    Validates that releaseYear:

    - Is a number.
    - Is a whole number.
    - Is not earlier than 1950.
    - Is not more than two years into the future.
    */
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

    /*
    Stores the age ratings accepted by GameVault.
    */
    const allowedAgeRatings = [
        "E",
        "E10+",
        "T",
        "M",
        "18"
    ];

    /*
    Rejects an age rating that is not included in the accepted
    list.
    */
    if (!allowedAgeRatings.includes(cleanedAgeRating)) {
        return res.status(400).json({
            error:
                `Age rating must be one of: ${allowedAgeRatings.join(", ")}.`
        });
    }

    /*
    Stores the cleaned and validated values on the request
    object.

    The controller can use these values instead of cleaning
    the request body again.
    */
    req.validatedGame = {
        title: cleanedTitle,
        genre: cleanedGenre,
        platform: cleanedPlatform,
        releaseYear,
        ageRating: cleanedAgeRating
    };

    /*
    Passes the request to the next function.

    In this case, the next function will be the createGame
    controller.
    */
    next();

};

/*
Exports the middleware function.
*/
module.exports = validateGame;