/*
api.js = communicates with express = does the server connect

registration = collect and reg info

login form = collect login info

app.jsx = manage the general interface
= manage the auth state + other ui states

main.jsx = start react

collecting = name, email and password

*/
import {useState} from "react";

import {registerUser} from "../services/api";

// creating the reg form

// onAuthSuccess is a func that will be received from api.jsx

function RegisterForm({
    onAuthSuccess
}) {

    // storing the current value entered into a name input
    const [
        name, 
       setName
    ] = useState("");

     const [
        email, 
       setEmail
    ] = useState("");

     const [
        password, 
       setPassword
    ] = useState("");

     const [
        error, 
       setError
    ] = useState("");

     const [
        loading, 
       setLoading
    ] = useState(false);

    // run when the user submits the registration form
    const handleSubmit = async(
       event
    ) => {
        /*
        html handles the form normal
        html forms reload/ navigate the browser when sent

        preventDefault?= stops that behaviour because react will handle 
        the submission itself
        */
       event.preventDefault();

       setError("");

       setLoading(true);

       try{

        // the property names must match what the backend reg endpoints expects
        const registrationData = {
            name,
            email,
            password
        };

        // calls api.js and awaits for backend reg res
        const data = await registerUser(registrationData);

        onAuthSuccess(data);
    }catch(requestError){
        setError(requestError.message);
    }finally{
        setLoading(false);
    }
   };
       return (
         <form className="auth-form" onSubmit={handleSubmit}>
 
            <label htmlFor="register-name">
                Name
            </label>
            <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
            />
 
            <label htmlFor="register-email">
                Email
            </label>
            <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
 
            <label htmlFor="register-password">
                Password
            </label>
            <input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />
 
            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}
 
            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
 
        </form>
    );
}
 
export default RegisterForm;
       