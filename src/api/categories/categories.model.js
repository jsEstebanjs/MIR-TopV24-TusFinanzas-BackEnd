const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema(
  {
    name: {
      type:String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "La longitud minima del nombre es 3"],
      maxlength: [100, "La longitud maxima del nombre es 100"]
    },
    favicon: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Entry', 'Expense'],
      required:[true, "el tipo es requerido"]
    },
    subcategoriesIds: [{
      type: Schema.Types.ObjectId,
      ref: "subcategories"
    }],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    timestamps: true,
  }
);

const Categories = model("categories", categoriesSchema);

module.exports = Categories