const { Schema, model } = require("mongoose");

const transactionsSchema = new Schema(
  {
    description:{
      type:String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "La longitud minima es 3"],
      maxlength: [100, "La longitud maxima es 100"],
    },
    amount: {
      type: Number,
      required: [true, "El monto es requerido"],
      match:[/^([0-9])*$/, "Solo se aceptan numeros"]
      },
    type: {
      type: String,
      enum: ['Entry', 'Expense'],
      required: [true, "El tipo es requerido"],
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subcategories"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    timestamps: true,
  }
);

const Transactions = model("transactions", transactionsSchema);

module.exports = Transactions