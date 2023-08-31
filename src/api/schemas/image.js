export default {
  type: "object",
  properties: {
    imageRef: { type: "string" },
    type: { type: "string" },
  },
  required: ["imageRef", "type"],
  additionalProperties: false,
};
