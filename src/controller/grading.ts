import { getSelectedIds, getAlternativeIds } from "../model/grading";
import { getCampers } from "../model/camper";
import { Major } from "../type";

export const getSelectedCampers = async () => {
  const ids = await getSelectedIds();
  const campers = await getCampers(ids);
  return {
    content: campers.filter(e => e.major === Major.content),
    design: campers.filter(e => e.major === Major.design),
    marketing: campers.filter(e => e.major === Major.marketing),
    programming: campers.filter(e => e.major === Major.programming)
  };
};

export const getAlternatedCampers = async () => {
  const ids = await getAlternativeIds();
  console.log(ids);
  const campers = await getCampers(ids);
  return {
    content: campers.filter(e => e.major === Major.content),
    design: campers.filter(e => e.major === Major.design),
    marketing: campers.filter(e => e.major === Major.marketing),
    programming: campers.filter(e => e.major === Major.programming)
  };
};
