import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type_of_check: {
      type: String,
      required: true,
    },
    interval: {
      type: Number,
      required: true,
    },
    test_status: {
      type: String,
      required: true,
    },
    date_added: {
      type: Date,
      default: Date.now,
    },
    // Reference to the User model
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

// Ensure that a user can only have one instance of a specific website
websiteSchema.index({ url: 1, users: 1 }, { unique: true });

export const WebsiteSchema = mongoose.model("Website", websiteSchema);
