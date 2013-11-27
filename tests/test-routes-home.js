var should = require("should"),
    home = require("../routes/home"),
    sinon = require("sinon"),
    models = require("../models");

describe("Home routes", function() {
    describe("index", function() {
        it("should return the index view with a list of notes", function() {
            var req = {},
                res = {
                    view: "",
                    viewData: {},
                    render: function(view, viewData) {
                        this.view = view;
                        this.viewData = viewData;
                    }
                };

            sinon.stub(models.Note, "find", function(callback) {
                callback(null, [ { title: "Foo", content: "Lorem ipsum dolor sit amet" } ]);
            });

            home.index(req, res);

            models.Note.find.calledOnce.should.equal(true);
            res.view.should.equal("index");
            res.viewData.should.have.property("notes");
            res.viewData.notes.should.be.instanceOf(Array)
                .and.have.length(1);

            res.viewData.notes[0].title.should.equal("Foo");
            res.viewData.notes[0].content.should.equal("Lorem ipsum dolor sit amet");

            models.Note.find.restore();
        });
    });

    describe("newNote", function() {
        it("should return the new note view", function() {
            var req = {},
                res = {
                    view: "",
                    viewData: "",
                    render: function(view, viewData) {
                        this.view = view;
                        this.viewData = viewData;
                    }
                };

            home.newNote(req, res);

            res.view.should.equal("newNote");
        });
    });

    describe("create", function() {
        var noteCtorStub;

        beforeEach(function() {
            noteCtorStub = sinon.stub(models, "Note", function() {
                return {
                    save: function(callback) {
                        callback(null, this);
                    }
                };
            });
        });

        afterEach(function() {
            noteCtorStub.restore();
        });
        
        it("should save a new note", function() {
            var req = {
                    checkBody: function() {
                        return {
                            notEmpty: function() { }
                        };
                    },
                    validationErrors: function() { return; },
                    body: {
                        content: "This is a new note\n\nLorem ipsum dolor sit amet"
                    }
                },
                res = {
                    redirect: sinon.spy()
                };


            home.create(req, res);
            
            res.redirect.calledOnce.should.equal(true);
            res.redirect.getCall(0).args[0].should.equal("/");
        });

       
        it("should require content", function() {
            var req = {
                    value: "",
                    message: "",
                    param: "",
                    checkBody: function(param, message) {
                        this.param = param;
                        this.message = message;

                        return {
                            notEmpty: function() { }
                        };
                    },
                    validationErrors: function(isMapped) {
                        return {
                            content: {
                                param: this.param,
                                msg: this.message,
                                value: this.body.content
                            }
                        };
                    },
                    body: {
                        content: ""
                    }
                },
                res = {
                    render: function(view, viewData) {
                    }
                };

            sinon.spy(res, "render");

            home.create(req, res);
            
            models.Note.called.should.equal(false);
            res.render.called.should.equal(true);
            res.render.firstCall.args[0].should.equal("newNote");
            res.render.firstCall.args[1].should.have.property("errors");

        });
    });
});
