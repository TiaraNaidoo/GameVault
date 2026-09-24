/*
Validates the request body before a new review is created.
 
Follows the exact same pattern as validateGame.js: check
required fields exist and are the right type, clean/validate
them, then store the cleaned result on req.validatedReview so
the controller does not need to re-clean the body itself.
*/
const validateReview = (req, res, next) => {
 
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "Request body is required."
        });
    }
 
    const { rating, reviewText } = req.body;
 
    if (rating === undefined || !reviewText) {
        return res.status(400).json({
            success: false,
            error: "Rating and review text are required."
        });
    }
 
    if (typeof reviewText !== "string") {
        return res.status(400).json({
            success: false,
            error: "Review text must be text."
        });
    }
 
    /*
    Accepts a rating sent as a JSON number (the normal case) or
    as a numeric string (e.g. if a <select> ever posts "3"
    instead of 3) - Number(...) handles both, and Number.isInteger
    below still rejects anything that isn't a clean whole number.
    */
    const numericRating = Number(rating);
 
    if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        return res.status(400).json({
            success: false,
            error: "Rating must be a whole number between 1 and 5."
        });
    }
 
    const cleanedReviewText = reviewText.trim();
 
    if (
        cleanedReviewText.length < 5 ||
        cleanedReviewText.length > 1000
    ) {
        return res.status(400).json({
            success: false,
            error: "Review must contain between 5 and 1000 characters."
        });
    }
 
    req.validatedReview = {
        rating: numericRating,
        reviewText: cleanedReviewText
    };
 
    next();
 
};
 
module.exports = validateReview;
 