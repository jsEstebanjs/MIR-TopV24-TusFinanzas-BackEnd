const { Schema, model, models } = require("mongoose");

// const emailRegex = new RegExp("/\S+@\S+\.\S+/");
// const passwordRegex = new RegExp(
//   "/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ]){8,15}$/"
// );

const userSchema = new Schema(
  {
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
            return !user;
          } catch (err) {
            return false;
          }
        },
        message: "the email already exists",
      },
    },
    password: {
      type: String,

    },
  },
  {
    timestamps: true,
  }
);
//video en string es como se llamara nuestra coleccion
const User = model("user", userSchema);

module.exports = User