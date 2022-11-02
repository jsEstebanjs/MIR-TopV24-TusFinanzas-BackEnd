const { Schema, model } = require("mongoose");

const subCategoriesSchema = new Schema(
  {
    name: {
      type:String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "La longitud minima del nombre es 3"],
      maxlength: [100, "La longitud maxima del nombre es 100"],
    },
    favicon: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Entry', 'Expense'],
      required:[true, "el tipo es requerido"]
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true
    },
    transactionsIds: [{
      type: Schema.Types.ObjectId,
      ref: "transactions"
    }],
  },
  {
    timestamps: true,
  }
);

const Subcategories = model("subcategories", subCategoriesSchema);

module.exports = Subcategories