const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionsSchema = new Schema(
  {
    description:{
      type:String,
      required: [true, "El nombre es requerido"],
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
    },
    balance:{
      type:Number
    },
    todoEntry:{
      type:Number
    },
    todoExpense:{
      type:Number
    },
    nameCategory:{
      type:String
    },
    favicon:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

transactionsSchema.plugin(mongoosePaginate);
const Transactions = model("transactions", transactionsSchema);

module.exports = Transactions