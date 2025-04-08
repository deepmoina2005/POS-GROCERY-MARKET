
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const db = new Database('pos.db');

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Create tables with proper relationships and constraints
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'cashier', 'manager')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  cost_price REAL NOT NULL CHECK(cost_price >= 0),
  stock INTEGER NOT NULL CHECK(stock >= 0) DEFAULT 0,
  category_id INTEGER,
  barcode TEXT UNIQUE,
  reorder_level INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  total_amount REAL NOT NULL CHECK(total_amount >= 0),
  tax_amount REAL NOT NULL CHECK(tax_amount >= 0),
  payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'mobile')) NOT NULL,
  payment_details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price REAL NOT NULL CHECK(unit_price >= 0),
  total_price REAL NOT NULL CHECK(total_price >= 0),
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)`).run();

// Indexes for performance optimization
db.prepare('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id)').run();

// Create admin user with hashed password
const createAdminUser = () => {
  const saltRounds = 10;
  const password = 'securepassword123';
  const passwordHash = bcrypt.hashSync(password, saltRounds);
  
  try {
    db.prepare(`
      INSERT INTO users (uuid, username, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      'admin',
      'admin@pos.com',
      passwordHash,
      'admin'
    );
    console.log('Admin user created');
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log('Admin user already exists');
    }
  }
};

// Create sample data
const createSampleData = () => {
  // Insert sample category
  const category = db.prepare(`
    INSERT INTO categories (name, description)
    VALUES (?, ?)
  `).run('Electronics', 'Electronic devices and accessories');

  // Insert sample product
  const product = db.prepare(`
    INSERT INTO products (sku, name, description, price, cost_price, stock, category_id, barcode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'SKU-123456',
    'Smartphone X',
    'Latest model smartphone',
    599.99,
    450.00,
    100,
    category.lastInsertRowid,
    '123456789012'
  );

  console.log('Sample data created');
};

// Initialize database
db.transaction(() => {
  createAdminUser();
  createSampleData();
})();

// Example query: Get sales report
const getSalesReport = (startDate, endDate) => {
  return db.prepare(`
    SELECT 
      s.transaction_id,
      strftime('%Y-%m-%d %H:%M', s.created_at) AS sale_date,
      u.username AS cashier,
      SUM(si.quantity) AS total_items,
      s.total_amount,
      s.tax_amount,
      s.payment_method
    FROM sales s
    JOIN users u ON s.user_id = u.id
    JOIN sale_items si ON s.id = si.sale_id
    WHERE s.created_at BETWEEN ? AND ?
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `).all(startDate, endDate);
};

// Example usage
const salesData = getSalesReport('2024-01-01', '2024-12-31');
console.log(salesData);

export default db;
