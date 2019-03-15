import { Timestamp } from "@google-cloud/firestore";

export enum Major {
  design = "design",
  content = "content",
  marketing = "marketing",
  programming = "programming"
}

export type Camper = {
  activity: string;
  address: string;
  birthdate: string;
  class: string;
  createdAt: Timestamp;
  disease: string;
  drugAllergy: string;
  email: string;
  facebookDisplayName: string;
  facebookEmail: string;
  facebookPhotoURL: string;
  firstname: string;
  foodAllergy: string;
  gender: "male" | "female";
  generalAnswer1: string;
  generalAnswer2: string;
  generalAnswer3: string;
  lastname: string;
  major: Major;
  majorAnswer1: string;
  majorAnswer2: string;
  majorAnswer3: string;
  majorAnswer4?: any;
  nickname: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentRelation: string;
  phone: string;
  photo: string;
  religion: string;
  school: string;
  shirtSize: string;
  submitted: boolean;
  updatedAt: Timestamp;
};
