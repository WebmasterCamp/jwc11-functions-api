"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("@google-cloud/firestore");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
const firestore = new firestore_1.Firestore();
const campersRef = firestore.collection("campers");
exports.campers = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    campersRef
        .get()
        .then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        res.status(200).send({
            content: data.filter(e => e.submitted && e.major === "content").length,
            marketing: data.filter(e => e.submitted && e.major === "marketing")
                .length,
            design: data.filter(e => e.submitted && e.major === "design").length,
            programming: data.filter(e => e.submitted && e.major === "programming")
                .length
        });
    })
        .catch(e => {
        res.sendStatus(500);
    });
});
//# sourceMappingURL=index.js.map