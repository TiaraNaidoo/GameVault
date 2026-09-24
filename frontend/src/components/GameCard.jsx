/*
Displays one game's summary information on the Browse Games
page, with a link to its full details page.
*/
import { Link } from "react-router-dom";
 
function GameCard({ game }) {
 
    return (
        <div className="game-card">
 
            <h3>{game.title}</h3>
 
            <p className="game-card-meta">
                {game.genre} · {game.platform} · {game.releaseYear}
            </p>
 
            <p className="game-card-meta">
                Age Rating: {game.ageRating}
            </p>
 
            <p className={game.available ? "game-available" : "game-unavailable"}>
                {game.available ? "Available" : "Unavailable"}
            </p>
 
            <Link to={`/games/${game._id}`} className="view-details-button">
                View Details
            </Link>
 
        </div>
    );
}
 
export default GameCard;
 