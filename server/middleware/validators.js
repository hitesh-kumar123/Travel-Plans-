const { body, param, query, validationResult } = require("express-validator");

/**
 * Middleware that checks for validation errors from express-validator chains.
 * If errors exist, returns a 400 response with the first error message.
 * Must be placed AFTER the validation chain arrays in the route definition.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const PASSWORD_MSG =
  "Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character";

const EXPENSE_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

const TRIP_STATUSES = ["planned", "ongoing", "completed"];

const PACKING_CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Medicine",
  "Other",
];

const PACKING_TEMPLATES = ["beach", "business", "camping"];

/**
 * Strips MongoDB operator keys (starting with $) from an object to
 * prevent NoSQL injection via query parameters.
 */
function sanitizeMongoQuery(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      clean[key] = obj[key];
    }
    // Drop non-string values (e.g. { $gt: "" }) silently
  }
  return clean;
}

/**
 * Escape special regex metacharacters so user input can be safely
 * interpolated into a RegExp.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Auth Validators
// ---------------------------------------------------------------------------

const authValidation = {
  changePassword: [
    body("currentPassword")
      .exists({ checkFalsy: true })
      .withMessage("Current password is required"),
    body("newPassword")
      .exists({ checkFalsy: true })
      .withMessage("New password is required")
      .matches(PASSWORD_REGEX)
      .withMessage(PASSWORD_MSG),
    handleValidationErrors,
  ],

  resetPassword: [
    param("token")
      .exists({ checkFalsy: true })
      .withMessage("Reset token is required")
      .isLength({ min: 1, max: 200 })
      .withMessage("Invalid reset token"),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .matches(PASSWORD_REGEX)
      .withMessage(PASSWORD_MSG),
    handleValidationErrors,
  ],

  forgotPassword: [
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    handleValidationErrors,
  ],

  requestEmailChange: [
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Please provide the new email address.")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Trip Validators
// ---------------------------------------------------------------------------

const tripValidation = {
  createTrip: [
    body("destination")
      .exists({ checkFalsy: true })
      .withMessage("Destination is required")
      .isString()
      .withMessage("Destination must be a string")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Destination must be between 1 and 200 characters"),
    body("startDate")
      .exists({ checkFalsy: true })
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .exists({ checkFalsy: true })
      .withMessage("End date is required")
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("budget")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Budget must be a non-negative number"),
    body("status")
      .optional()
      .isIn(TRIP_STATUSES)
      .withMessage(`Status must be one of: ${TRIP_STATUSES.join(", ")}`),
    body("activities")
      .optional()
      .isArray()
      .withMessage("Activities must be an array"),
    body("activities.*.name")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Activity name cannot exceed 200 characters"),
    body("activities.*.location")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Activity location cannot exceed 200 characters"),
    body("activities.*.notes")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Activity notes cannot exceed 1000 characters"),
    body("accommodation.name")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Accommodation name cannot exceed 200 characters"),
    body("accommodation.address")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Accommodation address cannot exceed 500 characters"),
    body("accommodation.bookingRef")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Booking reference cannot exceed 100 characters"),
    body("accommodation.contactInfo")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Contact info cannot exceed 200 characters"),
    body("transportation.type")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Transportation type cannot exceed 100 characters"),
    body("transportation.bookingRef")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Transportation booking ref cannot exceed 100 characters"),
    handleValidationErrors,
  ],

  updateTrip: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    body("destination")
      .optional()
      .isString()
      .withMessage("Destination must be a string")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Destination must be between 1 and 200 characters"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("budget")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Budget must be a non-negative number"),
    body("status")
      .optional()
      .isIn(TRIP_STATUSES)
      .withMessage(`Status must be one of: ${TRIP_STATUSES.join(", ")}`),
    handleValidationErrors,
  ],

  tripIdParam: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    handleValidationErrors,
  ],

  shareTokenParam: [
    param("token")
      .exists({ checkFalsy: true })
      .withMessage("Share token is required")
      .isLength({ min: 1, max: 200 })
      .withMessage("Invalid share token"),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Expense Validators
// ---------------------------------------------------------------------------

const expenseValidation = {
  createExpense: [
    body("trip")
      .exists({ checkFalsy: true })
      .withMessage("Trip ID is required")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    body("amount")
      .exists({ checkNull: true })
      .withMessage("Amount is required")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number greater than zero"),
    body("currency")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency must be a 3-letter code")
      .isAlpha()
      .withMessage("Currency must contain only letters")
      .toUpperCase(),
    body("category")
      .exists({ checkFalsy: true })
      .withMessage("Category is required")
      .isIn(EXPENSE_CATEGORIES)
      .withMessage(
        `Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`,
      ),
    body("description")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("date").optional().isISO8601().withMessage("Date must be a valid date"),
    handleValidationErrors,
  ],

  updateExpense: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Invalid expense ID format"),
    body("amount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number greater than zero"),
    body("currency")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency must be a 3-letter code")
      .isAlpha()
      .withMessage("Currency must contain only letters")
      .toUpperCase(),
    body("category")
      .optional()
      .isIn(EXPENSE_CATEGORIES)
      .withMessage(
        `Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`,
      ),
    body("description")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("date").optional().isISO8601().withMessage("Date must be a valid date"),
    handleValidationErrors,
  ],

  expenseIdParam: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Invalid expense ID format"),
    handleValidationErrors,
  ],

  tripIdParam: [
    param("tripId")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Booking Validators
// ---------------------------------------------------------------------------

const bookingValidation = {
  searchFlights: [
    body("origin")
      .exists({ checkFalsy: true })
      .withMessage("Origin is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Origin must be between 1 and 200 characters"),
    body("destination")
      .exists({ checkFalsy: true })
      .withMessage("Destination is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Destination must be between 1 and 200 characters"),
    body("departureDate")
      .exists({ checkFalsy: true })
      .withMessage("Departure date is required")
      .isISO8601()
      .withMessage("Departure date must be a valid date"),
    body("minBudget")
      .optional({ values: "falsy" })
      .isFloat({ min: 0 })
      .withMessage("Minimum budget must be a non-negative number"),
    body("maxBudget")
      .optional({ values: "falsy" })
      .isFloat({ min: 0 })
      .withMessage("Maximum budget must be a non-negative number"),
    handleValidationErrors,
  ],

  searchHotels: [
    body("location")
      .exists({ checkFalsy: true })
      .withMessage("Location is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Location must be between 1 and 200 characters"),
    body("checkIn")
      .exists({ checkFalsy: true })
      .withMessage("Check-in date is required")
      .isISO8601()
      .withMessage("Check-in date must be a valid date"),
    body("checkOut")
      .exists({ checkFalsy: true })
      .withMessage("Check-out date is required")
      .isISO8601()
      .withMessage("Check-out date must be a valid date"),
    body("minBudget")
      .optional({ values: "falsy" })
      .isFloat({ min: 0 })
      .withMessage("Minimum budget must be a non-negative number"),
    body("maxBudget")
      .optional({ values: "falsy" })
      .isFloat({ min: 0 })
      .withMessage("Maximum budget must be a non-negative number"),
    body("minRating")
      .optional({ values: "falsy" })
      .isFloat({ min: 0, max: 5 })
      .withMessage("Minimum rating must be between 0 and 5"),
    body("amenities")
      .optional()
      .isArray()
      .withMessage("Amenities must be an array"),
    handleValidationErrors,
  ],

  bookFlight: [
    body("flightId")
      .exists({ checkFalsy: true })
      .withMessage("Flight ID is required")
      .isString()
      .trim(),
    body("passengers")
      .exists()
      .withMessage("Passenger details are required")
      .isArray({ min: 1 })
      .withMessage("At least one passenger is required"),
    body("tripId")
      .exists({ checkFalsy: true })
      .withMessage("Trip ID is required")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    handleValidationErrors,
  ],

  bookHotel: [
    body("hotelId")
      .exists({ checkFalsy: true })
      .withMessage("Hotel ID is required")
      .isString()
      .trim(),
    body("roomType")
      .exists({ checkFalsy: true })
      .withMessage("Room type is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Room type must be between 1 and 100 characters"),
    body("guests")
      .exists({ checkNull: true })
      .withMessage("Number of guests is required")
      .isInt({ min: 1 })
      .withMessage("Guests must be at least 1"),
    body("checkIn")
      .exists({ checkFalsy: true })
      .withMessage("Check-in date is required")
      .isISO8601()
      .withMessage("Check-in date must be a valid date"),
    body("checkOut")
      .exists({ checkFalsy: true })
      .withMessage("Check-out date is required")
      .isISO8601()
      .withMessage("Check-out date must be a valid date"),
    body("tripId")
      .exists({ checkFalsy: true })
      .withMessage("Trip ID is required")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Packing Validators
// ---------------------------------------------------------------------------

const packingValidation = {
  tripIdParam: [
    param("tripId")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    handleValidationErrors,
  ],

  addItem: [
    param("tripId")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Item name is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Item name must be between 1 and 200 characters"),
    body("category")
      .optional()
      .isIn(PACKING_CATEGORIES)
      .withMessage(
        `Category must be one of: ${PACKING_CATEGORIES.join(", ")}`,
      ),
    handleValidationErrors,
  ],

  toggleOrDeleteItem: [
    param("tripId")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    param("itemId")
      .custom(isValidObjectId)
      .withMessage("Invalid item ID format"),
    handleValidationErrors,
  ],

  applyTemplate: [
    param("tripId")
      .custom(isValidObjectId)
      .withMessage("Invalid trip ID format"),
    body("template")
      .exists({ checkFalsy: true })
      .withMessage("Template name is required")
      .isIn(PACKING_TEMPLATES)
      .withMessage(
        `Template must be one of: ${PACKING_TEMPLATES.join(", ")}`,
      ),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Weather Validators
// ---------------------------------------------------------------------------

const weatherValidation = {
  locationParam: [
    param("location")
      .exists({ checkFalsy: true })
      .withMessage("Location is required")
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Location must be between 1 and 200 characters")
      .matches(/^[a-zA-Z\s,.\-']+$/)
      .withMessage(
        "Location can only contain letters, spaces, commas, periods, hyphens, and apostrophes",
      ),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Destination Validators
// ---------------------------------------------------------------------------

const destinationValidation = {
  /**
   * Middleware that sanitizes query params to prevent NoSQL injection.
   * Strips any value that is not a plain string (e.g. { $gt: "" }).
   */
  sanitizeQueryParams: (req, _res, next) => {
    if (req.query) {
      for (const key of Object.keys(req.query)) {
        if (typeof req.query[key] !== "string") {
          delete req.query[key];
        } else {
          // Strip any MongoDB operator prefix
          req.query[key] = req.query[key].replace(/^\$+/, "");
        }
      }
    }
    next();
  },

  /**
   * Middleware that escapes regex metacharacters in the `q` query param
   * to prevent ReDoS attacks.
   */
  sanitizeSearchQuery: (req, _res, next) => {
    if (req.query && typeof req.query.q === "string") {
      req.query.q = escapeRegExp(req.query.q.trim());
    }
    next();
  },

  idParam: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Invalid destination ID format"),
    handleValidationErrors,
  ],
};

// ---------------------------------------------------------------------------
// Currency Validators
// ---------------------------------------------------------------------------

const currencyValidation = {
  rates: [
    query("base")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Base currency must be a 3-letter code")
      .isAlpha()
      .withMessage("Base currency must contain only letters")
      .toUpperCase(),
    handleValidationErrors,
  ],
};

module.exports = {
  handleValidationErrors,
  authValidation,
  tripValidation,
  expenseValidation,
  bookingValidation,
  packingValidation,
  weatherValidation,
  destinationValidation,
  currencyValidation,
  sanitizeMongoQuery,
  escapeRegExp,
};
