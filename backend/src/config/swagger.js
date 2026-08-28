const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KosmetikOn Raw Materials API',
      version: '1.0.0',
      description: 'API for managing raw materials',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        RawMaterial: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            category: { type: 'string' },
            unit_of_measure: { type: 'string' },
            quantity: { type: 'number' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            description: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);