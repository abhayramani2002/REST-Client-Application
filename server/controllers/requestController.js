const requestService = require("../services/requestService");

const handleRequest = async (req, res) => {
  const { method, url, data, authorization, headers } = req.body.body;

  try {
    const response = await requestService.makeRequest(
      method,
      url,
      data,
      authorization,
      headers
    );

    // Save the request to MongoDB
    await requestService.saveRequestToDB(
      method,
      url,
      data,
      response.responseData,
      authorization,
      headers
    );
    res.json({ responseData: response.responseData });
  } catch (error) {
    console.log(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const historicalRequests = await requestService.getHistoricalRequests();
    res.json({ historicalRequests });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching history" });
  }
};

module.exports = { handleRequest, getHistory };
