/*
Game Details page - shows one game's complete information, and
is the central place actions related to that game happen (add to
collection, write a review), so the user never has to type a
game ID anywhere themselves.
 
The game's _id comes from the URL (useParams), not from a form
field.
*/
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
 
import { getGameById, addToCollection, getReviews } from "../services/api";
import ReviewForm from "../components/ReviewForm";
 
function GameDetailsPage() {
 
    const { id } = useParams();
 
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    const [collectionMessage, setCollectionMessage] = useState("");
    const [addingToCollection, setAddingToCollection] = useState(false);
 
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState("");
 
    useEffect(() => {
 
        const loadGame = async () => {
 
            try {
                setLoading(true);
                setError("");
 
                const response = await getGameById(id);
                setGame(response.data);
 
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        const loadReviews = async () => {
 
            try {
                setReviewsLoading(true);
                setReviewsError("");
 
                const response = await getReviews(id);
                setReviews(response.data);
 
            } catch (requestError) {
                setReviewsError(requestError.message);
            } finally {
                setReviewsLoading(false);
            }
        };
 
        loadGame();
        loadReviews();
 
    }, [id]);
 
    const handleAddToCollection = async () => {
 
        try {
            setAddingToCollection(true);
            setCollectionMessage("");
 
            await addToCollection(game._id);
 
            setCollectionMessage("Added to your collection.");
 
        } catch (requestError) {
            setCollectionMessage(requestError.message);
        } finally {
            setAddingToCollection(false);
        }
    };
 
    /*
    Called by ReviewForm once a review has been successfully
    submitted. Prepends the new review to the existing list so it
    appears immediately, without re-fetching the whole list from
    the backend.
    */
    const handleReviewSubmitted = (response) => {
        setReviews((current) => [response.data, ...current]);
    };
 
    if (loading) {
        return (
            <div className="page">
                <p>Loading game...</p>
            </div>
        );
    }
 
    if (error) {
        return (
            <div className="page">
                <div className="status-error">
                    <strong>Could not load this game</strong>
                    <p>{error}</p>
                </div>
                <Link to="/games">Back to Browse Games</Link>
            </div>
        );
    }
 
    return (
        <div className="page">
 
            <Link to="/games" className="back-link">
                ← Back to Browse Games
            </Link>
 
            <h2>{game.title}</h2>
 
            <p className="game-card-meta">
                {game.genre} · {game.platform} · {game.releaseYear}
            </p>
 
            <p className="game-card-meta">
                Age Rating: {game.ageRating}
            </p>
 
            <p className={game.available ? "game-available" : "game-unavailable"}>
                {game.available ? "Available" : "Unavailable"}
            </p>
 
            <button
                onClick={handleAddToCollection}
                disabled={addingToCollection}
            >
                {addingToCollection ? "Adding..." : "Add to My Collection"}
            </button>
 
            {collectionMessage && (
                <p className="collection-message">{collectionMessage}</p>
            )}
 
            <section className="reviews-section">
 
                <h3>Reviews</h3>
 
                <ReviewForm gameId={game._id} onReviewSubmitted={handleReviewSubmitted} />
 
                {reviewsLoading && (
                    <p>Loading reviews...</p>
                )}
 
                {!reviewsLoading && reviewsError && (
                    <div className="status-error">
                        <strong>Could not load reviews</strong>
                        <p>{reviewsError}</p>
                    </div>
                )}
 
                {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                    <p>No reviews yet - be the first to write one.</p>
                )}
 
                {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                    <div className="review-list">
                        {reviews.map((review) => (
                            <div className="review-item" key={review._id}>
                                <p className="review-meta">
                                    <strong>
                                        {review.userId ? review.userId.name : "Unknown user"}
                                    </strong>
                                    {" "}· Rating: {review.rating}/5
                                </p>
                                <p>{review.reviewText}</p>
                            </div>
                        ))}
                    </div>
                )}
 
            </section>
 
        </div>
    );
}
 
export default GameDetailsPage;
 