import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Firestore } from "@google-cloud/firestore";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const firestore = new Firestore();
const campersRef = firestore.collection("campers");

let summary;

campersRef.onSnapshot(next => {
  const data = next.docs.map(doc => doc.data());
  summary = {
    content: data.filter(e => e.submitted && e.major === "content").length,
    marketing: data.filter(e => e.submitted && e.major === "marketing").length,
    design: data.filter(e => e.submitted && e.major === "design").length,
    programming: data.filter(e => e.submitted && e.major === "programming")
      .length
  };
});

export const campers = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (summary) {
    return res.status(200).send(summary);
  } else {
    campersRef
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        res.status(200).send({
          content: data.filter(e => e.submitted && e.major === "content")
            .length,
          marketing: data.filter(e => e.submitted && e.major === "marketing")
            .length,
          design: data.filter(e => e.submitted && e.major === "design").length,
          programming: data.filter(
            e => e.submitted && e.major === "programming"
          ).length
        });
      })
      .catch(e => {
        res.sendStatus(500);
      });
  }
});
