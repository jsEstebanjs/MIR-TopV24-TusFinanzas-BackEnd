const router = require("express").Router();
const subCategoriesController = require("./subCategories.controller");
const { auth } = require('../../utils/auth')

router.route("/").get(categoriesController.listById);
router.route("/:id").get(categoriesController.show);
router.route("/:id").post(categoriesController.create);
router.route("/:id").put(categoriesController.update);
router.route("/:id").delete(categoriesController.destroy);



module.exports = router;