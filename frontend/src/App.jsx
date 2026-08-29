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
    getHealth
} from "./services/api";

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

     //jsx will return what the client sees
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
                                Application{" "}
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

            </main>

        </div>
    );
}

// default = exporting function
export default App;
