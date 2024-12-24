require('dotenv').config();
const cors = require("cors");
const { default: axios } = require("axios");
const express = require("express");
const app = express();
app.use(cors());
const port = 3000;

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

app.get("/search_hospitals", async (req, res) => {
  try {
    const {lat, lng, radius} = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=hospital&location=${lat},${lng}&radius=${radius}&type=hospital&key=${apiKey}`;
    const response = await axios.get(url);
    console.log("requested");
    res.json(response.data);
  } catch (e) {
    console.log(e)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
