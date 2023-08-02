const express = require('express');
const ProductManager = require('./ProductManager.js');

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.get('/products', (req, res) => {
  const { limit } = req.query;
  const productos = productManager.getProducts();

  if (limit && !isNaN(limit)) {
    const productosLimitados = productos.slice(0, parseInt(limit));
    res.json(productosLimitados);
  } else {
    res.json(productos);
  }
});

app.get('/products/:pid', (req, res) => {
  const { pid } = req.params;
  const producto = productManager.getProductById(parseInt(pid));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(producto);
});

app.listen(port, () => {
  console.log(`El servidor está en funcionamiento en http://localhost:${port}`);
});
