const router = require("express").Router();
const userController = require("./user.controller");
const { auth } = require('../../utils/auth')

router.route("/login").post(userController.signin);
router.route("/register").post(userController.signup);
router.route("/").get(auth,userController.show);
router.route("/").put(auth,userController.update);
router.route("/").delete(auth,userController.destroy);



module.exports = router;