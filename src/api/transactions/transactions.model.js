const { Schema, model, models } = require("mongoose");

const transactionsSchema = new Schema(
  {
    description:{
      type:String,
      required: [true, "Name is required"],
      minlength: [15, "the minimum length is 15"],
      maxlength: [300, "the maximum length is 300"],

    },
    // date: {

    // },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        match:[/^([0-9])*$/,"only numbers are allowed"]
       
      },
    type: {
      type: String,
      enum: ['Entry', 'Spent'],
      required: [true, "Type is required"],

    },
    // subCategoryId: [{
    //     // type: Schema.Types.ObjectId,
    //     // ref: "User"
    // }]
  },
  {
    timestamps: true,
  }
);
//video en string es como se llamara nuestra coleccion
const Transactions = model("transactions", transactionsSchema);

module.exports = Transactions