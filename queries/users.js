import { ObjectId } from 'mongodb';
import dbo from '../services/mongodb';
const collection = 'concert_login'

const insert = async (data) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .insertOne(data);
};

const emailExists = async (email) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ emailId: email, active: 1 }, { email_id: 1 }).limit(1)
    .toArray()
};

const get = async (orderBy, orderByValue, limit, offset) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ active: 1 }, {})
    .skip(offset)
    .limit(limit)
    .sort({ [orderBy]: orderByValue })
    .toArray()
};

const getCount = async () => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ active: 1 }, {})
    .count()
};

const idExists = async (id) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .find({ _id: ObjectId(id) }, { _id: 1 }).limit(1)
    .toArray()
};

const update = async (data, id) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .updateOne(
      { emailId: data.emailId, _id: ObjectId(id) }, // Filter
      { $set: data }, // Update user
      { upsert: true } // add user document with id if not exists 
    )
}

const archive = async (id) => {
  const dbConnect = dbo.getDb();
  return await dbConnect
    .collection(collection)
    .updateOne(
      { _id: ObjectId(id), active: 1 },
      { $set: { active: 0 } }
    )
};

export { insert, emailExists, get, getCount, idExists, update, archive };
