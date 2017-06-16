const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// bring in article model
let User = require("../models/user");

// register form
router.get("/register", function(req, res) {
    res.render("register");
});

// register proccess
router.post("/register", function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody("name", "Je požadováno jméno").notEmpty();
    req.checkBody("email", "Je požadován email").notEmpty();
    req.checkBody("email", "Toto není email").isEmail();
    req.checkBody("username", "Je požadováno uživatelské jméno").notEmpty();
    req.checkBody("password", "Je požadováno heslo").notEmpty();
    req.checkBody("password2", "Hesla se neshodují").equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render("register", {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if(err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash("success", "Jsi registrován a můžeš se přihlásit");
                        res.redirect("/users/login");
                    }
                });
            });
        });
    }
});

router.get("/login", function(req, res) {
    res.render("login");
});

// login process
router.post("/login", function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Jsi odhlášen");
    res.redirect("/users/login");
});

module.exports = router;