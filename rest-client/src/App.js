import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [selectedSection, setSelectedSection] = useState("Headers");
  const [authorization, setAuthorization] = useState("");
  const [headers, setHeaders] = useState([]);
  const [params, setParams] = useState([]);
  const [data, setData] = useState("");
  const [responseData, setResponseData] = useState("");
  const [error, setError] = useState("");
  const [historicalRequests, setHistoricalRequests] = useState([]);

  const handleRequest = async () => {
    try {
      const queryParams = params
        .filter((param) => param.key && param.value)
        .map((param) => `${param.key}=${param.value}`)
        .join("&");

      const fullUrl = queryParams ? `${url}?${queryParams}` : url;

      const body = { method, url: fullUrl };

      // Include optional fields in the request body
      if (data) {
        body["data"] = JSON.parse(data);
      }
      if (authorization) {
        body["authorization"] = authorization;
      }
      if (headers.length > 0) {
        body["headers"] = headers.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});
      }

      const response = await axios.post("http://localhost:3000/api/requests", {
        body,
      });

      setResponseData(response.data.responseData);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response?.data.error || "An error occurred");
    }
  };
  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/history");
      setHistoricalRequests(response.data.historicalRequests);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <div className="title">
        <h1>REST Client Application</h1>
      </div>
      <div className="container">
        <div className="request-container">
          <div className="request-header">
            <label className="method-label">Method:</label>
            <select
              className="method-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <label className="url-label">URL:</label>
            <input
              className="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="send-button" onClick={handleRequest}>
              Send Request
            </button>
          </div>
          <div className="horizontal-sidebar">
            <div className="sidebar-options">
              {["Authorization", "Headers", "Params", "Data", "History"].map(
                (option) => (
                  <button
                    key={option}
                    className={selectedSection === option ? "active" : ""}
                    onClick={() => {
                      setSelectedSection(option);
                      if (option === "History") {
                        fetchHistory();
                      }
                    }}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
            <div className="sidebar-content">
              {selectedSection === "Authorization" && (
                <div>
                  <label>Authorization:</label>
                  <input
                    type="text"
                    value={authorization}
                    onChange={(e) => setAuthorization(e.target.value)}
                  />
                </div>
              )}
              {selectedSection === "Headers" && (
                <div>
                  <label>Headers:</label>
                  {headers.map((header, index) => (
                    <div key={index} className="key-value-pair">
                      <input
                        type="text"
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => {
                          const updatedHeaders = [...headers];
                          updatedHeaders[index].key = e.target.value;
                          setHeaders(updatedHeaders);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => {
                          const updatedHeaders = [...headers];
                          updatedHeaders[index].value = e.target.value;
                          setHeaders(updatedHeaders);
                        }}
                      />
                      <button
                        onClick={() => {
                          const updatedHeaders = [...headers];
                          updatedHeaders.splice(index, 1);
                          setHeaders(updatedHeaders);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setHeaders([...headers, { key: "", value: "" }])
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
              {selectedSection === "Params" && (
                <div>
                  <label>Params:</label>
                  {params.map((param, index) => (
                    <div key={index} className="key-value-pair">
                      <input
                        type="text"
                        placeholder="Key"
                        value={param.key}
                        onChange={(e) => {
                          const updatedParams = [...params];
                          updatedParams[index].key = e.target.value;
                          setParams(updatedParams);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => {
                          const updatedParams = [...params];
                          updatedParams[index].value = e.target.value;
                          setParams(updatedParams);
                        }}
                      />
                      <button
                        onClick={() => {
                          const updatedParams = [...params];
                          updatedParams.splice(index, 1);
                          setParams(updatedParams);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setParams([...params, { key: "", value: "" }])
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
              {selectedSection === "Data" && (
                <div className="data-section">
                  <label>Data:</label>
                  <textarea
                    className="data-textarea"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    rows={10}
                  />
                </div>
              )}
              {selectedSection === "History" && (
                <div>
                  <h2>Historical Requests:</h2>
                  <ul>
                    {historicalRequests.map((request, index) => (
                      <li key={index}>
                        <strong>{request.method}</strong> {request.url}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="response-section">
          {responseData && (
            <>
              <h2>Response:</h2>
              <textarea
                className="response-textarea"
                value={JSON.stringify(responseData, null, 2)}
                readOnly
                rows={10}
              />
            </>
          )}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
