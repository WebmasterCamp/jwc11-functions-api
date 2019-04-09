import { firestore } from ".";
import { Camper } from "../type";

const campersRef = firestore.collection("campers");

let campers_list: Partial<Camper>[];

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

export const getCampersList = async () => {
  if (campers_list) {
    return campers_list;
  } else {
    const snapshot = await campersRef.get();
    const data = snapshot.docs.map(doc => doc.data());
    return data as Partial<Camper>[];
  }
};

export const getCampers = async (ids: string[]) => {
  const snapshot = await campersRef.get();
  const data = snapshot.docs.filter(e => ids.includes(e.id)).map(e => e.data());
  return data as Partial<Camper>[];
};

// getCampersList().then(campers => {
// fs.writeFileSync(
//   "email.csv",
//   campers
//     .filter(e => !e.submitted && e.major && e.email)
//     .map(e => e.email)
//     .join(",")
// );
//   console.log(campers.filter(e => e.submitted && !e.major).map(e => e));
// });
