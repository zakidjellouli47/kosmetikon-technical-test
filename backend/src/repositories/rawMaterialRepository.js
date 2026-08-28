const pool = require('../config/database');

class RawMaterialRepository {
  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, name, category, status } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM raw_material WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }
    if (category) {
      query += ` AND category ILIKE $${paramCount}`;
      params.push(`%${category}%`);
      paramCount++;
    }
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    const countQuery = query;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(`SELECT COUNT(*) FROM (${countQuery}) as count`, params.slice(0, -2))
    ]);

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM raw_material WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByName(name) {
    const result = await pool.query('SELECT * FROM raw_material WHERE LOWER(name) = LOWER($1)', [name]);
    return result.rows[0];
  }

  async findByCode(code) {
    const result = await pool.query('SELECT * FROM raw_material WHERE code = $1', [code]);
    return result.rows[0];
  }

  async checkNameExists(name, excludeId = null) {
    let query = 'SELECT * FROM raw_material WHERE LOWER(name) = LOWER($1)';
    const params = [name];
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  async checkCodeExists(code, excludeId = null) {
    let query = 'SELECT * FROM raw_material WHERE code = $1';
    const params = [code];
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  async create(data) {
    const { name, code, category, unitOfMeasure, quantity, status, description } = data;
    const result = await pool.query(
      `INSERT INTO raw_material (name, code, category, unit_of_measure, quantity, status, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, code, category, unitOfMeasure, quantity, status, description || null]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) { fields.push(`name = $${paramCount}`); values.push(data.name); paramCount++; }
    if (data.code !== undefined) { fields.push(`code = $${paramCount}`); values.push(data.code); paramCount++; }
    if (data.category !== undefined) { fields.push(`category = $${paramCount}`); values.push(data.category); paramCount++; }
    if (data.unitOfMeasure !== undefined) { fields.push(`unit_of_measure = $${paramCount}`); values.push(data.unitOfMeasure); paramCount++; }
    if (data.quantity !== undefined) { fields.push(`quantity = $${paramCount}`); values.push(data.quantity); paramCount++; }
    if (data.status !== undefined) { fields.push(`status = $${paramCount}`); values.push(data.status); paramCount++; }
    if (data.description !== undefined) { fields.push(`description = $${paramCount}`); values.push(data.description); paramCount++; }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE raw_material SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM raw_material WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new RawMaterialRepository();