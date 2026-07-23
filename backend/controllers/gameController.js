/*
Imports the shared temporary games collection.
*/
const games = require("../data/games");

/*
Returns all games.
*/
const getAllGames = (req, res) => {

    return res.status(200).json({
        count: games.length,
        data: games
    });

};

/*
Returns one game using the ID supplied in the route.
*/
const getGameById = (req, res) => {

    /*
    Route parameters are received as text.

    Number converts the supplied value into a number.
    */
    const gameId = Number(req.params.id);

    /*
    Rejects values that cannot be converted into a whole-number
    game ID.
    */
    if (!Number.isInteger(gameId)) {
        return res.status(400).json({
            error: "Game ID must be a whole number."
        });
    }

    /*
    Searches the games array for a game with the requested ID.
    */
    const game = games.find(
        currentGame => currentGame.id === gameId
    );

    /*
    Returns 404 when no matching game exists.
    */
    if (!game) {
        return res.status(404).json({
            error: "Game not found."
        });
    }

    /*
    Returns the matching game.
    */
    return res.status(200).json({
        data: game
    });

};

/*
Creates a new game.

The request reaches this function only after it has passed
through the validateGame middleware.
*/
const createGame = (req, res) => {

    /*
    Retrieves the cleaned values prepared by the validation
    middleware.
    */
    const {
        title,
        genre,
        platform,
        releaseYear,
        ageRating
    } = req.validatedGame;

    /*
    Generates the next available game ID.

    If games exist, the largest current ID is increased by one.
    If the array is empty, the first ID will be 1.
    */
    const nextId =
        games.length > 0
            ? Math.max(...games.map(game => game.id)) + 1
            : 1;

    /*
    Creates the new game object.
    */
    const newGame = {
        id: nextId,
        title,
        genre,
        platform,
        releaseYear,
        ageRating,
        available: true
    };

    /*
    Adds the new game to the temporary array.
    */
    games.push(newGame);

    /*
    Returns a 201 Created response.

    The response includes the game that was created.
    */
    return res.status(201).json({
        message: "Game created successfully.",
        data: newGame
    });

};

/*
Exports the controller functions so that the route file can use
them.
*/
module.exports = {
    getAllGames,
    getGameById,
    createGame
};