import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Header";
import "./App.css"; // Ensure dark mode styles are added here

const { Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <ConfigProvider>
      <Router>
        <Layout className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
          <AppHeader darkMode={darkMode} setDarkMode={setDarkMode} />
          <Content className={`app-content ${darkMode ? "dark-mode" : ""}`}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
