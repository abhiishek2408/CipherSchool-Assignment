import crypto from "crypto";

const secret = crypto.randomBytes(64).toString("hex");
console.log("Your JWT Secret:", secret);


//node generateSecret.js
