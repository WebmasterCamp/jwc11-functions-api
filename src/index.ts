import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Firestore } from "@google-cloud/firestore";
import { Camper, Major, CamperSummary, Summary } from "./type";
import moment from "moment-timezone";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const firestore = new Firestore();
const campersRef = firestore.collection("campers");

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
  const data = next.docs.map(doc => {
    const d = doc.data() as Partial<Camper>;
    if (!d.createdAt && d.updatedAt) {
      d.createdAt = d.updatedAt;
    }
    return d;
  });
  campers_list = data;
});

export const campers = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const data = await getCampersList();
    res.status(200).send(countSubmittedCampers(data));
  } catch (error) {
    res.status(500).send({ error });
  }
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

const getSummary = (data: Partial<Camper>[]): CamperSummary => {
  const timezone = "Asia/Bangkok";
  const date = moment()
    .tz(timezone)
    .year(2019)
    .month(2)
    .date(1)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const authenticated: Summary[] = [];
  const submitted: Summary[] = [];
  const seperatedAuthenticated: Summary[] = [];
  const seperatedSubmitted: Summary[] = [];
  for (
    let i = 0;
    i <
    Math.min(
      20,
      moment()
        .tz(timezone)
        .date() + 1
    );
    i++
  ) {
    const selectedDate = moment(date)
      .tz(timezone)
      .date(date.date() + i);
    authenticated.push(
      data
        .filter(
          e => e.createdAt && e.createdAt.toMillis() < selectedDate.valueOf()
        )
        .reduce(
          (prev, curr) => {
            if (curr.major) {
              return { ...prev, [curr.major]: prev[curr.major] + 1 };
            }
            return prev;
          },
          {
            date: selectedDate.toDate(),
            design: 0,
            content: 0,
            marketing: 0,
            programming: 0
          }
        )
    );
    seperatedAuthenticated.push(
      data
        .filter(
          e =>
            e.createdAt &&
            e.createdAt.toMillis() < selectedDate.valueOf() &&
            e.createdAt.toMillis() >
              moment(selectedDate)
                .tz(timezone)
                .date(selectedDate.date() - 1)
                .valueOf()
        )
        .reduce(
          (prev, curr) => {
            if (curr.major) {
              return { ...prev, [curr.major]: prev[curr.major] + 1 };
            }
            return prev;
          },
          {
            date: selectedDate.toDate(),
            design: 0,
            content: 0,
            marketing: 0,
            programming: 0
          }
        )
    );
    submitted.push(
      data
        .filter(
          e =>
            e.updatedAt &&
            e.updatedAt.toMillis() < selectedDate.valueOf() &&
            e.submitted
        )
        .reduce(
          (prev, curr) => {
            if (curr.major) {
              return { ...prev, [curr.major]: prev[curr.major] + 1 };
            }
            return prev;
          },
          {
            date: selectedDate.toDate(),
            design: 0,
            content: 0,
            marketing: 0,
            programming: 0
          }
        )
    );
    seperatedSubmitted.push(
      data
        .filter(
          e =>
            e.updatedAt &&
            e.updatedAt.toMillis() < selectedDate.valueOf() &&
            e.updatedAt.toMillis() >
              moment(selectedDate)
                .tz(timezone)
                .date(selectedDate.date() - 1)
                .valueOf() &&
            e.submitted
        )
        .reduce(
          (prev, curr) => {
            if (curr.major) {
              return { ...prev, [curr.major]: prev[curr.major] + 1 };
            }
            return prev;
          },
          {
            date: selectedDate.toDate(),
            design: 0,
            content: 0,
            marketing: 0,
            programming: 0
          }
        )
    );
  }
  return {
    accumulate: {
      authenticated,
      submitted
    },
    seperate: {
      authenticated: seperatedAuthenticated,
      submitted: seperatedSubmitted
    }
  };
};

export const campersSummary = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const data = await getCampersList();
    res.status(200).send(getSummary(data));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});
