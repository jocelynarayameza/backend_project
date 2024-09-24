import UserDao from '../daos/mongodb/userDao.js';
import UserDTO from '../dto/userDTO.js';
const userDao = new UserDao();
import { logger } from '../config/customLogger.js';

export default class UserRepository {
    constructor(){
        this.dao = userDao;
    }

    async getUserById(id) {
        try {
          const user = await this.dao.getById(id);
          return new UserDTO(user);
        } catch (error) {
          logger.error(error);
        }
    };

    async getUsers() {
      const users = await this.dao.getUsers();
      return users;
  }
}