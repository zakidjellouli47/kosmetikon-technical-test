const express = require('express');
const router = express.Router();
const rawMaterialController = require('../controllers/rawMaterialController');

/**
 * @swagger
 * /api/raw-materials:
 *   get:
 *     summary: Get all raw materials
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', rawMaterialController.getAll);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   get:
 *     summary: Get raw material by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get('/:id', rawMaterialController.getById);

/**
 * @swagger
 * /api/raw-materials:
 *   post:
 *     summary: Create raw material
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, category, unitOfMeasure, quantity, status]
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               category: { type: string }
 *               unitOfMeasure: { type: string }
 *               quantity: { type: number }
 *               status: { type: string, enum: [active, inactive] }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate
 */
router.post('/', rawMaterialController.create);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   put:
 *     summary: Update raw material
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               category: { type: string }
 *               unitOfMeasure: { type: string }
 *               quantity: { type: number }
 *               status: { type: string, enum: [active, inactive] }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', rawMaterialController.update);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   delete:
 *     summary: Delete raw material
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', rawMaterialController.delete);

module.exports = router;