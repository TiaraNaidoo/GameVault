/*
Validates authentication request bodies before the controller runs.
*/

/*
Validates registration requests.
*/
const validateRegistration = (req, res, next) => {

    /*
    Ensures a request body was supplied.
    */
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Request body is required."
        });
    }

    /*
    Extracts the expected values from the request body.
    */
    const {
        name,
        email,
        password
    } = req.body;

    /*
    Checks that all required fields were supplied.
    */
    if (
        !name ||
        !email ||
        !password
    ) {
        return res.status(400).json({
            error: "Name, email and password are required."
        });
    }

    /*
    Checks that all values are text.
    */
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            error: "Name, email and password must be text."
        });
    }

    /*
    Removes unnecessary spaces.
    The email address is also converted to lowercase.
    */
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();

    /*
    Ensures values are not empty after trimming.
    */
    if (
        cleanedName.length === 0 ||
        cleanedEmail.length === 0 ||
        cleanedPassword.length === 0
    ) {
        return res.status(400).json({
            error: "Name, email and password cannot be empty."
        });
    }

    /*
    Validates the length of the user's name.
    */
    if (
        cleanedName.length < 2 ||
        cleanedName.length > 100
    ) {
        return res.status(400).json({
            error: "Name must contain between 2 and 100 characters."
        });
    }

    /*
    Validates the email format.
    */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            error: "A valid email address is required."
        });
    }

    /*
    Password must:
    - be 8 to 128 characters
    - contain an uppercase letter
    - contain a lowercase letter
    - contain a number
    - contain a special character
    */
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/;

    if (!passwordPattern.test(cleanedPassword)) {
        return res.status(400).json({
            error:
                "Password must be 8-128 characters and include an uppercase letter, lowercase letter, number and special character."
        });
    }

    /*
    Stores the cleaned registration details.

    The role is always assigned by the backend.
    */
    req.validatedRegistration = {
        name: cleanedName,
        email: cleanedEmail,
        password: cleanedPassword,
        role: "user"
    };

    /*
    Passes control to the registration controller.
    */
    next();

};

/*
Validates login requests.
*/
const validateLogin = (req, res, next) => {

    /*
    Ensures a request body was supplied.
    */
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Request body is required."
        });
    }

    /*
    Extracts the expected values.
    */
    const {
        email,
        password
    } = req.body;

    /*
    Checks that all required fields were supplied.
    */
    if (
        !email ||
        !password
    ) {
        return res.status(400).json({
            error: "Email and password are required."
        });
    }

    /*
    Checks that both values are text.
    */
    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            error: "Email and password must be text."
        });
    }

    /*
    Cleans the supplied values.
    */
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();

    /*
    Ensures values are not empty after trimming.
    */
    if (
        cleanedEmail.length === 0 ||
        cleanedPassword.length === 0
    ) {
        return res.status(400).json({
            error: "Email and password cannot be empty."
        });
    }

    /*
    Validates the email format.
    */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            error: "A valid email address is required."
        });
    }

    /*
    Stores the cleaned login details.
    */
    req.validatedLogin = {
        email: cleanedEmail,
        password: cleanedPassword
    };

    /*
    Passes control to the login controller.
    */
    next();

};

/*
Exports both middleware functions.
*/
module.exports = {
    validateRegistration,
    validateLogin
};