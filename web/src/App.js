import "./App.scss";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import Region from "./pages/region";
import logo from "./resources/logo.png";
import earth from "./resources/earth.png";
import { useEffect, useState } from "react";

function App() {
  const [isCn, setIsCn] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isCn = +localStorage.getItem("isCn");
    setIsCn(isCn);
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div
          className="logo"
          onClick={() => {
            navigate("/");
          }}
        >
        </div>
      </div>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
