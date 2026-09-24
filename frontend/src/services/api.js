/* Connects backend and frontend

why use api.js as a connection point?
= centralise the location of the backend
instead of making every componenet independently find the 
backend, we store it here

- perform one action = connection
*/

const API_BASE_URL = "https://localhost:4000";

const TOKEN_STORAGE_KEY = "gamevaultToken";


// Small reusable helper that builds the Authorization header for
// any request that needs the JWT. 

const authHeader = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

// req the health info. async because network reqs take time
const getHealth = async () =>{

    const response = await fetch(
        `${API_BASE_URL}/health`
    );

    /*
    Parses the JSON body first, before checking response.ok.
    */
    const data = await response.json();

    if (!response.ok){
        throw new Error(
           data.error || "Could not connect to the backend."
        );
    }

    return data;

};

const registerUser = async(
    registrationData
) => {
    // send reqs to the backend = communicating with registration endpoint

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            //specify the http method
            method: "POST",
            // tells the backend that the registration body has json data
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(registrationData)
        }
    );

    // converting the backend json res into js object for the frontend
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Registration failed."
        );
    }

    return data;
};

const loginUser = async (
    loginData
) => {
    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Login failed."
        );
    }

    return data;
};

/*
GET /games
 
Public endpoint - no Authorization header sent.
*/
const getAllGames = async () => {
 
    const response = await fetch(
        `${API_BASE_URL}/games`
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not load games."
        );
    }
 
    return data;
};
 
/*
GET /games/:id
 
Public endpoint - no Authorization header sent.
*/
const getGameById = async (gameId) => {
 
    const response = await fetch(
        `${API_BASE_URL}/games/${gameId}`
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not load this game."
        );
    }
 
    return data;
};
 
/*
GET /auth/profile
 
Protected endpoint - the JWT identifies which user's profile to
return, so the user never has to supply their own ID.
*/
const getProfile = async () => {
 
    const response = await fetch(
        `${API_BASE_URL}/auth/profile`,
        {
            headers: {
                ...authHeader()
            }
        }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not load profile."
        );
    }
 
    return data;
};
 
 
/*
GET /collection 
 
Protected - JWT identifies the current user's collection.
*/
const getCollection = async () => {
 
    const response = await fetch(
        `${API_BASE_URL}/collection`,
        {
            headers: {
                ...authHeader()
            }
        }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not load your collection."
        );
    }
 
    return data;
};
 
/*
POST /collection 
 
Protected. Sends only the game's _id - the backend identifies
the user from the JWT, not from anything in the request body.
*/
const addToCollection = async (gameId) => {
 
    const response = await fetch(
        `${API_BASE_URL}/collection`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader()
            },
            body: JSON.stringify({ gameId })
        }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not add this game to your collection."
        );
    }
 
    return data;
};
 
/*
DELETE /collection/:gameId (assumed path - confirm once backend exists)
*/
const removeFromCollection = async (gameId) => {
 
    const response = await fetch(
        `${API_BASE_URL}/collection/${gameId}`,
        {
            method: "DELETE",
            headers: {
                ...authHeader()
            }
        }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not remove this game from your collection."
        );
    }
 
    return data;
};
 
/*
GET /games/:gameId/reviews (assumed path - confirm once backend exists)
 
Public - anyone can read reviews for a game, not just the
reviewer.
*/
const getReviews = async (gameId) => {
 
    const response = await fetch(
        `${API_BASE_URL}/games/${gameId}/reviews`
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not load reviews."
        );
    }
 
    return data;
};
 
/*
POST /games/:gameId/reviews (assumed path - confirm once backend exists)
 
Protected. Sends only rating and reviewText - the backend
identifies the reviewer from the JWT and the game from the URL,
never from client-supplied IDs/names.
*/
const createReview = async (gameId, reviewData) => {
 
    const response = await fetch(
        `${API_BASE_URL}/games/${gameId}/reviews`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader()
            },
            body: JSON.stringify(reviewData)
        }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(
            data.error || "Could not submit your review."
        );
    }
 
    return data;
};
 

export {getHealth,
    registerUser,
    loginUser,
    getAllGames,
    getGameById,
    getProfile,
    getCollection,
    addToCollection,
    removeFromCollection,
    getReviews,
    createReview
};

/*
req flow/how does getHealth travel?

- call api.js in app.jsx
- attempts tp get health of backend
-> fetch()
-> https.../health will be communicated with
-> express backend run
-> systemRoutes.js will be communicated with
-> systemController.js
-> JSON response gotten
-> api.js
-> app.jsx receive and process = either continue if no errors
or stop
*/


