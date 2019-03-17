import * as functions from "firebase-functions";
import { countSubmittedCampers, getInfo, getSummary } from "./controller/camper";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const campers = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send(await countSubmittedCampers());
  } catch (error) {
    res.status(500).send({ error });
  }
});


export const info = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send(await getInfo());
  } catch (error) {
    res.status(500).send({ error });
  }
});

export const campersSummary = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send(await getSummary());
  } catch (error) {
    res.status(500).send({ error });
  }
});
