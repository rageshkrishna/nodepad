var models = require("../models"),
    validator = require("express-validator");

exports.index = function(req, res){
    models.Note.find(function (err, notes) {
        res.render('index', { title: 'Notes', notes: notes });
    });
};

exports.newNote = function(req, res) {
    res.render('newNote', { title: 'New note', content: "", errors: {} });
};

exports.create = function(req, res) {
    req.checkBody("content", "Content is required").notEmpty();

    var errors = req.validationErrors(true);

    if (errors) {
        res.render("newNote", { title: "New note", errors: errors, content: req.body.content });
    } else {
        var note = new models.Note();
        note.content = req.body.content;
        var lines = note.content.split(/\r?\n/);
        note.title = lines[0];
        note.save(function(err, note) {
            res.redirect("/");
        });
    }

};
