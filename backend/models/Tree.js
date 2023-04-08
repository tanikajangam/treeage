
const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    moisture: {
        type: Number
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Tree', TreeSchema);