import { createUser, login, getUsers, updateUser, deleteUser } from "./user";
import { logout } from "./postLogin";

export default {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
  logout,
};
