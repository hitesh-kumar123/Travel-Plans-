const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  validateReview,
  createReview,
  getApprovedReviews,
  getReviewsByDestination,
  getMyReviews,
  moderateReview,
  voteHelpful,
  deleteReview,
} = require("../controllers/reviewController");

// @route   POST /api/reviews
// @desc    Submit a review (auth required)
// @access  Private
router.post("/", auth, validateReview, createReview);

// @route   GET /api/reviews
// @desc    Get all approved reviews (public, supports ?sort=recent|highest|helpful&page=1&limit=20)
// @access  Public
router.get("/", getApprovedReviews);

// @route   GET /api/reviews/my
// @desc    Get reviews submitted by the current user
// @access  Private
router.get("/my", auth, getMyReviews);

// @route   GET /api/reviews/destination/:destination
// @desc    Get approved reviews for a specific destination
// @access  Public
router.get("/destination/:destination", getReviewsByDestination);

// @route   PUT /api/reviews/:id/moderate
// @desc    Approve or reject a review (admin only)
// @access  Private (admin guard in controller)
router.put("/:id/moderate", auth, moderateReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Toggle helpful vote on a review
// @access  Private
router.post("/:id/helpful", auth, voteHelpful);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (owner only)
// @access  Private
router.delete("/:id", auth, deleteReview);

module.exports = router;
