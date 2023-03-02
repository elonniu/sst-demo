import React, { useEffect, useState } from "react";
import "./index.scss";
import { counterApi, getCounterApi } from "../../api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // This will run one time after the component mounts
  useEffect(() => {
    getCounterApi().then((data) => {
      setCount(data.count);
    });
  }, []);

  return (
    <div className="home-warp">
      <div className="count">I've been clicked {count} times.</div>
      <div
        className="btn"
        onClick={() => {
          if (loading) return;
          setLoading(true);
          counterApi().then((data) => {
            setLoading(false);
            setCount(data.count);
          });
        }}
      >
        <div className="btn-text">
          {loading && <div className="loading"></div>}
          Click me
        </div>
      </div>
    </div>
  );
};

export default Home;
