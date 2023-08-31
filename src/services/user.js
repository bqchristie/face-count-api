// import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import { User } from "../models/init.js";
import DatabaseError from "../models/error.js";

class UserService {

  static async list() {
    try {
      const users = await User.findMany();
      return users;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      const user = await User.findUnique({
        where: { id },
      });

      if (!user) return null;

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return User.update(
        {
          where: { id },
        },
        {
          data,
        }
      );
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      return User.delete({
        where: { id },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
 /*
  Everyone gets authenticated!  If the username does not exist simply create a new one.
  Should also set a role here which will be hard coded in the config.
  */
  static async authenticate(username) {
    let user;
    try {
      user = await User.findUnique({
        where: { username },
      });
      if (!user)  {
        user = await UserService.createUser({ username});
      }

      user.lastLoginAt = new Date();

      const token = jwt.sign({ id: user.id }, config.SECRET_KEY, { expiresIn: config.TOKEN_EXPIRATION });

      const updatedUser = await User.update({
        where: { id: user.id },
        data: { lastLoginAt: user.lastLoginAt, isActive: true, token },
      });
      return updatedUser;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithToken(token) {
    const isTokenValid = (token)=>{
      return jwt.verify(token, config.SECRET_KEY, (err) => {
        return !err;
      });
    }
    try {
      const user = await User.findUnique({
        where: { token },
      });

      if (!user || isTokenValid(token) !== true) {
        return null;
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createUser({...userData }) {

    try {
      const data = {
        ...userData,
      };

      const user = await User.create({ data });
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UserService;
