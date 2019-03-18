import { getCampersList } from "../model/camper";
import { Camper, Major, CamperSummary, Summary } from "../type";
import moment, { Moment } from "moment-timezone";
import {
  TIMEZONE,
  getStartRegistrationMoment,
  getEndRegistrationMoment
} from "../util";

export const countSubmittedCampers = async () => {
  const data = await getCampersList();
  return {
    content: data.filter(e => e.submitted && e.major === "content").length,
    marketing: data.filter(e => e.submitted && e.major === "marketing").length,
    design: data.filter(e => e.submitted && e.major === "design").length,
    programming: data.filter(e => e.submitted && e.major === "programming")
      .length
  };
};

export const getInfo = async () => {
  const data = (await getCampersList()).filter(e => e.major);
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

const countSummary = (data: Partial<Camper>[], date: Moment) => {
  return data.reduce(
    (prev, curr) => {
      if (curr.major) {
        return { ...prev, [curr.major]: prev[curr.major] + 1 };
      }
      return prev;
    },
    {
      date: date.toDate(),
      design: 0,
      content: 0,
      marketing: 0,
      programming: 0
    }
  );
};

export const getSummary = async (): Promise<CamperSummary> => {
  const data = await getCampersList();
  const date = getStartRegistrationMoment();
  const authenticated: Summary[] = [];
  const submitted: Summary[] = [];
  const seperatedAuthenticated: Summary[] = [];
  const seperatedSubmitted: Summary[] = [];
  const dateRange =
    getEndRegistrationMoment().valueOf() > moment().valueOf()
      ? moment()
          .tz(TIMEZONE)
          .date() + 1
      : 20;
  for (let i = 0; i < dateRange; i++) {
    const selectedDate = getStartRegistrationMoment().date(date.date() + i);
    authenticated.push(
      countSummary(
        data.filter(
          e => e.createdAt && e.createdAt.toMillis() < selectedDate.valueOf()
        ),
        selectedDate
      )
    );
    seperatedAuthenticated.push(
      countSummary(
        data.filter(
          e =>
            e.createdAt &&
            e.createdAt.toMillis() < selectedDate.valueOf() &&
            e.createdAt.toMillis() >
              moment(selectedDate)
                .tz(TIMEZONE)
                .date(selectedDate.date() - 1)
                .valueOf()
        ),
        selectedDate
      )
    );
    submitted.push(
      countSummary(
        data.filter(
          e =>
            e.updatedAt &&
            e.updatedAt.toMillis() < selectedDate.valueOf() &&
            e.submitted
        ),
        selectedDate
      )
    );
    seperatedSubmitted.push(
      countSummary(
        data.filter(
          e =>
            e.updatedAt &&
            e.updatedAt.toMillis() < selectedDate.valueOf() &&
            e.updatedAt.toMillis() >
              moment(selectedDate)
                .tz(TIMEZONE)
                .date(selectedDate.date() - 1)
                .valueOf() &&
            e.submitted
        ),
        selectedDate
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
