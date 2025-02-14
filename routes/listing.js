const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // Index Route
  .get(wrapAsync(listingController.listingsIndex))
  // Create Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.listingsCreate)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewListing);

router
  .route("/:id")
  // Show Route
  .get(wrapAsync(listingController.listingsShow))
  // Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.listingsUpdate)
  )
  // Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.listingsDelete));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.listingsEdit)
);

module.exports = router;
