import clientPromise from './mongodb';
import { Collection, Db } from 'mongodb';

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Example function to insert a document
export async function insertDocument(collectionName: string, document: any) {
  const collection = await getCollection(collectionName);
  return await collection.insertOne(document);
}

// Example function to find documents
export async function findDocuments(collectionName: string, query: any = {}) {
  const collection = await getCollection(collectionName);
  return await collection.find(query).toArray();
}

// Example function to find one document
export async function findDocument(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return await collection.findOne(query);
}

// Example function to update a document
export async function updateDocument(collectionName: string, query: any, update: any) {
  const collection = await getCollection(collectionName);
  return await collection.updateOne(query, { $set: update });
}

// Example function to delete a document
export async function deleteDocument(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return await collection.deleteOne(query);
}
