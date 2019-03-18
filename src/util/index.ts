import moment from "moment-timezone";

export const TIMEZONE = "Asia/Bangkok";

export const getStartRegistrationMoment = () => {
  return moment()
    .tz(TIMEZONE)
    .year(2019)
    .month(2)
    .date(1)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
};

export const getEndRegistrationMoment = () => {
  return moment()
    .tz(TIMEZONE)
    .year(2019)
    .month(2)
    .date(21)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
};
