const Subcategories = require("./subcategories.model");
const Categories = require('../categories/categories.model');


module.exports = {
  async listById(req, res) {
    try {
      const subcategories = await Subcategories.find();
      res
        .status(200)
        .json({ message: "Subcategorias encontradas", data: subcategories });
    } catch (err) {
      res.status(404).json({ message: "Subcategorias no encontradas", data: err });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await Subcategories.findById(id);

      res.status(200).json({ message: "Subcategoria encontrada", data: subCategory });
    } catch (err) {
      res.status(400).json({ message: "Subcategoria no encontrada", data: err });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const category = await Categories.findById(data.categoryId);

      if (!category) {
        throw new Error("La categoria no existe");
      }

      const subCategory = await Subcategories.create({ ...data, categoryId: data.categoryId });

      category.subcategoriesIds.push(subCategory._id);
      await category.save({ validateBeforeSave: false });

      res
        .status(200)
        .json({ message: "Subcategoria creada", data: subCategory });
    } catch (err) {
      res
        .status(400)
        .json({ message: "No se ha podido crear la Subcategoria", error: err });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const subCategory = await Subcategories.findById(id);
      const infoUpdateSubCategory = req.body;

      if (!subCategory) {
        throw new Error("Subcategoria no encontrada");
      }
      const updateSubCategory = await Categories.findByIdAndUpdate(
        id,
        infoUpdateSubCategory,
        { new: true }
      );

      res.status(200).json({
        message: "Subcategoria actualizada correctamente",
        data: updateSubCategory,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Subcategoria no actualizada", data: error });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await Subcategories.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Subcategoria eliminada exitosamente", data: subCategory});
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error al eliminar la subCategoria", data: err });
    }
  },
};
