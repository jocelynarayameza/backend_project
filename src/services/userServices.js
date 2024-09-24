import { UserModel } from "../daos/mongodb/models/userModel.js";
import UserDao from "../daos/mongodb/userDao.js";
import { createHash, isValidPassword } from "../utils.js";
import UserRepository from "../repository/userRepository.js";
import CartDaoManager from "../daos/mongodb/cartDao.js";
import { logger } from "../config/customLogger.js";
import jwt from 'jsonwebtoken';
import UserDTO from "../dto/userDTO.js";

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};


const userRepository = new UserRepository
const cartDaoManager = new CartDaoManager

const userDao = new UserDao(UserModel);

export const getById = async (id) => {
  try {
    return await userRepository.getUserById(id);
  } catch (error) {
    logger.error(error);
  }
}

export const getByEmail = async (email) => {

  try {
    return await userDao.login(email);
  } catch (error) {
    logger.error(error);
  }
}

export const getUsers = async() => {
  try {
    const users = await userDao.getUsers(); // Recupera el array de usuarios
    return users.map(user => new UserDTO(user)); // Aplica el DTO a cada usuario
  } catch (error) {
    logger.error(error);
  }
}

export const login = async (user) => {
  try {
    const { email, password } = user;
    const userExists = await getByEmail(email);
    if (!userExists) return null;
    const validPass = isValidPassword(password, userExists)
    if (!validPass) return null;
    return userExists;
  } catch (error) {
    logger.error(error);
  }
};

export const register = async (user) => {
  try {
    const { email, password } = user;
    const existUser = await userDao.login(email);
    if (!existUser) {
      const cartUser = await cartDaoManager.createCart();

      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        const userAdmin = await userDao.register({
          ...user,
          password: createHash(password),
          role: "admin",
          carts: cartUser._id,
        });
        return userAdmin;
      } else {
        const newUser = await userDao.register({
          ...user, password: createHash(password), carts: cartUser._id,
        });
        return newUser
      }
    } else return null;
  }
  catch (error) {
    logger.error(error);
  }
}


export const generateResetPass = async (user) => {
  try {
    return generateToken(user, '1h'); 
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePass = async (pass, user) => {
  try {
    const isEqual = isValidPassword(pass, user);
    if (isEqual) return null;
    const newPass = createHash(pass);
    return await userDao.update(user._id, { password: newPass });
  } catch (error) {
    throw new Error(error);
  }
};

export const update = async (id, obj) => {
  try {
    return await userDao.update(id, obj);
  } catch (error) {
    logger.error(error);
  }
};


export const deleteUsers = async (filter) => {
  try {
    const result = await userDao.deleteUsers(filter);
    return result;
  } catch (error) {
    logger.error(error);
  }
 
}