// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Select,
  DatePicker,
  Space,
  Spin,
  Alert,
  Typography,
  Layout,
  Tabs,
  Switch,
} from "antd";
import moment from "moment";
import StockPriceChart from "./StockPriceChart";
import FinancialMetrics from "./FinancialMetrics";
import HistoricalIncomeStatement from "./HistoricalIncomeStatement";
import BalanceSheet from "./BalanceSheet";
import CashFlowStatement from "./CashFlowStatement";
import RatioAnalysis from "./RatioAnalysis";
import Chatbot from "./Chatbot";
import AltmanZScore from "./AltmanZScore";
import "./Dashboard.css";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Content } = Layout;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState("HCL");
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, "year"),
    moment(),
  ]);
  const [stockData, setStockData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [financialMetrics, setFinancialMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [startDate, endDate] = dateRange;
        const response = await axios.get(
          `${API_URL}/api/stock/${selectedCompany}/?start=${startDate.format(
            "YYYY-MM-DD"
          )}&end=${endDate.format("YYYY-MM-DD")}`
        );
        if (response.data?.historical_data) {
          setStockData(response.data.historical_data);
          setLatestData(response.data.latest_data);
          setFinancialMetrics(response.data.financial_metrics);
        } else {
          setError("No data available for the selected range");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to fetch stock data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedCompany, dateRange]);

  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderLatestData = () => {
    if (!latestData) return null;

    return (
      <div className={`stock-overview ${darkMode ? "dark-overview" : ""}`}>
        <div className="stock-item">
          <strong>Latest Close:</strong>
          <span className="stock-item-value">₹{latestData.Close}</span>
        </div>
        <div className="stock-item">
          <strong>Previous Close:</strong>
          <span className="stock-item-value">₹{latestData.PreviousClose}</span>
        </div>
        <div className="stock-item">
          <strong>Latest Volume:</strong>
          <span className="stock-item-value">
            {latestData.Volume.toLocaleString()}
          </span>
        </div>
        <div className="stock-item">
          <strong>Change (%):</strong>
          <span className="stock-item-value">
            {latestData.change_percent.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" />;

    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane key="1" tab="Stock Price">
          <StockPriceChart
            stockData={stockData}
            selectedCompany={selectedCompany}
            darkMode={darkMode}
          />
          {renderLatestData()}
          {financialMetrics && <FinancialMetrics data={financialMetrics} />}
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Historical Income Statement">
          <HistoricalIncomeStatement symbol={selectedCompany} />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="Balance Sheet">
          <BalanceSheet symbol={selectedCompany} />
        </Tabs.TabPane>
        <Tabs.TabPane key="4" tab="Cash Flow Statement">
          <CashFlowStatement symbol={selectedCompany} />
        </Tabs.TabPane>
        <Tabs.TabPane key="5" tab="Ratio Analysis">
          <RatioAnalysis symbol={selectedCompany} />
        </Tabs.TabPane>
        <Tabs.TabPane key="6" tab="Altman's Z-Score">
          <AltmanZScore symbol={selectedCompany} />
        </Tabs.TabPane>
        <Tabs.TabPane key="7" tab="AI Assistant">
          <Chatbot />
        </Tabs.TabPane>
      </Tabs>
    );
  };

  return (
    <Layout className={`dashboard ${darkMode ? "dark-mode" : ""}`}>
      <Content>
        <Card className={`dashboard-card ${darkMode ? "dark-card" : ""}`}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space
              direction="horizontal"
              size="large"
              align="center"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Title level={2} className={darkMode ? "dark-title" : ""}>
                {selectedCompany} Stock Overview
              </Title>
              <Switch
                checkedChildren="Dark"
                unCheckedChildren="Light"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            </Space>

            <Space direction="horizontal" size="large">
              <Select
                value={selectedCompany}
                onChange={handleCompanyChange}
                style={{ width: 120 }}
              >
                {["HCL", "WIPRO", "LTIM", "TCS", "INFS"].map((company) => (
                  <Option key={company} value={company}>
                    {company}
                  </Option>
                ))}
              </Select>

              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
            </Space>

            {renderContent()}
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default Dashboard;
