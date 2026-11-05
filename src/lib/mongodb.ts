import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'booknook';

declare global {
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
    }
    client = global._mongoClient;
  } else {
    client = new MongoClient(uri);
  }
} else {
  // Safe dummy client during static build prerendering
  client = new MongoClient('mongodb://127.0.0.1:27017');
}

export const db = client.db(dbName);
export { client };
export default client;
