const { db } = require('./db');

// Records one stock change. Call inside the same transaction as the quantity update.
async function logMovement({ productId, productName, sku, color, size, change, quantityAfter, type, reason = '', note = '', actor }) {
  await db.run(
    `INSERT INTO stock_movements (product_id, product_name, sku, color, size, change, quantity_after, type, reason, note, admin_id, admin_name)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    productId, productName, sku, color, size, change, quantityAfter, type, reason, note,
    actor?.id ?? null, actor?.name || 'System');
}

module.exports = { logMovement };
