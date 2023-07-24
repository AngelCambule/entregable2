const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
  }

  addProduct(productData) {
    if (!this.isCodeUnique(productData.code)) {
      console.log("Error: Product code already exists.");
      return;
    }

    if (!this.areAllFieldsPresent(productData)) {
      console.log("Error: All fields are mandatory.");
      return;
    }

    const product = {
      id: this.nextId,
      ...productData,
    };

    this.products.push(product);
    this.nextId++;

    this.saveProductsToFile();
  }

  getProducts() {
    this.loadProductsFromFile();
    return this.products;
  }

  getProductById(id) {
    this.loadProductsFromFile();
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("Not Found");
    }
  }

  updateProduct(id, updatedProduct) {
    this.loadProductsFromFile();
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const product = this.products[index];
      this.products[index] = { ...product, ...updatedProduct };
      this.saveProductsToFile();
    } else {
      console.log("Product not found.");
    }
  }

  deleteProduct(id) {
    this.loadProductsFromFile();
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProductsToFile();
  }

  isCodeUnique(code) {
    return !this.products.some((product) => product.code === code);
  }

  areAllFieldsPresent(productData) {
    return (
      productData.title &&
      productData.description &&
      productData.price &&
      productData.thumbnail &&
      productData.code &&
      productData.stock
    );
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.nextId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    } catch (error) {
      // File not found or invalid JSON, continue with an empty array.
      this.products = [];
    }
  }

  saveProductsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
    } catch (error) {
      console.error("Error saving products to file:", error);
    }
  }
}

const manager = new ProductManager('products.json');

console.log(manager.getProducts());

manager.addProduct({
    title: "Producto 1",
    description: "Descripcion 1",
    price: 26,
    thumbnail: "thumbnail1.png",
    code: "54645",
    stock: 5,
  });

  manager.addProduct({
    title: "Producto 2",
    description: "Descripcion 2",
    price: 26,
    thumbnail: "thumbnail2.png",
    code: "546455",
    stock: 5,
  });
console.log(manager.getProductById(1));
manager.updateProduct(1, { price: 15 });
console.log(manager.getProductById(2));
manager.deleteProduct(2);
console.log(manager.getProducts());
