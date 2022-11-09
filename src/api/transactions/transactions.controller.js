const Transactions = require("./transactions.model");
const User = require("../user/user.model");
const Subcategories = require("../subCategories/subCategories.model");

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
      const { subcategoryId } = req.body;
      const data = req.body;
      const user = await User.findById(req.user);
      const subcategory = await Subcategories.findById(subcategoryId);
      if (!user || !subcategory) {
        throw new Error("usuario o subcategoria no existen");
      }
      const lastBalance = await Transactions.findById(
        user.transactionsIds[user.transactionsIds.length - 1]
      );
      let newTodoEntry;
      let newTodoExpense;
      if (user.transactionsIds.length === 0) {
        if (subcategory.type === "Entry") {
          newTodoEntry = data.amount;
          newTodoExpense = 0;
        } else {
          newTodoEntry = 0;
          newTodoExpense = data.amount;
        }
      } else {
        if (subcategory.type === "Entry") {
          newTodoEntry = lastBalance.todoEntry + data.amount;
          newTodoExpense = lastBalance.todoExpense;
        } else {
          newTodoEntry = lastBalance.todoEntry;
          newTodoExpense = lastBalance.todoExpense + data.amount;
        }
      }
      if((newTodoEntry - newTodoExpense) < 0){
        throw new Error("No tienes Saldo para esta transaccion");
      }


      const transaction = await Transactions.create({
        ...data,
        userId: req.user,
        subcategoryId: subcategoryId,
        type: subcategory.type,
        balance: newTodoEntry - newTodoExpense,
        todoEntry: newTodoEntry,
        todoExpense: newTodoExpense,
        nameCategory: subcategory.name,
        favicon: subcategory.favicon,
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
        .json({ message: "Transaccion no creada", error: err.message });
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
