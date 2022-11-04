const Transactions = require("./transactions.model");
const User = require("../user/user.model");
const Subcategories = require("../subcategories/subcategories.model");

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
      const { subcategoryId } = req.params;
      const data = req.body;
      const user = await User.findById(req.user);
      const subcategory = await Subcategories.findById(subcategoryId)
      if (!user || !subcategory) {
        throw new Error("usuario o subcategoria no existen");
      };
      const lastBalance = await Transactions.findById(user.transactionsIds[user.transactionsIds.length - 1])
      const transaction = await Transactions.create({
        ...data,
        userId: req.user,
        subcategoryId: subcategory._id,
        type: subcategory.type,
        balance: lastBalance + data.amount
      });
      user.transactionsIds.push(transaction);
      await user.save({ validateBeforeSave: false });
      subcategory.transactionsIds.push(transaction);
      await subcategory.save({ validateBeforeSave: false });

      res
        .status(200)
        .json({ message: "Transaccion creada", data: transaction });
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
