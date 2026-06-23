const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
