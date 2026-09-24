/*
My Collection page.
*/
import { useState, useEffect } from "react";
 
import { getCollection, removeFromCollection } from "../services/api";
 
function CollectionPage() {
 
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    useEffect(() => {
 
        const loadCollection = async () => {
 
            try {
                setLoading(true);
                setError("");
 
                const response = await getCollection();
                setCollection(response.data);
 
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        loadCollection();
 
    }, []);
 
    const handleRemove = async (gameId) => {
 
        try {
            await removeFromCollection(gameId);
 
            setCollection((current) =>
                current.filter((game) => game._id !== gameId)
            );
 
        } catch (requestError) {
            setError(requestError.message);
        }
    };
 
    return (
        <div className="page">
 
            <h2>My Collection</h2>
 
            {loading && (
                <p>Loading your collection...</p>
            )}
 
            {!loading && error && (
                <div className="status-error">
                    <strong>Could not load your collection</strong>
                    <p>{error}</p>
                </div>
            )}
 
            {!loading && !error && collection.length === 0 && (
                <p>Your collection is empty. Add games from their details page.</p>
            )}
 
            {!loading && !error && collection.length > 0 && (
                <div className="game-grid">
                    {collection.map((game) => (
                        <div className="game-card" key={game._id}>
                            <h3>{game.title}</h3>
                            <p className="game-card-meta">
                                {game.genre} · {game.platform}
                            </p>
                            <button onClick={() => handleRemove(game._id)}>
                                Remove from Collection
                            </button>
                        </div>
                    ))}
                </div>
            )}
 
        </div>
    );
}
 
export default CollectionPage;
 