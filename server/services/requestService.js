const axios = require("axios");
const Request = require("../models/Request");

const makeRequest = async (method, url, data, authorization, headers) => {
  try {
    // Include authorization and headers in the request
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: authorization,
        ...headers,
      },
    });
    return { responseData: response.data };
  } catch (error) {
    throw error;
  }
};

const saveRequestToDB = async (
  method,
  url,
  data,
  responseData,
  authorization,
  headers
) => {
  try {
    // Save the request details to MongoDB
    await Request.create({
      method,
      url,
      requestData: data,
      responseData,
      authorization,
      headers,
    });
  } catch (error) {
    console.error("Error saving request to DB:", error);
    throw error;
  }
};

const getHistoricalRequests = async () => {
  try {
    // Retrieve historical requests from MongoDB
    return await Request.find().sort({ createdAt: -1 }).exec();
  } catch (error) {
    console.error("Error fetching historical requests:", error);
    throw error;
  }
};

module.exports = { makeRequest, saveRequestToDB, getHistoricalRequests };
