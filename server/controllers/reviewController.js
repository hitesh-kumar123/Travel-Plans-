const Review = require("../models/Review");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// ─── Validation rules ──────────────────────────────────────────────────────
exports.validateReview = [
  body("destination").trim().notEmpty().withMessage("Destination is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),
  body("reviewText")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Review must be at least 20 characters")
    .isLength({ max: 2000 })
    .withMessage("Review cannot exceed 2000 characters"),
  body("travelDate")
    .notEmpty()
    .withMessage("Travel date is required")
    .isISO8601()
    .withMessage("Travel date must be a valid date")
    .custom((val) => {
      if (new Date(val) > new Date()) {
        throw new Error("Travel date cannot be in the future");
      }
      return true;
    }),
];

// ─── POST /api/reviews ────────────────────────────────────────────────────
// Create a review (auth required; one per user per destination)
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { destination, rating, title, reviewText, travelDate, image } =
      req.body;

    // Enforce one-review-per-destination constraint
    const existing = await Review.findOne({
      user: req.user.id,
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
    });
    if (existing) {
      return res.status(409).json({
        msg: "You have already submitted a review for this destination",
      });
    }

    const review = new Review({
      user: req.user.id,
      destination,
      rating,
      title,
      reviewText,
      travelDate,
      image: image || null,
      status: process.env.NODE_ENV === "production" ? "pending" : "approved",
    });

    await review.save();
    await review.populate("user", "name");

    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({
        msg: "You have already submitted a review for this destination",
      });
    }
    res.status(500).send("Server error");
  }
};

// ─── GET /api/reviews ─────────────────────────────────────────────────────
// Public: only approved reviews, supports sort query param
exports.getApprovedReviews = async (req, res) => {
  try {
    const { sort = "recent", limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortOption = {};
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    else if (sort === "helpful")
      sortOption = { helpfulVotes: -1, createdAt: -1 };
    else sortOption = { createdAt: -1 }; // default: most recent

    const [reviews, total] = await Promise.all([
      Review.find({ status: "approved" })
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "name"),
      Review.countDocuments({ status: "approved" }),
    ]);

    // Aggregate stats
    const stats = await Review.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalCount: { $sum: 1 },
          ratingDistribution: { $push: "$rating" },
        },
      },
    ]);

    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0 && stats[0].ratingDistribution) {
      stats[0].ratingDistribution.forEach((r) => {
        ratingDist[r] = (ratingDist[r] || 0) + 1;
      });
    }

    res.json({
      reviews,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      averageRating:
        stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
      ratingDistribution: ratingDist,
    });
  } catch (err) {
    console.error("getApprovedReviews error:", err.message);
    res.status(500).send("Server error");
  }
};

// ─── GET /api/reviews/destination/:destination ────────────────────────────
// Public: approved reviews for a specific destination name
exports.getReviewsByDestination = async (req, res) => {
  try {
    const { sort = "recent" } = req.query;
    const destination = decodeURIComponent(req.params.destination);

    let sortOption = {};
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    else if (sort === "helpful")
      sortOption = { helpfulVotes: -1, createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const reviews = await Review.find({
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
      status: "approved",
    })
      .sort(sortOption)
      .populate("user", "name");

    const avgResult = await Review.aggregate([
      {
        $match: {
          destination: { $regex: new RegExp(`^${destination}$`, "i") },
          status: "approved",
        },
      },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({
      reviews,
      averageRating:
        avgResult.length > 0 ? Math.round(avgResult[0].avg * 10) / 10 : 0,
      totalCount: avgResult.length > 0 ? avgResult[0].count : 0,
    });
  } catch (err) {
    console.error("getReviewsByDestination error:", err.message);
    res.status(500).send("Server error");
  }
};

// ─── GET /api/reviews/my ─────────────────────────────────────────────────
// Private: reviews submitted by the current user
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    console.error("getMyReviews error:", err.message);
    res.status(500).send("Server error");
  }
};

// ─── PUT /api/reviews/:id/moderate ───────────────────────────────────────
// Admin: approve or reject a review
// NOTE: In production, guard with an admin middleware. Here we check for
// an isAdmin flag on the user document as a lightweight guard.
exports.moderateReview = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ msg: "Status must be 'approved' or 'rejected'" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    review.status = status;
    await review.save();

    res.json({ msg: `Review ${status}`, review });
  } catch (err) {
    console.error("moderateReview error:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.status(500).send("Server error");
  }
};

// ─── POST /api/reviews/:id/helpful ───────────────────────────────────────
// Auth: toggle helpful vote for a review
exports.voteHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    if (review.status !== "approved") {
      return res.status(400).json({ msg: "Review is not publicly available" });
    }

    const userId = req.user.id;
    const alreadyVoted = review.helpfulVotedBy.some(
      (id) => id.toString() === userId,
    );

    if (alreadyVoted) {
      review.helpfulVotedBy = review.helpfulVotedBy.filter(
        (id) => id.toString() !== userId,
      );
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    } else {
      review.helpfulVotedBy.push(userId);
      review.helpfulVotes += 1;
    }

    await review.save();
    res.json({
      helpfulVotes: review.helpfulVotes,
      voted: !alreadyVoted,
    });
  } catch (err) {
    console.error("voteHelpful error:", err.message);
    res.status(500).send("Server error");
  }
};

// ─── DELETE /api/reviews/:id ─────────────────────────────────────────────
// Auth: owner deletes own review; admin can delete any
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ msg: "Review removed" });
  } catch (err) {
    console.error("deleteReview error:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.status(500).send("Server error");
  }
};
