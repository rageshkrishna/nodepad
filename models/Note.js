var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
    title: String,
    content: String,
    createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);
