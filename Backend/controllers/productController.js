
import db from '../database/db.js';

// Add a new product
export function addProduct(product) {
  const {
    sku, name, description = '', price, cost_price, stock = 0, unit = 'Cartoon', category_id = null,
  } = product;

  const stmt = db.prepare(`
    INSERT INTO products (sku, name, description, price, cost_price, stock, unit, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(sku, name, description, price, cost_price, stock, unit, category_id);
  return info;
}

// Remove a product by ID
export function deleteProduct(id) {
  const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);
  const info = stmt.run(id);
  return info;
}

// Optionally: Get all products
export function getAllProducts() {
  const stmt = db.prepare(`SELECT * FROM products`);
  return stmt.all();
}
