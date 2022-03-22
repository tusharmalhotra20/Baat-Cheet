const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controller/userController");
const {protect} = require("../middleware/authMiddleware");
// 'express.Router()' is also used to define 'routes' for our application like 'app = express()' does, the difference between them is- express.Router() helps us to organize the application routes across multiple modules.

// A route in our app at some point can become quite complicated, and we'd benefit from moving all that code into a separate file. Each file's router becomes a mini app, which has a very similar structure to the main app.

router.route("/").post(registerUser).get(protect, allUsers);
//router.route() method is used to chain multiple http request for same end-point. i.e., we can write GET, POST, UPDATE, DELETE, etc for same end-point, here it is "/".

router.post("/login", authUser);
//router.post() is similar to app.post(), because we are writing the routes definition in a specific module that's why we have used 'router' instead of 'app'

module.exports = router;
