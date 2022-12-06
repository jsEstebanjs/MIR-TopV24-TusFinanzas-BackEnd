const Transactions = require("./transactions.model");
const User = require("../user/user.model");
const Subcategories = require("../subCategories/subCategories.model");

module.exports = {
  async list(req, res) {
    const { limit = 10, page = 1 } = req.query;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("usuario no encontrado");
    }
    try {
      const transactions = await Transactions.paginate(
        { userId: req.user },
        {
          limit: limit,
          page: page,
          sort: { createdAt: -1 },
        }
      );
      res
        .status(200)
        .json({ message: "Transacciones encontradas", data: transactions });
    } catch (err) {
      res
        .status(404)
        .json({ message: "Transacciones no encontradas", data: err });
    }
  },

  async listById(req, res) {
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
      const date = new Date();
      const { subcategoryId } = req.body;
      const data = req.body;
      const user = await User.findById(req.user).populate({
        path: "transactionsIds",
      });
      const lastDate = new Date(
        user.transactionsIds[user.transactionsIds.length - 1]?.createdAt
      );
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
      } else if (date.getMonth() !== lastDate.getMonth()) {
        if (subcategory.type === "Entry") {
          newTodoEntry =
            user.transactionsIds[user.transactionsIds.length - 1].balance +
            data.amount;
          newTodoExpense = 0;
        } else {
          newTodoEntry =
            user.transactionsIds[user.transactionsIds.length - 1].balance;
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
      if (newTodoEntry - newTodoExpense < 0) {
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

  async lastMonthsTransactions(req, res) {
    try {
      const user = User.findById(req.user);
      const transactions = await Transactions.find({ userId: req.user });
      if (!user || !transactions) {
        throw new Error("no hay usuario o transacciones");
      }

      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const transactionsPerMonth = [];
      for (let i = transactions.length - 1; i >= 0; i--) {
        if (transactionsPerMonth.length === 6) {
          break;
        }
        let currentMonth = transactions[i].createdAt.getMonth();
        let lastMonth = new Date().getMonth() ;
        if (lastMonth === currentMonth) {
          lastMonth = transactionsPerMonth.length
            ? transactionsPerMonth[transactionsPerMonth.length - 1].id
            : null;
        }
        while (lastMonth !== currentMonth && transactionsPerMonth.length < 6) {
          if (lastMonth - 1 >= 0) {
            lastMonth -= 1;
          } else {
            lastMonth = 11;
          }
          transactionsPerMonth.push({
            id: lastMonth,
            balance: transactions[i].balance,
            month: months[lastMonth],
            test: transactions[i]._id,
          });
        }
      }

      res.status(200).json({
        message: "Transacciones de los ultimos 6 meses encontradas",
        data: transactionsPerMonth,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Transacciones no encontradas", error: err.message });
    }
  },
  async TransactionsOfTheMonth(req, res) {
    try {
      const { month, year } = req.query;
      const start = new Date(year, month, 1);
      const end = new Date(year, month, 31);
      const user = User.findById(req.user);
      const transactions = await Transactions.find({
        userId: req.user,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });
      if (!user || !transactions) {
        throw new Error("no hay usuario o transacciones");
      }

      res.status(200).json({
        message: "Transacciones del meses encontradas",
        data: transactions,
      });
    } catch (err) {
      res.status(400).json({
        message: "Transacciones del mes no encontradas",
        error: err.message,
      });
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
