import UsersRepository from "../repository/users.repository";
import { Request, Response } from "express";
import UserService from "./users.service";
export default class AuthService {
  private usersRepository: UsersRepository;
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
    this.usersRepository = new UsersRepository();
  }
  async signIn(req: Request, res: Response) {
    const user = await this.userService.registerUser({});
  }
}
