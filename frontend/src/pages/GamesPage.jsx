/*
Browse Games page.
 
Loads every game from the backend on mount and displays a
GameCard for each one. Handles loading, empty, and error states
explicitly, rather than showing a blank screen while the request
is in flight or if it fails.
*/
import { useState, useEffect } from "react";
 
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
 
function GamesPage() {
 
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    useEffect(() => {
 
        const loadGames = async () => {
 
            try {
                setLoading(true);
                setError("");
 
                const response = await getAllGames();
 
                // The games controller returns { count, data }.
                setGames(response.data);
 
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        loadGames();
 
    }, []);
 
    return (
        <div className="page">
 
            <h2>Browse Games</h2>
 
            {loading && (
                <p>Loading games...</p>
            )}
 
            {!loading && error && (
                <div className="status-error">
                    <strong>Could not load games</strong>
                    <p>{error}</p>
                </div>
            )}
 
            {!loading && !error && games.length === 0 && (
                <p>No games are available yet.</p>
            )}
 
            {!loading && !error && games.length > 0 && (
                <div className="game-grid">
                    {games.map((game) => (
                        <GameCard key={game._id} game={game} />
                    ))}
                </div>
            )}
 
        </div>
    );
}
 
export default GamesPage;
 