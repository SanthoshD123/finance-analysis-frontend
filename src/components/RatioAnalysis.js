// RatioAnalysis.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Spin, Alert, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const RatioAnalysis = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRatioAnalysisData();
  }, [symbol]);

  const fetchRatioAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/ratio_analysis/${symbol}/`
      );
      console.log("Raw data from API:", response.data); // Debug log

      if (Array.isArray(response.data) && response.data.length > 0) {
        setData(response.data);
      } else {
        throw new Error("API returned invalid data format or empty array.");
      }
    } catch (error) {
      console.error("Error fetching ratio analysis data:", error);
      setError(
        `Failed to fetch ratio analysis data for ${symbol}: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key: key,
          render: (value) =>
            typeof value === "number" ? value.toFixed(2) : value || "N/A",
          ellipsis: true,
        }))
      : [];

  const downloadCSV = () => {
    if (data.length === 0) return;

    const csvContent = [
      Object.keys(data[0]).join(","), // Headers
      ...data.map((row) => Object.values(row).join(",")), // Rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${symbol}_ratio_analysis.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="ratio-analysis">
      <Title level={3}>{symbol} Ratio Analysis</Title>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={downloadCSV}
        style={{ marginBottom: 16 }}
        disabled={data.length === 0}
      >
        Download CSV
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : data.length === 0 ? (
        <Alert
          message="No data available for the selected company"
          type="info"
        />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: true }}
          pagination={false}
          size="small"
          rowKey="Year"
        />
      )}
    </div>
  );
};

export default RatioAnalysis;
