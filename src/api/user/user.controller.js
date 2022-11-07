const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const defaultValues = require("../../utils/defaultValues.json");
const Categories = require("../categories/categories.model");
const Subcategories = require("../subcategories/subcategories.model");
const { transporter, welcome } = require('../../utils/mailer');

module.exports = {
  async signup(req, res) {
    try {
      const { name, email, password, picture } = req.body;

      if (!/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/.test(password)) {
        throw new Error(
          "La contraseña debe tener entre 8 y 16 caracteres, con al menos un dígito, al menos una letra minúscula y al menos una letra mayúscula. NO puede tener otros símbolos."
        );
      }
      const encPassword = await bcrypt.hash(password, 8);
      const user = await User.create({
        name,
        email,
        password: encPassword,
        picture,
      });
      await transporter.sendMail(welcome(user))
      for (const category of defaultValues.categories) {
        const newUser = await User.findById(user._id);
        const {_id: categoryId} = await Categories.create({ 
          name: category.name,
          type: category.type,
          favicon: category.favicon,
          userId: newUser.id,
        });

        for (const subcategory of category.subcategories) {
          const newCategory = await Categories.findById(categoryId)
          const newSubcategory = await Subcategories.create({
            name: subcategory.name,
            favicon: subcategory.favicon,
            type: subcategory.type,
            categoryId: newCategory._id
          });

          newCategory.subcategoriesIds.push(newSubcategory._id);
          await newCategory.save({ validateBeforeSave: false });
        };

        newUser.categoriesIds.push(categoryId);
        await newUser.save({ validateBeforeSave: false });
      }
      
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60,
      });
      res.status(200).json({ message: "El Usuario se ha Creado exitosamente", data: { token, email } });
    } catch (err) {
      res.status(400).json({ message: "No se ha podido crear el usuario", data: err.message });
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("contraseña o email invalidos");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("contraseña o email invalidos");
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });

      res
        .status(201)
        .json({ message: "Usuario logueado exitosamente", data: { email, token } });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error al loguear al usuario", data: err.message });
    }
  },

  //get por token / id
  async show(req, res) {
    try {
      const user = await User.findById(req.user).populate("transactionsId", "");

      if (!user) {
        throw new Error("Token expirado");
      }
      const { email, name, picture } = user;
      res
        .status(200)
        .json({ message: "Usuario encontrado", data: { email, name, picture } });
    } catch (error) {
      res
        .status(400)
        .json({ message: "El usuario no existe", data: error.message });
    }
  },

  //update
  async update(req, res) {
    try {
      const user = await User.findById(req.user);
      const newUser = req.body;
      if (!user) {
        throw new Error("Token expirado");
      }
      const updateUser = await User.findByIdAndUpdate(req.user, newUser, {
        new: true,
      });
      const { name, email, picture } = updateUser;
      res
        .status(200)
        .json({ message: "Usuario actualizado correctamente", data: { name, email, picture } });
    } catch (error) {
      res.status(400).json({ message: "No se ha podido actualizar el usuario", data: error });
    }
  },

  //delete
  async destroy(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user);
      //aqui se eliminaran las transaciones
      const { name, email, createdAt, updatedAt } = user;
      res
        .status(200)
        .json({
          message: "Usuario eliminado correctamente",
          data: { name, email, createdAt, updatedAt },
        });
    } catch (err) {
      res
        .status(400)
        .json({ message: "No se pudo eliminar el usuario", data: err.message });
    }
  },
};
