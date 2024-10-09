import React from "react";
import { Table } from "antd";
const FinancialMetrics = ({ data }) => {
  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];
  const tableData = [
    { key: "1", metric: "Market Cap", value: data.market_cap },
    { key: "2", metric: "P/E Ratio", value: data.pe_ratio },
    { key: "3", metric: "Book Value", value: data.book_value },
    { key: "4", metric: "Dividend Yield", value: data.dividend_yield },
    { key: "5", metric: "ROE", value: data.roe },
    { key: "6", metric: "ROCE", value: data.roce },
  ];
  return (
    <div className="financial-metrics">
      {" "}
      <h2>Financial Metrics</h2>{" "}
      <Table columns={columns} dataSource={tableData} pagination={false} />{" "}
    </div>
  );
};
export default FinancialMetrics;
