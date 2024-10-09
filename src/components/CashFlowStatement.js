// CashFlowStatement.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Spin, Alert, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CashFlowStatement = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCashFlowData();
  }, [symbol]);

  const fetchCashFlowData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/cash_flow/${symbol}/`
      );
      console.log("Raw data from API:", response.data); // Debug log

      if (Array.isArray(response.data) && response.data.length > 0) {
        setData(response.data);
      } else {
        throw new Error("API returned invalid data format or empty array.");
      }
    } catch (error) {
      console.error("Error fetching cash flow data:", error);
      setError(
        `Failed to fetch cash flow data for ${symbol}: ${error.message}`
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
          render: (value) => value || "N/A",
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
      link.setAttribute("download", `${symbol}_cash_flow.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="cash-flow-statement">
      <Title level={3}>{symbol} Cash Flow Statement</Title>
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
          rowKey="Date"
        />
      )}
    </div>
  );
};

export default CashFlowStatement;
