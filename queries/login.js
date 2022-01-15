import dbo from '../services/mongodb';
import { ObjectId } from 'mongodb';
const collection = "concert_login"

const passwordExists = async (email, password) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ emailId: email, password, active: 1 }, { emailId: 1 }).limit(1)
    .toArray();
};

const idAndEmailExists = async (email, id) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ emailId: email, _id: ObjectId(id) }, { _id: 1, emailId: 1 }).limit(1)
    .toArray()
};

export { passwordExists, idAndEmailExists };
