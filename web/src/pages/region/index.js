import { useEffect, useState, useCallback } from "react";
import { regionsApi } from "../../api";
import "./index.scss";
import { asyncPool } from "../../utils/pool";

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoadList = useCallback(() => {
    setLoading(true);
    regionsApi().then((data) => {
      setRegions(data);

      asyncPool(5, data, async (arg) => {
        const timeRes = await Promise.race([
          new Promise(async (resolve) => {
            const startTime = new Date().getTime();
            try {
              await fetch(arg.HomeApi);
            } catch (error) {}
            const endTime = new Date().getTime();
            resolve({
              ...arg,
              time: endTime - startTime,
            });
          }),
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ...arg,
                time: 5000,
              });
            }, 5000);
          }),
        ]);
        return timeRes;
      }).then((res) => {
        setRegions(
          res.sort((a, b) => {
            return +a.time - +b.time;
          })
        );
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return (
    <div className="region-warp">
      <div className="reload-warp">
        <div
          className="reload"
          onClick={() => {
            if (loading) {
              return;
            }
            handleLoadList();
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </div>
      </div>
      <table className="region-table">
        <thead>
          <tr>
            <th className="region">Region</th>
            <th className="region-name">Name</th>
            <th className="time">Time</th>
          </tr>
        </thead>

        <tbody>
          {regions.map((item) => {
            return (
              <tr key={item.Endpoint}>
                <td className="region">{item.Region}</td>
                <td className="region-name">{item.RegionName}</td>
                <td className="time">{item.time ? `${item.time} ms` : "Waiting..."}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Region;
