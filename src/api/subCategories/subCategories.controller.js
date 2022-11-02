const SubCategories = require("./subCategories.model");
const Categories = require('../categories/categories.model');


module.exports = {
  async listById(req, res) {
    try {
      const subCategories = await SubCategories.find();
      res
        .status(200)
        .json({ message: "SubCategorias encontradas", data: subCategories });
    } catch (err) {
      res.status(404).json({ message: "SubCategorias no encontradas", data: err });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await SubCategories.findById(id);

      res.status(200).json({ message: "SubCategoria encontrada", data: subCategory });
    } catch (err) {
      res.status(400).json({ message: "SubCategoria no encontrada", data: err });
    }
  },

  async create(req, res) {
    try {
      const {id} = req.params
      const category = await Categories.findById(id);
      const data = req.body;

      if (!category) {
        throw new Error("La categoria no existente");
      }

      const subCategory = await SubCategories.create({ ...data, idCategories: id });

      category.idSubCategories.push(subCategory);
      await category.save({ validateBeforeSave: false });

      res
        .status(200)
        .json({ message: "SubCategoria creada", data: subCategory });
    } catch (err) {
      res
        .status(400)
        .json({ message: "No se ha podido crear la Subcategoria", error: err });
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const subCategory = await SubCategories.findById(id);
      const infoUpdateSubCategory = req.body;

      if (!subCategory) {
        throw new Error("SubCategoria no encontrada");
      }
      const updateSubCategory = await Categories.findByIdAndUpdate(
        id,
        infoUpdateSubCategory,
        { new: true }
      );

      res.status(200).json({
        message: "SubCategoria actualizada correctamente",
        data: updateSubCategory,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "SubCategoria no actualizada", data: error });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await SubCategories.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "SubCategoria eliminada exitosamente", data: subCategory});
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error al eliminar la subCategoria", data: err });
    }
  },
};
