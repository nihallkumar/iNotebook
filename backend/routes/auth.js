const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const jwt_secret = "nihalisagoodboy";

//ROUTE 1: crete a user using : POST "/api/auth/createuser". No login required
router.post("/createuser", [
  body('name', 'Enter a valid Name').isLength({ min: 1 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Enter a valid Password').isLength({ min: 1 }),
], async (req, res) => {

  let success = false;
  // if there are errors, return Bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // check whether the user with this email exists
    let user = await User.findOne({ email: req.body.email })
    // console.log(user);
    if (user) {
      return res.status(400).json({ success, error: "Sorry, user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
      // password: req.body.password,
    })

    const data = {
      user: {
        id: user.id,
      }
    }
    const authtoken = jwt.sign(data, jwt_secret);

    // res.json(user)
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})

//ROUTE 2: Authenticate a user using  : post "api/auth/login". no login required
router.post("/login", [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password can not be blank').exists(),
], async (req, res) => {

  let success = false;
  // if there are errors, return Bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "please try to login with correct credentials" });
    }

    const ComparePass = await bcrypt.compare(password, user.password)
    if (!ComparePass) {
      return res.status(400).json({ success, error: "please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id,
      }
    }
    success = true;
    const authtoken = jwt.sign(data, jwt_secret);
    res.json({ success, authtoken })


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})

module.exports = router;

//ROUTE 3: Get loggedin user details using  : post "api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {

  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})