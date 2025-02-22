/**
 * DO NOT USE EXTERNAL DEPENDENCIES
 * TO PREVENT THE SUPPLY CHAIN ATTACKS
 */

"use strict";

const fs = require("fs");

const listEnv = [
  "APP_ENV",
  "PORT",
  "IS_LOCAL",
  "REDIS_HOST",
  "REDIS_READER_HOST",
  "API_KEY",
  "OCS_TRIGGER_QUEUE_URL",
  "TICKET_QUEUE_URL",
  "BUNDLE_TRIGGER_QUEUE_URL"
];

// Combine object in ENV to single object

const env = listEnv.reduce((object, key) => {
  object[key] = process.env[key];
  return object;
}, {});

// Write to file
// Logs
console.log(`Envs:`, env);
const green = "\x1b[32m";
const reset = "\x1b[0m";
fs.writeFile(
  "./src/environments/env.json",
  JSON.stringify(env, null, 2),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(
      `\n${green}ENV file has been created in ./src/environments/env.json ${reset}`
    );
  }
);
