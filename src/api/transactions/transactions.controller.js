const Transactions = require("./transactions.model");
const User = require("../user/user.model");
const SubCategories = require("../subCategories/subCategories.model");

module.exports = {
  async listById(req, res) {
    try {
      const transactions = await Transactions.find();
      res
        .status(200)
        .json({ message: "Transacciones encontradas", data: transactions });
    } catch (err) {
      res
        .status(404)
        .json({ message: "Transacciones no encontradas", data: err });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const transactions = await Transactions.findById(id);

      res
        .status(200)
        .json({ message: "Transaccion encontrada", data: transactions });
    } catch (err) {
      res.status(400).json({ message: "Transaccion no encontrada", data: err });
    }
  },

  async create(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await User.findById(req.user);
      const subCategory = await SubCategories.findById(id);
      if (!user || !subCategory) {
        throw new Error("usuario o subCategoria no existen");
      }
      const transactions = await Transactions.create({
        ...data,
        idUser: req.user,
        idSubCategories: id,
      });
      user.idTransactions.push(transactions);
      await user.save({ validateBeforeSave: false });
      subCategory.idTransactions.push(transactions);
      await subCategory.save({ validateBeforeSave: false });

      res
        .status(200)
        .json({ message: "Transaccion creada", data: transactions });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Transaccion no creada", error: err });
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const transactions = await Transactions.findById(id);
      const newTransactions = req.body;
      if (!transactions) {
        throw new Error("Transaccion no encontrada");
      }
      const updateTransaction = await Transactions.findByIdAndUpdate(
        id,
        newTransactions,
        { new: true }
      );
      const { description, amount, type } = updateTransaction;
      res.status(200).json({
        message: "transaccion actualizada correctamente",
        data: { description, amount, type },
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Transaccion no actualizada", data: error });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      const transactions = await Transactions.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Transaccion eliminada", data: transactions });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error al eliminar la transaccion", data: err });
    }
  },
};
