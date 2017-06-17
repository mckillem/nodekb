const express = require("express");
const router = express.Router();

// article model
let Article = require("../models/article");
// user model
let User = require("../models/user");


// add route
router.get("/add", ensureAuthenticated, function(req, res) {
    res.render("add_article", {
        title: "Přidej úkol"
    });
});

// add submit POST route
router.post("/add", function(req, res) {
    const title = req.body.title;
    const author = req.user._id;
    const worker = req.body.worker;
    const body = req.body.body;

    req.checkBody("title", "Je požadován název").notEmpty();
    // req.checkBody("author", "Je požadován autor").notEmpty();
    req.checkBody("worker", "Je požadován pracovník").notEmpty();
    req.checkBody("body", "Je požadován obsah").notEmpty();


    // get errors
    let errors = req.validationErrors();

    if(errors) {
        res.render("add_article", {
            title: "Přidej úkol",
            errors: errors
        });
    } else {
        let article = new Article({
            title: title,
            author: author,
            worker: worker,
            body: body
        });

        article.save(function(err) {
            if(err) {
                console.log(err);
                return;
            } else {
                req.flash("success", "Úkol přidán");
                res.redirect("/");
            }
        });
    }
});

// load edit form
router.get("/edit/:id", ensureAuthenticated, function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if(article.author != req.user._id) {
            req.flash("danger", "Neautorizovaný přístup");
            res.redirect("/");
        }
        res.render("edit_article", {
            title: "Upravit úkol",
            article: article
        });
    });
});

// update submit POST route
router.post("/edit/:id", function(req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.worker = req.body.worker;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash("success", "Úkol upraven");
            res.redirect("/");
        }
    });
});

router.delete("/:id", function(req, res) {
    if(!req.user._id) {
        res.status(500).send();
    }

    let query = {_id:req.params.id};

    Article.findById(req.params.id, function(err, article) {
        if(article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function(err) {
                if(err) {
                    console.log(err);
                }
                res.send("Success");
            });
        }
    });
});

// get single article
router.get("/:id", function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        User.findById(article.author, function(err, user) {
            res.render("article", {
                article: article,
                author: user.name,
                worker: article.worker
               // console: console.log(user._id)
            });
        });
    });
});

// access control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("danger", "Přihlas se");
        res.redirect("/users/login");
    }
};

module.exports = router;