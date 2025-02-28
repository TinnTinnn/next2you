import {MongoClient, ServerApiVersion} from "mongodb";

if (!process.env.DB_URI) {
    throw new Error("Mongo URI is missing");
}

const client  =  new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async  function getDB(dbname) {
    try {
        await client.connect();
        console.log(">>>>Connected to DB<<<<");
        return client.db(dbname);
    } catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
        throw err;
    }
}

export async function getCollection(collectionName)  {
    const db = await getDB("next_blog_db");
    if (!db) {
        throw new Error("Database connection failed");
    }
    const collection = db.collection(collectionName);
    console.log("Collection retrieved:", collectionName);
    return collection;
}