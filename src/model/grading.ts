import { firestore } from ".";

const gradingRef = firestore.collection("grading");

export const getSelectedIds = async () => {
  const selected = await gradingRef.where("selected", "==", true).get();
  return selected.docs.filter(e => !e.data().alternate).map(e => e.id);
};

export const getAlternativeIds = async () => {
  const alternative = await gradingRef.where("selected", "==", true).get();
  return alternative.docs.filter(e => e.data().alternate).map(e => e.id);
};
