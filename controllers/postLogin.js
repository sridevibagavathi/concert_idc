import { emailExists } from "../queries/users";
import statusCode from "../utils/httpStatusCode.json";
import logoutValidator from "../validators/logout"

const logout = async (req, res) => {
  try {
    const { emailId } = req.body;
    const validator = logoutValidator({ emailId })
    if (validator.error) return res.status(statusCode.BAD_REQUEST).send({ success: false, errorMessage: validator.error })
    const emailCheckQuery = await emailExists(emailId);
    if (!emailCheckQuery.length)
      return res
        .status(statusCode.CONFLICT)
        .send({ sucess: false, message: `Email not exists` });
    return res.send({ sucess: true, message: `User logged out successfully` });
  } catch (e) {
    return res.status(statusCode.CONFLICT).send({ sucess: false, message: e });
  }
};

export { logout };
