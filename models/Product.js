const { Schema, model } = require("mongoose");
const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxLength: 100,
    trim: true,
    default: "Producto sin nombre",
  },
  price: {
    type: Number,
    default: 0,
    required: [true, "El precio es obligatorio"],
  },

  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    default: "viveres",
  },
  image: {
    type: String,
  },
  sotck: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Product", ProductSchema);
