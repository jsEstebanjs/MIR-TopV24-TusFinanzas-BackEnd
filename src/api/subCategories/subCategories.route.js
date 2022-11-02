const router = require("express").Router();
const subcategoriesController = require("./subcategories.controller");
const { auth } = require('../../utils/auth')

router.route("/").get(subcategoriesController.listById);
router.route("/:id").get(subcategoriesController.show);
router.route("/:id").post(subcategoriesController.create);
router.route("/:id").put(subcategoriesController.update);
router.route("/:id").delete(subcategoriesController.destroy);



module.exports = router;