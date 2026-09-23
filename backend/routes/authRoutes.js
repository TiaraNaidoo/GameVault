const express = require("express");

const {authLimiter} = require("../middleware/rateLimiters");

/*
creates an Express router
The router allows these routes to be grouped
together and later mounted under /auth.
*/
const router = express.Router()

/*
Imports the authentication controller functions.

register:
Creates a new user account.

login:
Authenticates an existing user.

getProfile:
Returns the authenticated user's profile.
*/
const{
    login,
    register,
    getProfile
} = require("../controllers/AuthController");

/*
Imports the authentication validation middleware.

validateRegistration:
Checks and cleans registration data.

validateLogin:
Checks and cleans login data.
*/
const {
    validateRegistration,
    validateLogin
} = require("../middleware/validateAuth")

/*
Imports the JWT authentication middleware.

authenticateToken:
Checks whether the request contains a valid
authentication token.
*/
const authenticateToken = require("../middleware/authenticateToken") 

/*
REGISTRATION ROUTE

POST /auth/register

Flow:

Request
-> validateRegistration
-> register
-> response
*/

router.post(
    "/register",
    authLimiter,
    validateRegistration,
    register
);

/*
LOGIN ROUTE

POST /auth/login

Flow:

Request
-> validateLogin
-> login
-> response
*/
router.post(
    "/login",
    authLimiter,
    validateLogin,
    login
);

/*
PROFILE ROUTE

GET /auth/profile

Flow:

Request
-> authenticateToken
-> getProfile
-> reponse

The authentication middleware must run before
getProfile so that req.user has been created
from the verified JWT.
*/

router.get(
    "/profile",
    authenticateToken,   // So getProfile does not run if the JWT is missing, expired, or invalid.
    getProfile
);

/*
Exports the router so that app.js can import it and mount it.
*/
module.exports = router;  



