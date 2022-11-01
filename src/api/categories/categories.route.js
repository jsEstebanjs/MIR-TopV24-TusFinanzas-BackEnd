const router = require("express").Router();
const categoriesController = require("./categories.controller");
const { auth } = require('../../utils/auth')

router.route("/").get(categoriesController.listById);
router.route("/id").get(categoriesController.show);
router.route("/").post(auth,categoriesController.create);
router.route("/id").put(categoriesController.update);
router.route("/id").delete(categoriesController.destroy);



module.exports = router;