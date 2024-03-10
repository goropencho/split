import { User } from "../models/user";

export default class UsersRepository {
  getOneById(id: string) {
    return User.findById(id);
  }

  getAll() {
    return User.find({});
  }

  getAllByPredicate(obj: {}) {
    return User.find(obj);
  }

  getOneByEmail(email: string) {
    return User.findOne({ email });
  }
}
