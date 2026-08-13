const bcrypt = require("bcrypt");

const users = require("../data/users");

const generateToken = require("../utils/generateToken");

//register a game user
const register = async (req, res, next) => {
    try {
        //get the cleaned registration from validation middleware

        const{
            name, 
            email,
            password,
            role
        } = req.validateRegistration;

        // check if the email address entered is already used
        const existingUser = users.find(
            currentUser => 
                currentUser.email === email
        );

        // return conflict code = requested account conflicts with exisitng user

        if(existingUser)
            return res.status(409).json({
        success: false,
        error: "An account with this email is already registered."
    });

// read the bcrypt const factor from the .env
// env values are automatically string so change to another
const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 12;

/*
hashes password BEFORE storing 

bcrypt also generates a salt + includes salt info in the final hash

original password is never seen by anyone but the user
*/
const passwordHash = await bcrypt.hash(
password,
saltRounds
);

// Create a temp number userID
const nextId = 
users.length>0    // I should have more than 0 users in my array
?Math.max(
    ...users.map(
        currentUser =>
            currentUser.id  // maximum vallue of users

    )
) +1
  :1;   // if there is no users, set id to 1

  // Create the stored user records
  const newUser = {
    id: nextId,
    name,
    email,
    role,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  //push the new user into array in the file users
  users.push(newUser);   

  // generates a signed token from the JWT utils
  const token = generateToken(newUser);

  return res.status(201).json({
    success: true,
    message: "User has been registered.",
    token,   // return token
    user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
    }
  });

} catch(error){

    // sends unexpected errors to the central express handler
    next(error);
}
};

const login = async(req,res,next) => {
    try{
        const{
            email, password
        }= req.validateLogin;

        // Use email address to find user
        const user = users.find(
            currentUser =>
                currentUser.email === email
        );

        // if the email or password is entered incorrectly?
        if(!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password."
            });
            }

            /*
            compare the user entered password with the stored bcrypt hash

            bcrypt does not decrypt the password.
            comparing hashes. check if the password produces a matching hashed result
            */

            const passwordMatches = 
            await bcrypt.compare(
            password, user.passwordHash
            );

            if(!passwordMatches ) {
                return res.status(401).json({
                success: false,
                error: "Invalid email or passwoord."
            }
        );
        }
        // create a refreshed token
        const token = generateToken(user);

        return res.status(200).json ({
            success: true,
            message: "Login success.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        }catch(error){
            next(error);
        }
    };

    // return the current authenticated users profile
    // won't work without the auth middleware
    // the middleware must run before the controller so that req.user is available
    const getProfile = (req, res) => {

        // finding the complete user record using the id taken from verified jwt payload
        const user = users.find(  // finding the users that are authenticated
            currentUser => currentUser.id === req.user.userId // === is compare
        );

        // token = be valid even if the temp user dont exist anymore
        if (!user) {
            return res.status(404).json ({
                success: false,
                error: "Not found."
            });
        }

        // return safe users
        return res.status(200).json({
            succcess: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
            
    };

    module.exports = {
        register, login, getProfile
    };

    
