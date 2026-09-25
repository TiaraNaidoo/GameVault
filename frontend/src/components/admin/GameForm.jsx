/*
Reusable form for both creating and editing a game.
*/
import { useState } from "react";
 
const ALLOWED_AGE_RATINGS = ["E", "E10+", "T", "M", "18"];
 
function GameForm({ initialGame, onSubmit, onCancel, submitting, formError }) {
 
    const isEditMode = Boolean(initialGame);
 
    const [title, setTitle] = useState(initialGame?.title ?? "");
    const [genre, setGenre] = useState(initialGame?.genre ?? "");
    const [platform, setPlatform] = useState(initialGame?.platform ?? "");
    const [releaseYear, setReleaseYear] = useState(
        initialGame?.releaseYear ?? new Date().getFullYear()
    );
    const [ageRating, setAgeRating] = useState(initialGame?.ageRating ?? "E");
    const [available, setAvailable] = useState(initialGame?.available ?? true);
 
    const currentYear = new Date().getFullYear();
 
    const handleSubmit = (event) => {
 
        event.preventDefault();
 
        const gameData = {
            title,
            genre,
            platform,
            releaseYear: Number(releaseYear),
            ageRating,
            available
        };
 
        onSubmit(gameData);
    };
 
    return (
        <form className="auth-form admin-game-form" onSubmit={handleSubmit}>
 
            <h3>{isEditMode ? `Edit "${initialGame.title}"` : "Add New Game"}</h3>
 
            <label htmlFor="game-title">Title</label>
            <input
                id="game-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />
 
            <label htmlFor="game-genre">Genre</label>
            <input
                id="game-genre"
                type="text"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                required
            />
 
            <label htmlFor="game-platform">Platform</label>
            <input
                id="game-platform"
                type="text"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                required
            />
 
            <label htmlFor="game-release-year">Release Year</label>
            <input
                id="game-release-year"
                type="number"
                min={1950}
                max={currentYear + 2}
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                required
            />
 
            <label htmlFor="game-age-rating">Age Rating</label>
            <select
                id="game-age-rating"
                value={ageRating}
                onChange={(event) => setAgeRating(event.target.value)}
            >
                {ALLOWED_AGE_RATINGS.map((rating) => (
                    <option key={rating} value={rating}>
                        {rating}
                    </option>
                ))}
            </select>
 
            <label className="checkbox-label" htmlFor="game-available">
                <input
                    id="game-available"
                    type="checkbox"
                    checked={available}
                    onChange={(event) => setAvailable(event.target.checked)}
                />
                Available
            </label>
 
            {formError && (
                <p className="auth-error">{formError}</p>
            )}
 
            <div className="admin-form-actions">
                <button type="submit" disabled={submitting}>
                    {submitting
                        ? (isEditMode ? "Saving..." : "Creating...")
                        : (isEditMode ? "Save Changes" : "Create Game")}
                </button>
 
                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
            </div>
 
        </form>
    );
}
 
export default GameForm;
 