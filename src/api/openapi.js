import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import requestSchema from "./schemas/request.js";
import imageSchema from "./schemas/image.js";

export const definition = {
  openapi: "3.0.0",
  info: {
    title: "Hatch-TODO",
    version: "0.0.1",
    description: "Skills Evaluation",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      Request: requestSchema,
      Image: imageSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;
