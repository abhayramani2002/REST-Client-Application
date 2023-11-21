// models/Request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    requestData: {
      type: Object,
    },
    responseData: {
      type: Object,
    },
    authorization: {
      type: String,
    },
    headers: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
