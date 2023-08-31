import { Router } from "express";
import multer from "multer";
import RequestService from "../../services/request.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/request.js";
import * as path from "path";
import * as fs from "fs";
import ImageService from "../../services/image.js";

const router = Router();
const upload= multer({ dest: "uploads/" });

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Request
 *   description: API for managing Request objects
 *
 * /request:
 *   get:
 *     tags: [Request]
 *     summary: Get all the Request objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Request objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await RequestService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /request:
 *   post:
 *     tags: [Request]
 *     summary: Create a new Request
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: The created Request object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 */
router.post("", upload.single("image"), async (req, res, next) => {
  try {

    const request = {};
    request.userId = req.user.id;
    request.name = req.body.name;
    request.createdAt = new Date();
    const obj = await RequestService.create(request);

    const image = {
      type: 'ORIGINAL',
      requestId: obj.id,
      imageRef: req.file.filename,
    };

    await ImageService.create(image);

    res.status(201).json(obj);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /request/{id}:
 *   get:
 *     tags: [Request]
 *     summary: Get a Request by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await RequestService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /request/{id}:
 *   put:
 *     tags: [Request]
 *     summary: Update Request with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: The updated Request object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await RequestService.update(req.params.id, req.validatedBody);
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      if (error.isClientError()) {
        res.status(400).json({ error });
      } else {
        next(error);
      }
    }
  }
);

/** @swagger
 *
 * /request/{id}:
 *   delete:
 *     tags: [Request]
 *     summary: Delete Request with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await RequestService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

export default router;
