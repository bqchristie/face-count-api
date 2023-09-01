import { Request } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { io } from "../../server.js";
class RequestService {
  static async list() {
    try {
      return Request.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Request.findUnique({
        where: { id },
        include: {
          images: { select: { id: true, type: true, imageRef: true } },
        },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Request.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    } finally {
      io.emit("create-request", data);
    }
  }

  static async update(id, data) {
    try {
      return await Request.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Request.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default RequestService;
