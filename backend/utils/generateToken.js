const jwt = require("jsonwebtoken");

/*
create a signed JWT for an authenticated user

this utility = keeps token generation logic seperate from
the reg and login controllers
*/
const generateToken = user => {

    /* read the signing secreet from the environment
     the app must not generate a token without a secret
     the same secret is needed later to verify that the token is authentic and hasnt 
     been changed
     */

    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret) {
        throw new Error(
            "JWT secret is not valid."
        );
    }
    /* stores only the claims required by this app, never include passwords, etc

    JWT payloads are encoded and signed but not normally encrypted. 
    clients can view their payload
    */
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
//sign and return the jwt
    return jwt.sign(
        payload,
        jwtSecret,
        {
            // not a hash alg, it's used to sign the token
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            // the app that creates the token
            issuer: "gamevault-api",
            // recipient of the token
            audience: "gamevault-client"
        }
    );
};