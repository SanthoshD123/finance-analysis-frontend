import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert, Typography, Row, Col } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const AltmanZScore = ({ symbol }) => {
  const [zScoreData, setZScoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZScoreData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/altman-z-score/${symbol}/`
        );
        setZScoreData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching Altman's Z-Score data:", error);
        setError(
          "Failed to fetch Altman's Z-Score data. Please try again later."
        );
        setZScoreData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchZScoreData();
  }, [symbol]);

  const columns = [
    {
      title: "Year",
      dataIndex: "Year",
      key: "Year",
    },
    {
      title: "Z-Score",
      dataIndex: "Z_Score",
      key: "Z_Score",
    },
    {
      title: "Working Capital / Total Assets",
      dataIndex: "Working_Capital_to_Total_Assets",
      key: "Working_Capital_to_Total_Assets",
    },
    {
      title: "Retained Earnings / Total Assets",
      dataIndex: "Retained_Earnings_to_Total_Assets",
      key: "Retained_Earnings_to_Total_Assets",
    },
    {
      title: "EBIT / Total Assets",
      dataIndex: "EBIT_to_Total_Assets",
      key: "EBIT_to_Total_Assets",
    },
    {
      title: "Market Cap / Total Liabilities",
      dataIndex: "Market_Cap_to_Total_Liabilities",
      key: "Market_Cap_to_Total_Liabilities",
    },
    {
      title: "Sales / Total Assets",
      dataIndex: "Sales_to_Total_Assets",
      key: "Sales_to_Total_Assets",
    },
    {
      title: "Financial Status",
      dataIndex: "Financial_Status",
      key: "Financial_Status",
      render: (status) => {
        const color =
          status === "Safe Zone"
            ? "green"
            : status === "Grey Zone"
            ? "orange"
            : "red";
        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  const FinancialRatioChart = ({ data, dataKey, title }) => (
    <div style={{ marginBottom: "20px" }}>
      <Title level={5}>{title}</Title>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <Title level={3}>Altman's Z-Score Analysis for {symbol}</Title>

      {zScoreData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={zScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Z_Score"
                stroke="#8884d8"
                name="Z-Score"
              />
            </LineChart>
          </ResponsiveContainer>

          <Table
            dataSource={zScoreData}
            columns={columns}
            rowKey="Year"
            pagination={false}
            scroll={{ x: true }}
          />

          <Title level={4} style={{ marginTop: "40px" }}>
            Financial Summary
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="Working_Capital_to_Total_Assets"
                title="Working Capital to Total Assets"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="Retained_Earnings_to_Total_Assets"
                title="Retained Earnings to Total Assets"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="EBIT_to_Total_Assets"
                title="EBIT to Total Assets"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="Market_Cap_to_Total_Liabilities"
                title="Market Cap to Total Liabilities"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="Sales_to_Total_Assets"
                title="Sales to Total Assets"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <FinancialRatioChart
                data={zScoreData}
                dataKey="Z_Score"
                title="Financial Stability (Z-Score)"
              />
            </Col>
          </Row>
        </>
      ) : (
        <Alert message="No data available for this company" type="info" />
      )}

      <div style={{ marginTop: "20px" }}>
        <h4>Interpretation Guide:</h4>
        <ul>
          <li>
            <span style={{ color: "green" }}>Z-Score &gt; 2.99: Safe Zone</span>{" "}
            - The company is considered safe based on the financial figures.
          </li>
          <li>
            <span style={{ color: "orange" }}>
              1.81 &lt; Z-Score &lt; 2.99: Grey Zone
            </span>{" "}
            - The company should be considered with caution.
          </li>
          <li>
            <span style={{ color: "red" }}>
              Z-Score &lt; 1.81: Distress Zone
            </span>{" "}
            - The company could be headed for bankruptcy.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AltmanZScore;
