export const saleModel = `
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL,
  price REAL NOT NULL CHECK(total_amount >= 0),
  stock INTEGER NOT NULL ,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
)`
