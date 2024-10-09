import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/stock/${symbol}/`
        );
        setStockData(response.data.historical_data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div>
      <h2>{symbol} Stock Chart</h2>
      {stockData ? (
        <Plot
          data={[
            {
              x: Object.keys(stockData.Close),
              y: Object.values(stockData.Close),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            },
          ]}
          layout={{
            title: `${symbol} Stock Prices`,
            xaxis: { title: "Date" },
            yaxis: { title: "Price" },
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
        />
      ) : (
        <p>Loading stock data...</p>
      )}
    </div>
  );
};

export default StockChart;
