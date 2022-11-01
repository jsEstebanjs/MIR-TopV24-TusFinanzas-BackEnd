const { Schema, model, models } = require("mongoose");

const userSchema = new Schema(
  {
    name:{
      type:String,
      required: [true, "Name is required"],
      minlength: [3, "the minimum length is 3"],
      maxlength: [100, "the maximum length is 100"],

    },
    email: {
      type: String,
      minlength: [8, "the minimum length is 8"],
      maxlength: [300, "the maximum length is 300"],
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, "The email is not valid"],
      validate: {
        async validator(email) {
          try {
            const user = await models.user.findOne({ email });
            console.log(user)
            return !user;
          } catch (err) {
            return false;
          }
        },
        message: "the email already exists",
      },
    },
    picture: {
        type: String,
        default: 'https://thumbs.dreamstime.com/b/dise%C3%B1o-del-icono-placeholder-de-imagen-perfil-en-blanco-con-una-charla-la-burbuja-lugar-jefe-figura-los-usuarios-marcador-avatar-198816164.jpg'
      },
    password: {
      type: String,
      required: [true, "Password is required"],

    },
    transactionsId: [{
        type: Schema.Types.ObjectId,
        ref: "transactions"
    }]
  },
  {
    timestamps: true,
  }
);
//video en string es como se llamara nuestra coleccion
const User = model("user", userSchema);

module.exports = User