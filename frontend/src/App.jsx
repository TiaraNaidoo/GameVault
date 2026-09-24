/*
React hooks imported

useState allows a component to remember changing values in
its state

useEffect allows code to run when a component changes/loading/loaded
*/

import {
    useState,
    useEffect
} from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    getHealth
} from "./services/api";

// ./ means "look inside the same folder this file is in."
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Navigation from "./components/Navigation";
 
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import CollectionPage from "./pages/CollectionPage";
import ProfilePage from "./pages/ProfilePage";

/*
The key used to store the JWT in the browser's localStorage.
Kept as one constant so the same exact string is used every time
the token is saved, read, or removed - a typo in any one spot
would silently break persistence.
*/
const TOKEN_STORAGE_KEY = "gamevaultToken";

function App() {

    // Receive and store health information
    // null = no health information received yet
    const [
        health,
        setHealth
    ] = useState(null);

    // Stores if the frontend is currently processing a response
    const [
        loading,
        setLoading
    ] = useState(true);

    // Display error messages and string is void because theres currently no errors
    // to display
    const [
        error,
        setError
    ] = useState("");

    /*
    Controls which authentication form is currently visible when
    the user is not logged in. Either "login" or "register".
    */
    const [
        authView,
        setAuthView
    ] = useState("login");

    /*
    Holds the current JWT, or null if the user is not
    authenticated.
 
    The initial value is read directly from localStorage using a
    function passed to useState (rather than
    localStorage.getItem(...) called plainly), so this lookup
    only happens once, when the component first mounts - not on
    every re-render.
    */
    const [
        token,
        setToken
    ] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
 

    // runs after the component is displayed
    // at the end there'll be an empty array. why? = to say that the effect should only
    // run when the component is initially loaded
    useEffect(() => {

        // Create an async function that requests backend health information
        const checkBackend = async () => {

            try {

                // Request is currently being processed
                setLoading(true);

                // No errors currently
                setError("");

                // getHealth
                // Get health information from the backend
                const data = await getHealth();

               //stores the backend response in react state
                // why? changing the state causes react to update the interface 
                // automatically
                setHealth(data);

            } catch (requestError) {

                setError(
                    requestError.message
                );

            } finally {

                // Request has finished
                setLoading(false);
            }
        };

        checkBackend();
   // empty array
    }, []);

     /*
    Called by LoginForm or RegisterForm once the backend has
    confirmed successful authentication and returned a JWT.
 
    Stores the token in BOTH places:
    - localStorage -> survives a page refresh
    - React state  -> updates the interface immediately, since
      changing localStorage alone does not trigger a re-render
    */
    const handleAuthSuccess = (data) => {
 
        if (!data || !data.token) {
            setError("Authentication succeeded but no token was returned.");
            return;
        }
 
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setToken(data.token);
    };

    /*
    Logs the user out by removing the token from both
    localStorage and React state, then resets the visible
    auth form back to login for next time.
    */
    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setAuthView("login");
    };
 

    //jsx will return what the client sees
    /*
    Not authenticated: show the existing health-check card plus
    the login/register forms. No routing needed here - this is
    the "before login" screen.
    */
    if (!token) {
    return (
        <div className="app">

            <header className="header">
                <div>
                    <h1>Gamevault</h1>
                    <p>Your secure video game collection</p>
                </div>
            </header>

            <main className="main-content">

                <section className="welcome-card">

                    <p className="label">
                        Welcome to
                    </p>

                    <h2>GameVault</h2>

                    <p>
                        Browse, manage and organise your video game collection
                    </p>

                </section>

                <section className="status-card">

                    <h2>API connection</h2>

                    {loading && (
                        <p>
                            Checking GameVault API...
                        </p>
                    )}

                    {!loading && error && (
                        <div className="status-error">

                            <strong>
                                Backend unavailable
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>
                    )}
                   {/*display when backend responds successfully*/}
                    {!loading && health && (
                        <div className="status-success">

                            <strong>
                                Backend connected
                            </strong>

                            <p>
                                Application:{" "}
                                {health.application}
                            </p>

                            <p>
                                Status:{" "}
                                {health.status}
                            </p>

                            <p>
                                Environment:{" "}
                                {health.environment}
                            </p>

                            <p>
                                Protocol:{" "}
                                {health.protocol}
                            </p>

                        </div>
                    )}

                </section>

                 <section className="auth-card">
 
                    {token ? (
                        /*
                        A token exists, so the user is treated as
                        authenticated. This section does not yet
                        verify the token is still valid/unexpired
                        with the backend - that comes in a later
                        step (calling /auth/profile).
                        */
                        <div>
                            <p>You are logged in.</p>
                            <button onClick={logout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="auth-nav">
                                <button
                                    className={authView === "login" ? "active" : ""}
                                    onClick={() => setAuthView("login")}
                                >
                                    Login
                                </button>
                                <button
                                    className={authView === "register" ? "active" : ""}
                                    onClick={() => setAuthView("register")}
                                >
                                    Register
                                </button>
                            </div>
 
                            {authView === "login" ? (
                                <LoginForm onAuthSuccess={handleAuthSuccess} />
                            ) : (
                                <RegisterForm onAuthSuccess={handleAuthSuccess} />
                            )}
                        </div>
                    )}
 
                </section>

            </main>

        </div>
    );
}

/*
    Authenticated: show the main navigation and route between the
    core feature pages instead of a single screen.
    */
    return (
        <div className="app">
 
            <Navigation onLogout={logout} />
 
            <main className="main-content main-content-wide">
 
                <Routes>
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/:id" element={<GameDetailsPage />} />
                    <Route path="/collection" element={<CollectionPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
 
                    {/*
                    Any unmatched path (including "/" right after
                    login) redirects to Browse Games, so the user
                    always lands somewhere useful.
                    */}
                    <Route path="*" element={<Navigate to="/games" replace />} />
                </Routes>
 
            </main>
 
        </div>
    );
}
 
// default = exporting function
export default App;
