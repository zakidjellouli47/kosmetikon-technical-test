const rawMaterialRepository = require('../repositories/rawMaterialRepository');
const { CreateRawMaterialDTO, UpdateRawMaterialDTO } = require('../dtos/rawMaterialDTO');

class RawMaterialService {
  async getAllMaterials(filters, pagination) {
    return rawMaterialRepository.findAll(filters, pagination);
  }

  async getMaterialById(id) {
    const material = await rawMaterialRepository.findById(id);
    if (!material) {
      const error = new Error('Raw material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }

  async createMaterial(data) {
    const dto = new CreateRawMaterialDTO(data);
    const validationErrors = dto.validate();
    
    if (validationErrors.length > 0) {
      const error = new Error('Validation Error');
      error.name = 'ValidationError';
      error.errors = validationErrors;
      error.statusCode = 400;
      throw error;
    }

    const existingName = await rawMaterialRepository.findByName(dto.name);
    if (existingName) {
      const error = new Error('Name already exists');
      error.statusCode = 409;
      error.errors = [{ field: 'name', message: 'A material with this name already exists' }];
      throw error;
    }

    const existingCode = await rawMaterialRepository.findByCode(dto.code);
    if (existingCode) {
      const error = new Error('Code already exists');
      error.statusCode = 409;
      error.errors = [{ field: 'code', message: 'A material with this code already exists' }];
      throw error;
    }

    return rawMaterialRepository.create(dto.toDatabase());
  }

  async updateMaterial(id, data) {
    await this.getMaterialById(id);

    const dto = new UpdateRawMaterialDTO(data);
    const validationErrors = dto.validate();
    
    if (validationErrors.length > 0) {
      const error = new Error('Validation Error');
      error.name = 'ValidationError';
      error.errors = validationErrors;
      error.statusCode = 400;
      throw error;
    }

    if (dto.name) {
      const existingName = await rawMaterialRepository.checkNameExists(dto.name, id);
      if (existingName) {
        const error = new Error('Name already exists');
        error.statusCode = 409;
        error.errors = [{ field: 'name', message: 'A material with this name already exists' }];
        throw error;
      }
    }

    if (dto.code) {
      const existingCode = await rawMaterialRepository.checkCodeExists(dto.code, id);
      if (existingCode) {
        const error = new Error('Code already exists');
        error.statusCode = 409;
        error.errors = [{ field: 'code', message: 'A material with this code already exists' }];
        throw error;
      }
    }

    return rawMaterialRepository.update(id, dto.toDatabase());
  }

  async deleteMaterial(id) {
    await this.getMaterialById(id);
    return rawMaterialRepository.delete(id);
  }
}

module.exports = new RawMaterialService();