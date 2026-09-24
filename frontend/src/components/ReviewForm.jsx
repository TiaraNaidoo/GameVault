/*
Review submission form.
*/
import { useState } from "react";
 
import { createReview } from "../services/api";
 
function ReviewForm({ gameId, onReviewSubmitted }) {
 
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
 
    const handleSubmit = async (event) => {
 
        event.preventDefault();
 
        setError("");
        setSubmitting(true);
 
        try {
 
            const reviewData = {
                rating: Number(rating),
                reviewText
            };
 
            const data = await createReview(gameId, reviewData);
 
            setReviewText("");
            setRating(5);
 
            if (onReviewSubmitted) {
                onReviewSubmitted(data);
            }
 
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    };
 
    return (
        <form className="auth-form" onSubmit={handleSubmit}>
 
            <label htmlFor="review-rating">
                Rating
            </label>
            <select
                id="review-rating"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>
 
            <label htmlFor="review-text">
                Review
            </label>
            <textarea
                id="review-text"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                required
                rows={4}
            />
 
            {error && (
                <p className="auth-error">{error}</p>
            )}
 
            <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
 
        </form>
    );
}
 
export default ReviewForm;
 