import {
  emailExists,
  insert,
  get,
  getCount,
  idExists,
  update,
  archive
} from "../queries/users";
import { passwordExists } from "../queries/login";
import statusCode from "../utils/httpStatusCode.json";
import JWT from "jsonwebtoken";
require("dotenv").config();
const RS256_PRIVATE_KEY = process.env.RS256_PRIVATE_KEY;
const TOKEN_EXPIRY_HOURS = process.env.JWT_TOKEN_EXPIRY_HOURS;
import { JwtAlgorithm } from "../data/consts";
import {
  createValidator,
  updateValidator
} from "../validators/users"
import loginValidator from "../validators/login"

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const validator = createValidator(data)
    if (validator.error) return res.status(statusCode.BAD_REQUEST).send({ success: false, errorMessage: validator.error })
    const emailCheckQuery = await emailExists(data.emailId);
    if (emailCheckQuery.length)
      return res
        .status(statusCode.CONFLICT)
        .send({ sucess: false, message: `Email already exists` });
    data.active = 1
    data.date = new Date(Date.now())
    const inserted = await insert(data);
    return res.send({
      sucess: true,
      message: inserted.insertedId
        ? `User created successfully!!`
        : `Sorry unable to create user!!`,
    });
  } catch (e) {
    console.log(e)
    return res.status(statusCode.CONFLICT).send({ sucess: false, message: e });
  }
};

const getUsers = async (req, res) => {
  try {
    let { orderBy, orderByValue, offset, limit } = req.query;
    orderBy = orderBy || "_id";
    orderByValue = orderByValue ? orderByValue.toLowerCase() : 1; //asc
    offset = Number(offset) * Number(limit) || 0;
    limit = Number(limit) || 10;

    const [getData, count] = await Promise.all([
      await get(orderBy, orderByValue, limit, offset),
      await getCount()
    ]);
    return res.send({
      success: true,
      totalCount: count,
      result: getData,
    });
  } catch (e) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send({ sucess: false, message: e });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body
    const validator = updateValidator(data)
    if (validator.error) return res.status(statusCode.BAD_REQUEST).send({ success: false, errorMessage: validator.error })

    const [idCheck, emailCheckQuery] = await Promise.all([
      await idExists(req.params.id),
      await emailExists(data.emailId)
    ]);

    console.log(idCheck, emailCheckQuery)
    if (
      (idCheck.length && !emailCheckQuery.length)
      || (!idCheck.length && emailCheckQuery.length)
      || (idCheck.length && emailCheckQuery.length && idCheck[0]._id.toString() != emailCheckQuery[0]._id.toString())
    )
      return res
        .status(statusCode.CONFLICT)
        .send({ sucess: false, message: `Email-id and userId conflicts` });
    else {
      data.active = 1
      data.date = new Date(Date.now())
      const updated = await update(data, req.params.id);
      console.log(updated.modifiedCount, updated.upsertedCount)
      if (!updated.modifiedCount && !updated.upsertedCount)
        return res.send({ success: false, message: `Error in updating user` });
      return res.send({ sucess: true, message: `User updated successfully` });
    }


  } catch (e) {
    console.log(e)
    return res
      .status(statusCode.BAD_REQUEST)
      .send({ sucess: false, message: e });
  }
};

const deleteUser = async (req, res) => {
  const idQuery = await idExists(req.params.id);
  if (!idQuery.length)
    return res
      .status(statusCode.NOT_FOUND)
      .send({ sucess: false, message: `Given user id does not exists` });
  const deleted = await archive(req.params.id);
  if (!deleted.modifiedCount)
    return res.send({ success: false, message: `Error in deleting user or user already deleted` });
  return res.send({ sucess: true, message: `User deleted successfully` });
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const validator = loginValidator({ emailId, password })
    if (validator.error) return res.status(statusCode.BAD_REQUEST).send({ success: false, errorMessage: validator.error })
    const emailCheckQuery = await emailExists(emailId);
    if (!emailCheckQuery.length)
      return res
        .status(statusCode.BAD_REQUEST)
        .send({ sucess: false, message: `Wrong credentials` });
    const passwordCheckQuery = await passwordExists(emailId, password);
    if (!passwordCheckQuery.length)
      return res
        .status(statusCode.BAD_REQUEST)
        .send({ sucess: false, message: `Wrong credentials` });
    const token = JWT.sign({ emailId, password }, RS256_PRIVATE_KEY, {
      algorithm: JwtAlgorithm,
      expiresIn: TOKEN_EXPIRY_HOURS,
    });
    return res.send({
      sucess: true,
      token,
      userId: emailCheckQuery[0]._id,
      emailId,
    });
  } catch (e) {
    console.log(e)
    return res.status(statusCode.CONFLICT).send({ sucess: false, message: e });
  }
};

export { createUser, getUsers, updateUser, deleteUser, login };
