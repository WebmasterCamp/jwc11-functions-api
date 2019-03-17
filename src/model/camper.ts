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
