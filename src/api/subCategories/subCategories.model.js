const { Schema, model, models } = require("mongoose");

const subCategoriesSchema = new Schema(
  {
    name:{
      type:String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "La longitud minima del nombre es 3"],
      maxlength: [100, "La longitud maxima del nombre es 100"],

    },
    favicon: {
      type: String,
    },
    type:{
        type: String,
        required:[true,"el tipo es requerido"]

    },
    description:{
        type:String,
        required: [true, "El nombre es requerido"],
        minlength: [3, "La longitud minima es 3"],
        maxlength: [100, "La longitud maxima es 100"],
  
      },
    idCategories: [{
        type: Schema.Types.ObjectId,
        ref: "categories"
    }],
    idTransactions: [{
      type: Schema.Types.ObjectId,
      ref: "transactions"
  }],

  },
  {
    timestamps: true,
  }
);
//video en string es como se llamara nuestra coleccion
const SubCategories = model("subCategories", subCategoriesSchema);

module.exports = SubCategories