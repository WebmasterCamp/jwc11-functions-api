import * as functions from "firebase-functions";
import { join } from "path";
import { readFileSync } from "fs";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const campers = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const x = readFileSync(join(__dirname,'..','campers.json'))
    // const x = await countSubmittedCampers()
    // writeFileSync('campers.json', JSON.stringify(x));
    res.status(200).send(JSON.parse(x.toString()));
  } catch (error) {
    res.status(500).send({ error });
  }
});

export const info = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const x = readFileSync(join(__dirname,'..','info.json'))
    // const x = await getInfo()
    // writeFileSync('info.json', JSON.stringify(x));
    res.status(200).send(JSON.parse(x.toString()));
  } catch (error) {
    res.status(500).send({ error });
  }
});

export const campersSummary = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const x = readFileSync(join(__dirname,'..','summary.json'))
    // const x = await getSummary()
    // writeFileSync('summary.json', JSON.stringify(x));
    res.status(200).send(JSON.parse(x.toString()));
  } catch (error) {
    res.status(500).send({ error });
  }
});

// const filterInfo = (data: Partial<Camper>[]) => {
//   return data.map(e =>
//     [
//       e.firstname,
//       e.lastname,
//       e.nickname,
//       e.gender,
//       e.major,
//       e.class,
//       e.facebookDisplayName,
//       e.phone,
//       e.religion,
//       e.drugAllergy,
//       e.foodAllergy,
//       e.school,
//       e.shirtSize,
//       e.address,
//       e.birthdate
//     ].join(",")
//   ).join('\n');
// };

// const header = `firstname,lastname,nickname,gender,major,class,facebookDisplayName,phone,religion,drugAllergy,foodAllergy,school,shirtSize,address,birthdate`;

// export const selectedCamper = functions.https.onRequest(async (req, res) => {
//   try {
    // const selected = await getSelectedCampers();
    // writeFileSync(
    //   "ตัวจริง.csv",
    //   [
    //     header,
    //     filterInfo(
    //       selected.content.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       selected.marketing.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       selected.design.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       selected.programming.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     )
    //   ].join("\n")
    // );

    // const alternate = await getAlternatedCampers();
    // writeFileSync(
    //   "สำรอง.csv",
    //   '\uFEFF'+[
    //     header,
    //     filterInfo(
    //       alternate.content.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       alternate.marketing.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       alternate.design.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     ),
    //     filterInfo(
    //       alternate.programming.sort((a, b) =>
    //         a.firstname + a.lastname > b.firstname + b.lastname ? 1 : -1
    //       )
    //     )
    //   ].join("\n")
    // );
//     res.set("Access-Control-Allow-Origin", "*");
//     res.status(200).send('');
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });
