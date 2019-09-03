const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A tour must have a name."],
      trim: true,
      minLength: [5, "A tour must have at least 5 characters."],
      maxLength: [40, "A tour cannot have more than 40 characters."]
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "A tour must have a price."],
      min: [0, "A tour cannot have price less than 0."]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have group size."],
      min: [0, "A tour cannot have max group size less than 0."]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty level."],
      enum: ["easy", "medium", "difficult"]
    },
    duration: {
      type: Number,
      required: [true, "A tour must have duration."],
      min: [0, "A tour cannot have duration less than 0."]
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image."]
    },
    images: [String],
    summary: {
      type: String,
      required: [true, "A tour must have a summary"]
    },
    description: String,
    priceDiscount: Number,
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});

// Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides"
  });
  next();
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

//Document Middleware
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
