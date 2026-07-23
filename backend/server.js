/*
Loads the values stored in the .env file.

This must run before the environment variables are accessed.
*/
require("dotenv").config();

const express = require("express");

/*
The https module creates the secure HTTPS server.

This is a built-in Node.js module and does not need to be
installed separately.
*/
const https = require("https");

/*
The fs module reads the private key and certificate files.

This is also a built-in Node.js module.
*/
const fs = require("fs");

/*
The path module creates reliable file paths.

It allows the application to locate the certificate files even
when the server is started from a different terminal location.
*/
const path = require("path");

/*
Creates the Express application.
*/
const app = express();

/*
Enables the application to read JSON request bodies.
*/
app.use(express.json());

/*
Reads the port and application name from the environment
variables.

Fallback values are used when the environment variables are
not available.
*/
const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
const APP_NAME = process.env.APP_NAME || "GameVault API";

/*
Reads the relative private-key and certificate paths from the
environment variables.
*/
const sslKeyPath =
    process.env.SSL_KEY_PATH ||
    "certificates/privatekey.pem";

const sslCertPath =
    process.env.SSL_CERT_PATH ||
    "certificates/certificate.pem";

/*
Converts the relative paths into complete paths.

__dirname refers to the folder containing server.js.
*/
const resolvedKeyPath = path.resolve(
    __dirname,
    sslKeyPath
);

const resolvedCertPath = path.resolve(
    __dirname,
    sslCertPath
);

/*
Reads the private key and certificate.

Both files are required to create the HTTPS server.
*/
const httpsOptions = {
    key: fs.readFileSync(resolvedKeyPath),
    cert: fs.readFileSync(resolvedCertPath)
};

/*
Temporary in-memory data.

This data will be lost whenever the server restarts.
MongoDB will replace this array in a later learning unit.
*/
const games = [
    {
        id: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Action Adventure",
        platform: "Nintendo Switch",
        releaseYear: 2017,
        ageRating: "E10+",
        available: true
    },
    {
        id: 2,
        title: "Marvel's Spider-Man 2",
        genre: "Action Adventure",
        platform: "PlayStation 5",
        releaseYear: 2023,
        ageRating: "T",
        available: true
    },
    {
        id: 3,
        title: "Forza Horizon 5",
        genre: "Racing",
        platform: "Xbox Series X/S",
        releaseYear: 2021,
        ageRating: "E",
        available: false
    }
];

/*
GET /

Confirms that the API is running.
*/
app.get("/", (req, res) => {
    return res.status(200).json({
        application: APP_NAME,
        message: "Welcome to the GameVault API"
    });
});

/*
GET /about

Returns information about the application.
*/
app.get("/about", (req, res) => {
    return res.status(200).json({
        application: APP_NAME,
        description:
            "GameVault is a secure video game collection and review platform.",
        currentStage:
            "Learning Unit 1 - Backend Foundations"
    });
});

/*
GET /health

Provides a basic application health check.
*/
app.get("/health", (req, res) => {
    return res.status(200).json({
        application: APP_NAME,
        status: "OK",
        protocol: "HTTPS",
        environment:
            process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

/*
GET /games

Returns all games.
*/
app.get("/games", (req, res) => {
    return res.status(200).json({
        count: games.length,
        data: games
    });
});

/*
GET /games/:id

Returns one game using its ID.
*/
app.get("/games/:id", (req, res) => {
    const gameId = Number(req.params.id);

    /*
    Route parameters arrive as text.

    The converted ID must be a whole number.
    */
    if (!Number.isInteger(gameId)) {
        return res.status(400).json({
            error: "Game ID must be a whole number."
        });
    }

    /*
    Searches the temporary games array for a matching ID.
    */
    const game = games.find(
        currentGame => currentGame.id === gameId
    );

    if (!game) {
        return res.status(404).json({
            error: "Game not found."
        });
    }

    return res.status(200).json({
        data: game
    });
});

/*
POST /games

Validates the request and creates a new game.
*/
app.post("/games", (req, res) => {
    const {
        title,
        genre,
        platform,
        releaseYear,
        ageRating
    } = req.body;

    /*
    Confirms that every required field was supplied.
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
    Confirms that the expected text fields contain strings.
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
    Removes unnecessary spaces and standardises the age rating.
    */
    const cleanedTitle = title.trim();
    const cleanedGenre = genre.trim();
    const cleanedPlatform = platform.trim();
    const cleanedAgeRating =
        ageRating.trim().toUpperCase();

    if (
        cleanedTitle.length < 2 ||
        cleanedTitle.length > 100
    ) {
        return res.status(400).json({
            error:
                "Title must contain between 2 and 100 characters."
        });
    }

    if (
        cleanedGenre.length < 2 ||
        cleanedGenre.length > 50
    ) {
        return res.status(400).json({
            error:
                "Genre must contain between 2 and 50 characters."
        });
    }

    if (
        cleanedPlatform.length < 2 ||
        cleanedPlatform.length > 50
    ) {
        return res.status(400).json({
            error:
                "Platform must contain between 2 and 50 characters."
        });
    }

    const currentYear = new Date().getFullYear();

    /*
    Confirms that the release year is a valid whole number.
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

    const allowedAgeRatings = [
        "E",
        "E10+",
        "T",
        "M",
        "18"
    ];

    if (
        !allowedAgeRatings.includes(cleanedAgeRating)
    ) {
        return res.status(400).json({
            error:
                `Age rating must be one of: ${allowedAgeRatings.join(", ")}.`
        });
    }

    /*
    Generates the next available ID.
    */
    const nextId =
        games.length > 0
            ? Math.max(
                ...games.map(game => game.id)
            ) + 1
            : 1;

    const newGame = {
        id: nextId,
        title: cleanedTitle,
        genre: cleanedGenre,
        platform: cleanedPlatform,
        releaseYear,
        ageRating: cleanedAgeRating,
        available: true
    };

    games.push(newGame);

    return res.status(201).json({
        message: "Game created successfully.",
        data: newGame
    });
});

/*
Handles requests that do not match any valid route.

This middleware must appear after all valid routes.
*/
app.use((req, res) => {
    return res.status(404).json({
        error: "Route not found."
    });
});

/*
Creates and starts the secure HTTPS server.

app.listen() would create a normal HTTP server.

https.createServer() creates an HTTPS server using the private
key, certificate and Express application.
*/
https
    .createServer(httpsOptions, app)
    .listen(HTTPS_PORT, () => {
        console.log(
            `${APP_NAME} is running securely on https://localhost:${HTTPS_PORT}`
        );
    });