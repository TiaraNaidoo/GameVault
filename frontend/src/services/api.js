/* Connects backedn and frontend

why use api.js as a connection point?
= centralise the location of the backend
instead of making every componenet independently find the 
backend, we store it here

- perform one action = connection
*/

const API_BASE_URL = "https://localhost:4000";

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

export {getHealth};

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


