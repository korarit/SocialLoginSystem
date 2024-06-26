var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

var db = require('../db');
var router = express.Router();

const CLIENT_URL = "http://localhost:5173/";

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
      if (err) { return cb(err); }
      if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, row);
      });
    });

}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});
  
router.get("/login/success", (req, res) => {

    if (req.isAuthenticated()) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }else{
        res.status(401).json({
            success: false,
            message: "failed",
            user: null,
            //   cookies: req.cookies
        });
    
    }

});
  
  

router.post('/login/password', function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {
        console.log("user", req);
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ success: false, message: info.message }); }

        req.login(user, function(err) {

            if (err) { return next(err); }

            console.log("user", user);

            let token;
            try{
                token = jwt.sign(
                    {
                        username: user.username,
                        uuid: uuidv4()
                    },
                    "secretkeyappearshere",
                    { expiresIn: "30d" }
                );

            }catch(err){

                console.log("error 4", err);
                return res.status(500).json({
                    success: false,
                    message: "error can't create jwt token"
                });

            }

            return res.status(200).json({ 
                success: true, 
                data: {
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname
                }, 
                message: "successfully logged in", 
                token: token
            });
        });
        })(req, res, next);
    }
);

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect(CLIENT_URL);
    });


});

  
router.post('/signup', function(req, res, next) {
    var salt = crypto.randomBytes(16);

    console.log(req.body);

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { 
        console.log("error 1", err);
        return res.status(500).json({
        success: false,
        message: "error"
    }); }
      db.run('INSERT INTO users (username, firstname, lastname, hashed_password, salt) VALUES (?, ?, ?, ?, ?)', [
        req.body.username,
        req.body.firstname,
        req.body.lastname,
        hashedPassword,
        salt
      ], function(err) {
        if (err) {console.log("error 2", err); return res.status(500).json({
            success: false,
            message: "error"
        }); }
        var user = {
            id: this.lastID,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };
        req.login(user, function(err) {
          if (err) {console.log("error 3", err); return res.status(500).json({
                success: false,
                message: "error"
            })}

            let token;
            try{
                token = jwt.sign(
                    {
                        username: req.body.username,
                        uuid: uuidv4()
                    },
                    "secretkeyappearshere",
                    { expiresIn: "30d" }
                );

            }catch(err){

                console.log("error 4", err);
                return res.status(500).json({
                    success: false,
                    message: "error can't create jwt token"
                });

            }


            res.status(200).json({
                success: true,
                message: "successfully signed up",
                data: {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                },
                token: token
            });
        });
      });
    });
});  

module.exports = router;
