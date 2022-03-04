const axios = require("axios");
const express = require("express");
require('dotenv').config();

const { mapFormDataToSearchParams } = require("./utils");

const app = express();
app.use(express.json());

const axiosInstance = axios.create({ baseURL: "https://account.nebeus.com" });
const cookieString = process.env.COOKIE_FULL_STRING;
console.log({cookieString})

app.get(/api/, async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "origin, content-type, accept"
    );

    const { data } = await axiosInstance.get(req.url, {
      headers: { cookie: cookieString },
    });
    console.log("REQUEST GET ANSWER: ", req.url, data);
    return res.status(200).json(data);
  } catch (e) {
    console.error("REQUEST GET ERROR: ", req.url, { error: e });
    return res.status(e.status || 400).json(e);
  }
});
app.post(/api/, async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "origin, content-type, accept"
    );

    const contentType = req.headers["content-type"];
    const byFormdata = contentType?.includes("form");
    if (byFormdata) {
      return mapFormDataToSearchParams(req, async (formdata) => {
        const { data } = await axiosInstance.post(req.url, formdata, {
          headers: {
            cookie: cookieString,
          },
        });

        console.log("REQUEST POST ANSWER: ", req.url, data);

        return res.status(200).json(data);
      });
    } else {
      const { data } = await axiosInstance.post(req.url, req.body, {
        headers: {
          cookie: cookieString,
        },
      });

      console.log("REQUEST POST ANSWER: ", req.url, data);

      return res.status(200).json(data);
    }
  } catch (e) {
    console.error("REQUEST POST ERROR: ", req.url, { error: e });

    return res.status(e?.response?.status || 400).json(e);
  }
});

app.listen(7000, () => {
  console.log("Application listening on port 7000!");
});
