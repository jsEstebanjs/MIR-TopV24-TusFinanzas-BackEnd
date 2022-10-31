const router = require("express").Router();
const userController = require("./user.controller");

router.route("/login").post(userController.signin);
router.route("/register").post(userController.signup);


module.exports = router;