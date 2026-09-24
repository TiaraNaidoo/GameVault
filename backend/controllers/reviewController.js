/*
reviewController.js handles reviews for a specific game.
 
These routes are nested under /games/:id/reviews (mounted from
gameRoutes.js), so req.params.id is always the GAME's id, not
the review's.
*/
const Review = require("../models/Review");
const Game = require("../models/Game");
 
/*
GET /games/:id/reviews
 
Public - anyone can read a game's reviews, not just people who
have reviewed it themselves. validateGameId (already applied on
this route in gameRoutes.js) has confirmed req.params.id's
format before this runs.
*/
const getReviewsForGame = async (req, res, next) => {
 
    try {
 
        const gameId = req.params.id;
 
        const game = await Game.findById(gameId);
 
        if (!game) {
            return res.status(404).json({
                success: false,
                error: "Game not found."
            });
        }
 
        /*
        populate("userId", "name") replaces each review's userId
        with just that user's name - not the full User document,
        which would otherwise expose email/role alongside it.
        (passwordHash could never leak this way regardless, since
        it already has select: false on the User schema - this is
        an extra, explicit narrowing on top of that.)
        */
        const reviews = await Review.find({ gameId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });
 
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
 
    } catch (error) {
        next(error);
    }
 
};
 
/*
POST /games/:id/reviews
 
Requires authenticateToken (applied in gameRoutes.js). The
reviewer is always req.user.userId from the verified JWT - never
a name or ID supplied in the request body.
*/
const createReview = async (req, res, next) => {
 
    try {
 
        const gameId = req.params.id;
 
        const game = await Game.findById(gameId);
 
        if (!game) {
            return res.status(404).json({
                success: false,
                error: "Game not found."
            });
        }
 
        /*
        Check for an existing review first, for a clean, specific
        message. The schema's unique index (gameId + userId) is
        the race-proof backstop, same pattern as
        addToCollection/register.
        */
        const existingReview = await Review.findOne({
            gameId,
            userId: req.user.userId
        });
 
        if (existingReview) {
            return res.status(409).json({
                success: false,
                error: "You have already reviewed this game."
            });
        }
 
        const { rating, reviewText } = req.validatedReview;
 
        const newReview = await Review.create({
            gameId,
            userId: req.user.userId,
            rating,
            reviewText
        });
 
        /*
        populate after creation so the response immediately
        includes the reviewer's name, matching the shape
        getReviewsForGame returns - the frontend can append this
        straight onto its existing reviews list without a second
        request.
        */
        await newReview.populate("userId", "name");
 
        return res.status(201).json({
            success: true,
            message: "Review submitted.",
            data: newReview
        });
 
    } catch (error) {
        next(error);
    }
 
};
 
module.exports = {
    getReviewsForGame,
    createReview
};
 