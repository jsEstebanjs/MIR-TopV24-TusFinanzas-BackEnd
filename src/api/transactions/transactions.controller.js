const Transactions = require("./transactions.model");

module.exports = {
  async list(req, res) {
    try {
      const transactions = await Transactions.find();
      res
        .status(200)
        .json({ message: "Transactions found", data: transactions });
    } catch (err) {
      res.status(404).json({ message: "Transactions not found", data: err });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const transactions = await Transactions.findById(id);

      res
        .status(200)
        .json({ message: "Transaccion found", data: transactions });
    } catch (err) {
      res.status(400).json({ message: "Transaccion not found", data: err });
    }
  },

  //POST crear
  async create(req, res) {
    // try{
    //   const data = req.body;
    //   const user = await User.findById(req.user);
    //   if (!user) {
    //     throw new Error("User does not exist")
    //   }
    //   const transactions = await Transactions.create({ ...data, user: req.user })
    //   user.transactionsId.push(transactions)
    //   await user.save({ validateBeforeSave: false })
    //   res.status(200).json({ message: "Transaccion create", data: transactions });
    // }catch(err){
    //   res.status(400).json({ message: "Transaccion not create", error: transactions });
    // }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const transactions = await Transactions.findById(id);
      const newTransactions = req.body;
      if (!transactions) {
        throw new Error("Transaction not found");
      }
      const updateTransaction = await Transactions.findByIdAndUpdate(
        id,
        newTransactions,
        { new: true }
      );
      const { description, amount, type } = updateTransaction;
      res
        .status(200)
        .json({
          message: "updated Transaction",
          data: { description, amount, type },
        });
    } catch (error) {
      res.status(400).json({ message: "Transaction not updated", data: error });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      const transactions = await Transactions.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Transaccion Delete", data: transactions });
    } catch (err) {
      res.status(400).json({ message: "Transaccion not Delete", data: err });
    }
  },
};
