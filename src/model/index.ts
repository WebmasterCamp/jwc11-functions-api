import * as admin from "firebase-admin";
import { Firestore } from "@google-cloud/firestore";

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export const firestore = new Firestore();
