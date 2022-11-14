const { Schema, model, models } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "La longitud minima del nombre es 3"],
      maxlength: [100, "La longitud maxima del nombre es 100"],

    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      match: [/\S+@\S+\.\S+/, "El email no es valido"],
      validate: {
        async validator(email) {
          try {
            const user = await models.user.findOne({ email });
            return !user;
          } catch (err) {
            return false;
          }
        },
        message: "El email ya existe",
      },
    },
    picture: {
      type: String,
      default: `${process.env.IMG_PLACEHOLDER}`
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
    },
    transactionsIds: [{
      type: Schema.Types.ObjectId,
      ref: "transactions"
    }],
    categoriesIds: [{
      type: Schema.Types.ObjectId,
      ref: "categories"
    }]
  },
  {
    timestamps: true,
  }
);

const User = model("user", userSchema);

module.exports = User