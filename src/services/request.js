import { Request } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { io } from "../../server.js";
import ImageService from "./image.js";
import { promises as fs } from "fs";
import { ImageAnnotatorClient } from "@google-cloud/vision";
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
    let newRequest = { ...data, Status: "PENDING" };
    try {
      newRequest = await Request.create({ data: newRequest });
      io.emit("request-created", newRequest);
      return newRequest;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async processImage(request, image) {
    console.log("FUCKCKCCKCKCKCKCKCKCKCKCK");
    // Set request status to pending
    function fakeAsyncCall(ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Fake async call completed after 3 seconds");
        }, ms); // 3000 milliseconds = 3 seconds
      });
    }

    await fakeAsyncCall(3000);
    request.Status = "processing";
    request = await RequestService.update(request.id, request);

    // Get Image from DB
    // const image = await ImageService.get(request.id, { type: "ORIGINAL" });
    console.log(image);
    // Load Image from disk
    const fileName = `./uploads/${image.imageRef}`;
    console.log(fileName);

    const imageContent = await fs.readFile(fileName);

    // Hand off to google vision
    const visionClient = new ImageAnnotatorClient();
    const [result] = await visionClient.annotateImage({
      image: { content: imageContent },
      features: [{ type: "FACE_DETECTION" }],
    });
    //
    const faceAnnotations = result.faceAnnotations;
    // console.log(faceAnnotations);
    const numberOfPeople = faceAnnotations ? faceAnnotations.length : 0;
    console.log("Number of people:" + numberOfPeople);
    request.faceCount = numberOfPeople;
    // Set request status to complete
    request.Status = "complete";
    request = await RequestService.update(request.id, request);
  }

  static async update(id, data) {
    data.updatedAt = new Date();
    try {
      data = await Request.update({
        where: { id },
        data,
      });
      io.emit("request-updated", data);
      return data;
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
