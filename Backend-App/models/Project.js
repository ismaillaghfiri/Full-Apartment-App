const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a project name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    type: {
      type: String,
      required: [true, "Please add a type"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    numberOfApartments: {
      type: Number,
      required: [true, "Please add number of apartments"],
    },
    etat: {
      type: String,
      enum: ["En Construction", "Pret et Ouvert", "Fermer"],
      default: "En Construction",
    },
    features: {
      parking: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      swimmingPool: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      playground: { type: Boolean, default: false },
      restaurant: { type: Boolean, default: false },
      cafe: { type: Boolean, default: false },
      mosque: { type: Boolean, default: false },
      shoppingArea: { type: Boolean, default: false },
      greenSpaces: { type: Boolean, default: false },
    },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    coverImage: {
      url: { type: String },
      publicId: { type: String },
    },
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign a responsable"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
projectSchema.index({
  name: "text",
  description: "text",
  city: "text",
});
projectSchema.index({ etat: 1 });
projectSchema.index({ type: 1 });
projectSchema.index({ responsable: 1 });

module.exports = mongoose.model("Project", projectSchema);
