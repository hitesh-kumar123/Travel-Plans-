import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { voteHelpful } from "../../redux/actions/reviewActions";

const ReviewCard = ({ review, showDestination = false }) => {
  const dispatch = useDispatch();
  const { user: authUser, isAuthenticated } = useSelector((s) => s.auth);

  const authorName = review.user?.name || "Traveler";
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const travelDate = review.travelDate
    ? new Date(review.travelDate).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  const createdDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const hasVoted =
    isAuthenticated &&
    review.helpfulVotedBy?.some(
      (id) =>
        id === authUser?.id ||
        id === authUser?._id ||
        id?.toString() === authUser?.id,
    );

  const handleHelpful = () => {
    if (isAuthenticated) {
      dispatch(voteHelpful(review._id));
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      {/* Header: avatar + name + rating */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 44,
            height: 44,
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            noWrap
            sx={{ lineHeight: 1.2 }}
          >
            {authorName}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}
          >
            <Rating value={review.rating} readOnly size="small" precision={1} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {review.rating}/5
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap", mt: 0.5 }}
        >
          {createdDate}
        </Typography>
      </Box>

      {/* Destination badge (shown on global reviews page) */}
      {showDestination && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PlaceIcon sx={{ fontSize: 14, color: "secondary.main" }} />
          <Typography variant="caption" color="secondary.main" fontWeight={600}>
            {review.destination}
          </Typography>
        </Box>
      )}

      {/* Title */}
      <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>
        {review.title}
      </Typography>

      {/* Review text */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.7, whiteSpace: "pre-line" }}
      >
        {review.reviewText}
      </Typography>

      {/* Optional image */}
      {review.image && (
        <Box
          component="img"
          src={review.image}
          alt={`Review photo of ${review.destination}`}
          sx={{
            width: "100%",
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: 2,
            mt: 0.5,
          }}
        />
      )}

      <Divider sx={{ my: 0.5 }} />

      {/* Footer: travel date + helpful */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {travelDate && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 13, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Travelled {travelDate}
            </Typography>
          </Box>
        )}

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}
        >
          <Tooltip
            title={
              isAuthenticated
                ? hasVoted
                  ? "Remove helpful vote"
                  : "Mark as helpful"
                : "Log in to vote"
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={handleHelpful}
                disabled={!isAuthenticated}
                color={hasVoted ? "primary" : "default"}
              >
                {hasVoted ? (
                  <ThumbUpIcon fontSize="small" />
                ) : (
                  <ThumbUpOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          {review.helpfulVotes > 0 && (
            <Typography variant="caption" color="text.secondary">
              {review.helpfulVotes} helpful
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewCard;
