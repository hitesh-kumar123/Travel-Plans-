import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { getReviews, clearReviewError } from "../redux/actions/reviewActions";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewForm from "../components/reviews/ReviewForm";
import RatingSummary from "../components/reviews/RatingSummary";
import "./Home.css";

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    reviews,
    total,
    pages,
    averageRating,
    ratingDistribution,
    loading,
    error,
  } = useSelector((s) => s.reviews);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(
    searchParams.get("write") === "true",
  );
  const [scrolled, setScrolled] = useState(false);

  const initialDestination = searchParams.get("destination") || "";

  useEffect(() => {
    dispatch(getReviews({ sort, page, limit: 12 }));
  }, [dispatch, sort, page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    dispatch(clearReviewError());
    dispatch(getReviews({ sort, page: 1, limit: 12 }));
    setPage(1);
  };

  const topReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating || b.helpfulVotes - a.helpfulVotes)
    .slice(0, 3);

  return (
    <div className="wander-page">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">
          Pack<span>Go</span>
        </Link>
        <ul className="wander-nav-links">
          <li>
            <Link to="/#wander-dest-section">Destinations</Link>
          </li>
          <li>
            <Link to="/#wander-features">Features</Link>
          </li>
          <li>
            <Link
              to="/reviews"
              style={{ color: "var(--coral)", fontWeight: 600 }}
            >
              Reviews
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
        {isAuthenticated ? (
          <Link to="/dashboard">
            <button className="wander-nav-cta">My Dashboard</button>
          </Link>
        ) : (
          <Link to="/register">
            <button className="wander-nav-cta">Book Now</button>
          </Link>
        )}
      </nav>

      {/* ─── Hero Banner ─────────────────────────────────────── */}
      <section
        className="wander-hero"
        style={{ minHeight: "45vh", paddingTop: "6rem", paddingBottom: "3rem" }}
      >
        <div className="wander-hero-content">
          <div className="wander-hero-badge">
            <div className="wander-dot" /> Verified Reviews
          </div>
          <h1>
            Real stories from <em>real travelers</em>
          </h1>
          <p>
            Discover honest experiences from our community of explorers. Every
            review is verified and moderated to keep things authentic.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "1.5rem",
            }}
          >
            <button
              className="wander-nav-cta"
              onClick={() => setFormOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              ✏️ Write a Review
            </button>
          </div>
        </div>
        <div className="wander-hero-visual">
          <div className="wander-stat-tag" style={{ cursor: "default" }}>
            <div className="wander-stat-num">
              {averageRating?.toFixed(1) || "—"}★
            </div>
            <div className="wander-stat-txt">
              {total?.toLocaleString() || 0} Reviews
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Overall Rating Summary */}
        {total > 0 && (
          <Box mb={5}>
            <Typography variant="h5" fontWeight={700} mb={2.5}>
              Overall Rating
            </Typography>
            <RatingSummary
              averageRating={averageRating}
              totalCount={total}
              ratingDistribution={ratingDistribution}
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Top Reviews Section */}
        {topReviews.length > 0 && sort === "recent" && page === 1 && (
          <Box mb={5}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
            >
              <StarIcon sx={{ color: "#FFB300" }} />
              <Typography variant="h5" fontWeight={700}>
                Top Reviews
              </Typography>
              <Chip
                label="Highest Rated"
                size="small"
                color="warning"
                variant="outlined"
              />
            </Box>
            <Grid container spacing={2.5}>
              {topReviews.map((review) => (
                <Grid item xs={12} md={4} key={review._id}>
                  <ReviewCard review={review} showDestination />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All Reviews */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>
                {sort === "recent"
                  ? "Recent Reviews"
                  : sort === "highest"
                    ? "Highest Rated"
                    : "Most Helpful"}
              </Typography>
              <Chip
                label={`${total.toLocaleString()} total`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sort}
                  label="Sort by"
                  onChange={handleSortChange}
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="highest">Highest Rated</MenuItem>
                  <MenuItem value="helpful">Most Helpful</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<RateReviewIcon />}
                onClick={() => setFormOpen(true)}
                size="small"
              >
                Write a Review
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                bgcolor: "grey.50",
                borderRadius: 3,
              }}
            >
              <RateReviewIcon sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                No approved reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Be the first to share your travel experience!
              </Typography>
              <Button
                variant="contained"
                onClick={() => setFormOpen(true)}
                startIcon={<RateReviewIcon />}
              >
                Write the First Review
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2.5}>
                {reviews.map((review) => (
                  <Grid item xs={12} sm={6} lg={4} key={review._id}>
                    <ReviewCard review={review} showDestination />
                  </Grid>
                ))}
              </Grid>

              {pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={pages}
                    page={page}
                    onChange={(_, val) => {
                      setPage(val);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* ─── Write Review Dialog ─────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          dispatch(clearReviewError());
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          Share Your Experience
          <IconButton
            size="small"
            onClick={() => {
              setFormOpen(false);
              dispatch(clearReviewError());
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <ReviewForm
            initialDestination={initialDestination}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="wander-footer">
        <div className="wander-footer-brand">
          <div className="wander-logo" style={{ fontSize: "1.5rem" }}>
            Pack<span>Go</span>
          </div>
          <p>Your smart travel companion</p>
          <div className="wander-social">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>
        <div className="wander-footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="wander-footer-links">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </div>
  );
};

export default ReviewsPage;
