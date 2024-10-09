import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, Spin, Alert, Space } from "antd";

const StockPriceChart = ({ stockData, selectedCompany }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (period) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/predict/${selectedCompany}/${period}/`
      );
      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setError("Failed to fetch predictions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const combinedData = [...stockData];
  if (predictions) {
    const lastDate = new Date(stockData[stockData.length - 1].date);
    predictions.predictions.forEach((price, index) => {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + index + 1);
      combinedData.push({
        date: date.toISOString().split("T")[0],
        predictedClose: price,
      });
    });
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            name="Close Price"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            stroke="#82ca9d"
            name="Volume"
            dot={false}
          />
          {predictions && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="predictedClose"
              stroke="#ffc658"
              name="Predicted Price"
              dot={false}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <Space style={{ marginTop: "16px" }}>
        <Button onClick={() => handlePredict("1m")} disabled={loading}>
          Predict Next Month
        </Button>
        <Button onClick={() => handlePredict("6m")} disabled={loading}>
          Predict Next 6 Months
        </Button>
        <Button onClick={() => handlePredict("1y")} disabled={loading}>
          Predict Next Year
        </Button>
      </Space>

      {loading && <Spin size="large" style={{ marginTop: "16px" }} />}

      {error && (
        <Alert message={error} type="error" style={{ marginTop: "16px" }} />
      )}

      {predictions && (
        <div style={{ marginTop: "16px" }}>
          <h3>Prediction Metrics:</h3>
          <p>Mean Absolute Error: {predictions.mae.toFixed(2)}</p>
          <p>Root Mean Squared Error: {predictions.rmse.toFixed(2)}</p>
          <p>Naive Forecast MAE: {predictions.naive_mae.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default StockPriceChart;
