const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model");

module.exports = {
  async signup(req, res) {
    try {
      const { name, email, password, picture } = req.body;
      if (!/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/.test(password)) {
        throw new Error(
          "The password must be between 8 and 16 characters long, with at least one digit, at least one lowercase letter, and at least one uppercase letter. It can NOT have other symbols."
        );
      }
      const encPassword = await bcrypt.hash(password, 8);
      const user = await User.create({ name, email, password: encPassword , picture });
      const token = jwt.sign({ id: user._id }, "secretKey", {
        expiresIn: 60 * 60,
      });
      res.status(200).json({ message: "user created", data: { token, email } });
    } catch (err) {
        console.log(err)
      res.status(400).json({ message: "user not created", data: err.message });
    }
  },
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("invalid email or password");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("invalid email or password");
      }

      const token = jwt.sign({ id: user._id }, "secretKey", {
        expiresIn: 60 * 60 * 24,
      });

      res
        .status(201)
        .json({ message: "User logged in", data: { email, token } });
    } catch (err) {
      res
        .status(400)
        .json({ message: "error when logging", data: err.message });
    }
  },
  //get
  async show(req, res) {
    try {
      const user = await User.findById(req.user)

      if(!user){
        throw new Error("Token expired")
      }
      const {email, name, picture} = user
      res.status(200).json({  message: "user found", data:{ email, name , picture } })
    } catch (error) {
      res.status(400).json({ message: "user is not authenticated", data: error.message })
    }
  },
  //update
  async update(req, res) {
    try {
      const user = await User.findById(req.user);
      const newUser = req.body;
      if(!user){
        throw new Error("Token expired")
      }
      const updateUser = await User.findByIdAndUpdate(req.user, newUser, { new: true } )
    const { name, email, picture } = updateUser 
      res.status(200).json({  message: "updated user", data: { name, email, picture } })
    } catch (error) {
      res.status(400).json({ message: "user not updated", data: error })
    }
  },
  //delete
  async destroy(req, res) {
    try{

      const user = await User.findByIdAndDelete(req.user);
      //aqui se eliminaran las transaciones 
    const { name , email , createdAt , updatedAt } = user
    res.status(200).json({ message: "successfully deleted user", data: { name , email , createdAt , updatedAt } });

    }catch(err){

      res.status(400).json({ message: "could not delete user", data: err.message });

    }


  },
};
