import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./AppHeader.css"; // Custom styles
import logo from "../TTS New Vertical Trans Logo (2).png";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="TEMS TECH logo" className="logo" />
        <h1 className="company-name">TEMS TECH</h1>
      </div>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
