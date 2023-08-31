export default {
  type: "object",
  properties: {
    name: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    userId: { type: "integer" },
    faceCount: { type: "integer" },
  },
  required: ["name", "createdAt", "userId"],
  additionalProperties: false,
};
