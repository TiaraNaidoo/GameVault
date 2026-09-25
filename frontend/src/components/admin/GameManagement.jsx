/*
Displays the full list of games for administration, with Edit
and Delete actions per game.
*/
function GameManagement({ games, onEdit, onDelete }) {
 
    if (games.length === 0) {
        return <p>No games have been added yet.</p>;
    }
 
    return (
        <div className="admin-game-list">
            {games.map((game) => (
                <div className="admin-game-row" key={game._id}>
 
                    <div className="admin-game-info">
                        <h4>{game.title}</h4>
                        <p className="game-card-meta">
                            {game.genre} · {game.platform} · {game.releaseYear}
                        </p>
                        <p className="game-card-meta">
                            Age Rating: {game.ageRating} ·{" "}
                            <span className={game.available ? "game-available" : "game-unavailable"}>
                                {game.available ? "Available" : "Unavailable"}
                            </span>
                        </p>
                    </div>
 
                    <div className="admin-game-actions">
                        <button onClick={() => onEdit(game)}>
                            Edit
                        </button>
                        <button
                            className="danger-button"
                            onClick={() => onDelete(game)}
                        >
                            Delete
                        </button>
                    </div>
 
                </div>
            ))}
        </div>
    );
}
 
export default GameManagement;
 