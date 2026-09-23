const jwt = require ("jsonwebtoken");

// protect routes that require only auth users to access
const authenticateToken = (req,res,next) => {

    // read the authorization req header.

    // format we expect: Auth: Bearer token-value
    const authorizationHeader = req.headers.authorization;

    // 401 status code when no header is sent
    if (!authorizationHeader) {
        return res.status(401).json({
            success: false,
            error: "Auth token is required."
        });
    }

    // split the headder into 2 parts
    const[scheme, token] = authorizationHeader.split(" ");

    // confirm if he bearer auth scheme was used and that a token value exists
    if (
        scheme !== "Bearer" || !token   // scheme; compare it to the Bearer or no token
    ){
        return res.status(401).json({
            success: false,
            error: "Auth header must use the Bearer token format."
        });
    }

    /*
    Reads the same signing secret used by generateToken.js.
    */
    const jwtSecret = process.env.JWT_SECRET;
 
    if (!jwtSecret) {
        throw new Error("JWT secret is not configured.");
    }

    /* verify the token
     check:
     - the signature
     - the expected signing alg
     - the expiry
     - the issuer
     - audience

     = if any of the checks fail jwt.verify() will throw an error.
    */
   try{
    const decodeToken =
    jwt.verify(
        token, jwtSecret, {
            algorithms: ["HS256"],
            issuer: "gamevault-api",
            audience: "gamevault-client"
        }
    );

    /*
    req.user = { add in the role types}

    :

    generateToken

    const - payload = userid, email, role


    */
    // add the verifieed id to the req object = protected controllers can now access req.user
    req.user = decodeToken;

    next();
   }
   catch(error){
     /* complete the try catch:
     - return a speicfic response for an expired token
     */

     if(error.name === "TokenExpiredError")
     {
        return res.status(401).json({
            success: false,
            error: "Auth token is expired."
        });
     }
     // catch general errors
     return res.status(401).json({
        success: false,
        error: "Auth token is invalid."
     });
   }

};

module.exports = authenticateToken;
