import { Image } from "../models/init.js";
import DatabaseError from "../models/error.js";

class ImageService {
  static async list() {
    try {
      return Image.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id, filters) {
    const where = { id, ...filters };
    console.log("where", where);
    try {
      return await Image.findFirst({ where });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Image.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Image.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Image.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default ImageService;
