import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Firestore } from "@google-cloud/firestore";
import { Camper, Major } from "./type";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const firestore = new Firestore();
const campersRef = firestore.collection("campers");

let summary;
let campers_list: Partial<Camper>[];

const countSubmittedCampers = (data: Partial<Camper>[]) => {
  return {
    content: data.filter(e => e.submitted && e.major === "content").length,
    marketing: data.filter(e => e.submitted && e.major === "marketing").length,
    design: data.filter(e => e.submitted && e.major === "design").length,
    programming: data.filter(e => e.submitted && e.major === "programming")
      .length
  };
};

const getCampersList = async () => {
  if (campers_list) {
    return campers_list;
  } else {
    const snapshot = await campersRef.get();
    const data = snapshot.docs.map(doc => doc.data());
    return data as Partial<Camper>[];
  }
};

campersRef.onSnapshot(next => {
  const data = next.docs.map(doc => doc.data());
  campers_list = data;
  summary = countSubmittedCampers(data);
});

export const campers = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // if (summary) {
  //   res.status(200).send(summary);
  // } else {
  campersRef
    .get()
    .then(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      res.status(200).send(countSubmittedCampers(data));
    })
    .catch(e => {
      res.sendStatus(500);
    });
  // }
});

const getInfo = (data: Partial<Camper>[]) => {
  const content = data.filter(e => e.major === Major.content);
  const design = data.filter(e => e.major === Major.design);
  const marketing = data.filter(e => e.major === Major.marketing);
  const programming = data.filter(e => e.major === Major.programming);
  const getEachMajorInfo = (eachMajor: Partial<Camper>[]) => {
    return {
      onProcess: {
        total: eachMajor.filter(e => !e.submitted).length,
        passGeneral: eachMajor.filter(
          e =>
            !e.submitted &&
            (e.generalAnswer1 && e.generalAnswer2 && e.generalAnswer3)
        ).length,
        passMajor: eachMajor.filter(
          e =>
            !e.submitted && (e.majorAnswer1 && e.majorAnswer2 && e.majorAnswer3)
        ).length
      },
      submitted: eachMajor.filter(e => e.submitted).length,
      total: eachMajor.length
    };
  };
  return {
    [Major.content]: getEachMajorInfo(content),
    [Major.design]: getEachMajorInfo(design),
    [Major.marketing]: getEachMajorInfo(marketing),
    [Major.programming]: getEachMajorInfo(programming),
    summary: getEachMajorInfo(data)
  };
};

export const info = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const data = await getCampersList();
    res.status(200).send(getInfo(data.filter(e => e.major)));
  } catch (error) {
    res.status(500).send({ error });
  }
});

export const allCampers = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const data = await getCampersList();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});
