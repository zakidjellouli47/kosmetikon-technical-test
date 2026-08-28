class CreateRawMaterialDTO {
    constructor(data) {
      this.name = data.name?.trim();
      this.code = data.code?.trim();
      this.category = data.category?.trim();
      this.unitOfMeasure = data.unitOfMeasure?.trim();
      this.quantity = data.quantity !== undefined ? parseFloat(data.quantity) : undefined;
      this.status = data.status?.trim();
      this.description = data.description?.trim();
    }
  
    validate() {
      const errors = [];
      if (!this.name) errors.push({ field: 'name', message: 'Name is required' });
      if (!this.code) errors.push({ field: 'code', message: 'Code is required' });
      if (!this.category) errors.push({ field: 'category', message: 'Category is required' });
      if (!this.unitOfMeasure) errors.push({ field: 'unitOfMeasure', message: 'Unit of measure is required' });
      if (this.quantity === undefined || this.quantity === null) {
        errors.push({ field: 'quantity', message: 'Quantity is required' });
      }
      if (!this.status) errors.push({ field: 'status', message: 'Status is required' });
      if (this.name && this.name.length > 150) {
        errors.push({ field: 'name', message: 'Name cannot exceed 150 characters' });
      }
      if (this.code && this.code.length > 50) {
        errors.push({ field: 'code', message: 'Code cannot exceed 50 characters' });
      }
      if (this.quantity !== undefined && this.quantity < 0) {
        errors.push({ field: 'quantity', message: 'Quantity cannot be negative' });
      }
      if (this.status && !['active', 'inactive'].includes(this.status)) {
        errors.push({ field: 'status', message: 'Status must be "active" or "inactive"' });
      }
      return errors;
    }
  
    toDatabase() {
      return {
        name: this.name,
        code: this.code,
        category: this.category,
        unitOfMeasure: this.unitOfMeasure,
        quantity: this.quantity,
        status: this.status,
        description: this.description || null
      };
    }
  }
  
  class UpdateRawMaterialDTO {
    constructor(data) {
      this.name = data.name?.trim();
      this.code = data.code?.trim();
      this.category = data.category?.trim();
      this.unitOfMeasure = data.unitOfMeasure?.trim();
      this.quantity = data.quantity !== undefined ? parseFloat(data.quantity) : undefined;
      this.status = data.status?.trim();
      this.description = data.description?.trim();
    }
  
    validate() {
      const errors = [];
      const hasFields = this.name || this.code || this.category || this.unitOfMeasure || 
                       this.quantity !== undefined || this.status || this.description;
      if (!hasFields) {
        errors.push({ field: 'general', message: 'At least one field must be provided' });
      }
      if (this.name && this.name.length > 150) {
        errors.push({ field: 'name', message: 'Name cannot exceed 150 characters' });
      }
      if (this.code && this.code.length > 50) {
        errors.push({ field: 'code', message: 'Code cannot exceed 50 characters' });
      }
      if (this.quantity !== undefined && this.quantity < 0) {
        errors.push({ field: 'quantity', message: 'Quantity cannot be negative' });
      }
      if (this.status && !['active', 'inactive'].includes(this.status)) {
        errors.push({ field: 'status', message: 'Status must be "active" or "inactive"' });
      }
      return errors;
    }
  
    toDatabase() {
      const data = {};
      if (this.name !== undefined) data.name = this.name;
      if (this.code !== undefined) data.code = this.code;
      if (this.category !== undefined) data.category = this.category;
      if (this.unitOfMeasure !== undefined) data.unitOfMeasure = this.unitOfMeasure;
      if (this.quantity !== undefined) data.quantity = this.quantity;
      if (this.status !== undefined) data.status = this.status;
      if (this.description !== undefined) data.description = this.description || null;
      return data;
    }
  }
  
  module.exports = { CreateRawMaterialDTO, UpdateRawMaterialDTO };