/*
allow the restriction of access according to the roles applied to the function

e.g. authoriseRoles("admin")

= means that only users with the admin role will be able go through the route
*/

const authoriseRoles=(...allowedRoles) => {

    /* return the actual middleware function

    the other func gets the allowed roles

    the inner func gets the req, res, next objects when the api reaches the route
    */

    return (req, res, next) => {

        /*
        authenticateToken should run before this middleware

        it reads the jwt and stores it decoded payload inside req.user
        = if req.user does not exist then id has not been established
        */
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Authentication required."
            });
        }

        // getting the user's role from the payload
        const userRole = req.user.role;

        // check if the users role appears in a list of roles allowed
        const hasPermission = allowedRoles.includes(userRole);

        // 403 = the server knows who you are but not what you're allowed to do
        if(!hasPermission) {
            return res.status(403).json({
                success: false,
                error: "You don't have permission to perform this action."
            });
        }

        // control is passed to the next middleware/controller
        next();
    };
    
    
};

module.exports = authoriseRoles;

