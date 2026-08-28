const rawMaterialService = require('../services/rawMaterialService');

class RawMaterialController {
  async getAll(req, res, next) {
    try {
      const { page, limit, name, category, status } = req.query;
      const filters = { name, category, status };
      const pagination = { page: page || 1, limit: limit || 10 };
      const result = await rawMaterialService.getAllMaterials(filters, pagination);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: parseInt(pagination.limit),
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const material = await rawMaterialService.getMaterialById(id);
      res.status(200).json({ success: true, data: material });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const material = await rawMaterialService.createMaterial(req.body);
      res.status(201).json({
        success: true,
        message: 'Raw material created successfully',
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const material = await rawMaterialService.updateMaterial(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Raw material updated successfully',
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await rawMaterialService.deleteMaterial(id);
      res.status(200).json({
        success: true,
        message: 'Raw material deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RawMaterialController();