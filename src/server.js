import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import next from "next";
import url from "url";

import { __DEVELOPMENT__ } from "./common/client.config";
import { NODE_ENV } from "./server/server.config.js";

const server = express();

const port = process.env.PORT || 2020;

const nextApp = next({ dir: ".", dev: true });
const nextHandler = nextApp.getRequestHandler();

if (NODE_ENV === "production") {
  server.set("trust proxy", 1);
}

// enabling cors in development
if (NODE_ENV !== "production") {
  server.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );
}

server.use((req, res, next) => {
  if (NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

nextApp.prepare().then(() => {
  server
    .disable("x-powered-by")
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use("/api", (req, res) => {
      res.json({ message: "send 123213" });
    })
    .get("*", (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      nextHandler(req, res, parsedUrl);
    });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening n http://localhost:${port}`);
  });
});

export default server;
