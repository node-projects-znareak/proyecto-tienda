class ProductService {
  constructor() {
    this.ProductModel = require("../models/Product");
    this.optionsUpdate = { new: true };
  }

  async getAllProducts() {
    const data = await this.ProductModel.find({}).lean();
    console.log(data);
    return data;
  }

  async getProductById(id) {
    return await this.ProductModel.findById(id);
  }

  async createProduct(product) {
    return await this.ProductModel.create(product);
  }

  async updateProduct(id, product) {
    return await this.ProductModel.findByIdAndUpdate(
      id,
      product,
      this.optionsUpdate
    );
  }

  async deleteProduct(id) {
    return await this.ProductModel.findByIdAndDelete(id);
  }

  async insertManyProducts(products) {
    return await this.ProductModel.insertMany(products);
  }
}

module.exports = new ProductService();
