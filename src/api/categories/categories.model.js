const { Schema, model, models } = require("mongoose");

const categoriesSchema = new Schema(
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
    idSubCategories: [{
        type: Schema.Types.ObjectId,
        ref: ".."
    }],
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
  },
  {
    timestamps: true,
  }
);
//video en string es como se llamara nuestra coleccion
const Categories = model("categories", categoriesSchema);

module.exports = Categories