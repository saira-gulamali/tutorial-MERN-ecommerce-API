const mongoose = require("mongoose");
const validator = require("validator"); // using a 3rd party package for validation

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxLength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],

      enum: ["office", "kitchen", "bedroom"],
    },

    company: {
      type: String,
      required: [true, "Please provide product company"],

      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colours: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: { type: Number, default: 0 },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, //set up the model to accept virtuals
  }
);

ProductSchema.virtual(
  "reviews", //name maps to what populate method calls in the controller
  {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false,
    //match: { rating: 1 },//to only show docs where rating ===1
  }
);

ProductSchema.pre("remove", async function () {
  await this.model("Review").deleteMany({ product: this._id });
});
module.exports = mongoose.model("Product", ProductSchema);
