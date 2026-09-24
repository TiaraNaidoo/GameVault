const express = require("express");

/*
imports helmet
Helmet is a collection of middleware functions
that set HTTP response headers to the express app
to improve security.
*/
const helmet = require("helmet");

/*
import the cors middleware

CORS = cross-origin resource sharing

origin = protocol -> host -> port = https -> localhost -> 4000

CORS adds response headers that tell browsers which frontend origins may read 
responses from the API
*/
const cors = require("cors");

// import the general apiLimiter
const {apiLimiter} = require("./middleware/rateLimiters");

/*
Imports the route files.
*/
const systemRoutes = require("./routes/systemRoutes");
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");

/*
Imports the middleware that handles invalid routes and
unexpected errors.
*/
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

/*
Creates the Express application.
*/
const app = express();

/*
2. Register helmet middleware

Since app.js handles requests from the client -> 
helmet is applied to every request handled to app.js

helmet = adds security response headers that tell browsers to apply safe behavior

helmet = middleware - must appear before the routes so that the headers are included
in route responses

*/
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            /*
            provide the fallback route for resource types that 
            dont have a more specific directive

            self = only allow resources from the same origin as the app
            why is self in single quotes?
            CSP keyword must be sent as 'self' = javascript is written as a string 
            containing those single quotes

            Without the inner quotes the CSP value would not represent the special
            'self' keyword correctly
            */
            defaultSrc: ["'self'"],

            // allows js only from the same origin as the app
            scriptSrc: ["'self'"],

            // allow css/styles only from the same origin as the app
            styleSrc: ["'self'"],

            // allow images from the same origin and data urls
            // data urls may be useful later for small embedded images 
            imageSrc: ["'self'",
                "data:"
            ],

            // allow fonts only from the same origin
            fontSrc: ["'self'"],

            /* control which locations browser scripts may connect to
            using fetch, XMLHttpsRequest, WebSocket, and EventSource = APIs

            API currently permits same-origin connections
            */
            connectSrc: ["'self'"],

            // stop plugins like object and embed from loading content
            objectSrc: ["'none'"],

            // stop the page from being placed inside a frame on another site
            // = prevents clickjacking attacks 
            frameAncestors: ["'none'"],

            // restrict the base url that could be supplied through an HTML base element
            baseUrl: ["'self'"],

            // allow form to submit only from the same origin
            formAction: ["'self'"]

            // why directive names coded like this? why inside helmet?
            // helmet converts them into the correspponding CSP header directives


        }

    }
}));

/*
CORS config:

read the approved frontend origin from the .env

a fallback is given for demo purposes
*/
const clientOrigin = process.env.CLIENT_ORIGIN ||
"http://localhost:5173"

/*
define the browser origins and request information permitted by the CORS response
headers
*/
const corsOptions = {
    origin: clientOrigin,
    methods:[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    //list the request headers that frontend may need
    //Content-type = has JSON bodies
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    // exposed selected headers to browser javascript
    // when to expose headers? -> 
    exposedHeaders: [
        "Content-Length"
    ],

    // proj doesn't send auth cookies and it should stay that way
    credentials : false,

    // 204 =  No content but preflight has been succeeded
    // preflights = testing before CORS actually run s
    optionsSuccessStatus: 204
};

// apply cors to the complete express application
// this must be called before enabling express to read json reqs

app.use(cors(corsOptions));

/*
Enables the application to read JSON request bodies.

Without this middleware, req.body may be undefined when a
client sends JSON.
*/
app.use(express.json());

// adding rateLimiter
app.use(apiLimiter);

/*
Registers the system routes.

The system router defines:

GET /
GET /about
GET /health
*/
app.use("/", systemRoutes);

/*
Registers all authentication routes under /auth.

The routes inside authRoutes.js are:

POST /register
POST /login
GET /profile

Adding /auth here makes them:

POST /auth/register
POST /auth/login
GET /auth/profile
*/
app.use("/auth", authRoutes);


/*
Registers the game routes under the /games base path.

The routes inside gameRoutes.js are combined with this path.

For example:

router.get("/") becomes GET /games
router.get("/:id") becomes GET /games/:id
router.post("/") becomes POST /games
*/
app.use("/games", gameRoutes);

app.use("/collection", collectionRoutes);

/*
Handles requests that do not match a valid route.

This must be registered after the valid routes.
*/
app.use(notFound);

/*
Handles unexpected application errors.

This must be registered after the routes and not-found
middleware.
*/
app.use(errorHandler);

/*
Exports the configured Express application.

server.js will import the application and use it to create the
HTTPS server.
*/
module.exports = app;