import {
  emailExists,
  insert,
  get,
  getCount,
  idExists,
  update,
  archive
} from "../queries/users";
import statusCode from "../utils/httpStatusCode.json";
import {
  createValidator,
  updateValidator
} from "../validators/users"

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

    const emailCheckQuery = await emailExists(data.emailId)
    if (req.params.id) {
      const idCheck = await idExists(req.params.id)
      console.log(idCheck, emailCheckQuery)
      if (
        (idCheck.length && !emailCheckQuery.length)
        || (!idCheck.length && emailCheckQuery.length)
        || (idCheck.length && emailCheckQuery.length && idCheck[0]._id.toString() != emailCheckQuery[0]._id.toString())
      )
        return res
          .status(statusCode.CONFLICT)
          .send({ sucess: false, message: `Email-id and userId conflicts` });

    } else {
      if (emailCheckQuery.length)
        return res
          .status(statusCode.CONFLICT)
          .send({ sucess: false, message: `Email-id exists already` });
    }
    data.active = 1
    data.date = new Date(Date.now())
    const updated = await update(data, req.params.id);
    console.log(updated.modifiedCount, updated.upsertedCount)
    if (!updated.modifiedCount && !updated.upsertedCount)
      return res.send({ success: false, message: `Error in updating user` });
    return res.send({ sucess: true, message: `User updated successfully` });
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

export { createUser, getUsers, updateUser, deleteUser };
