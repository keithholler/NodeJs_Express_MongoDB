const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { response } = require("express");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

// router.post("/signup", (req, res) => {
//   User.findOne({ username: req.body.username })
//     .then((user) => {
//       if (user) {
//         const err = new Error(`User ${req.body.username} already exists!`);
//         err.status = 403;
//         return next(err);
//       } else {
//         User.create({
//           username: req.body.username,
//           password: req.body.password,
//         })
//           .then((user) => {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.json({ status: "Registration Successful", user: user });
//           })
//           .catch(err = next(err));
//       }
//     })
//     .catch((err) => next(err));
// });

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully logged in!" });
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
