const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be atleast 2 characters long."],
            maxLength: [100, "Name cannot exceed 100 characters."],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
        },

        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
            select: false,
        },

        role: {
            type: String,
            enum: ["user","admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;