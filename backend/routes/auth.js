const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'fAIZsALIMsHAIKH';


// ROUTE 1: Create User using POST "api/auth/createuser". No login req
router.post('/createuser', [
  body('name', 'Enter a Valid Name').isLength({ min: 3 }),
  body('email', 'Enter a Valid Email').isEmail(),
  body('password', 'Enter a Password').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  // If Errors Return Bad Request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // check whether user with same mail exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry account with same Email already Exist" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some Error Occurred");
  }
})

// ROUTE 2: Auth user & login using POST "api/auth/login". No login req
router.post('/login', [
  body('email', 'Enter a Valid Email').isEmail(),
  body('password', 'Enter a Password').exists()
], async (req, res) => {
  let success = false;
  // If Errors Return Bad Request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if email in DB
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    // Match Password
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    // Sendnig Payload
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Serval Error");
  }

})

// ROUTE 3:  Get Loggein in user details using POST "api/auth/getuser". login req

router.post('/getuser', fetchuser, async (req, res) => {

  // If Errors Return Bad Request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  }
  catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Serval Error");
  }
})
module.exports = router