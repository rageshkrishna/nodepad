module.exports = function(err, req, res, next) {
    res.render("error", { title: "Error", message: "An error occurred while trying to complete your request" });
};
