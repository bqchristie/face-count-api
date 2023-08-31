/* Authentification */

export const loginSchema = {
  type: "object",
  properties: {
    username: { type: "string"},
  },
  required: ["username"],
};


export const userSchema = {
  type: "object",
  properties: {
    username: { type: "string"},
    name: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    lastLoginAt: { type: "string", format: "date-time" },
    isActive: { type: "boolean" },
  },
};
