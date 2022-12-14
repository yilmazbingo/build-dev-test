// -------------- ENVIRONMENTS ----------------------- //
require("dotenv").config();

export const NODE_ENV = process.env.NODE_ENV || "production";
console.log("NODe_env", NODE_ENV);
