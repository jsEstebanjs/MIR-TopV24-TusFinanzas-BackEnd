const router = require("express").Router();
const transactionsController = require("./transactions.controller");
const { auth } = require('../../utils/auth')

router.route("/").get(transactionsController.list);
router.route("/:id").get(transactionsController.listById);
router.route("/create").post(auth,transactionsController.create);
router.route("/:id").delete(transactionsController.destroy);
router.route("/:id").put(transactionsController.update);



module.exports = router;