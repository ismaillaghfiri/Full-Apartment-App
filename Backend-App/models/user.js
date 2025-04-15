const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "responsable", "admin"],
      default: "user",
    },
    firstName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "responsable";
        },
        "First name is required for responsables",
      ],
    },
    lastName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "responsable";
        },
        "Last name is required for responsables",
      ],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [
        function () {
          return this.role === "responsable";
        },
        "Email is required for responsables",
      ],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "responsable";
        },
        "Phone is required for responsables",
      ],
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the model has already been compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
