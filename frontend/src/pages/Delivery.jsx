import { useState, useEffect } from "react";
import API from "../services/api";
import KpiCard from "../components/KpiCard";
import KafkaRefresh
from "../components/KafkaRefresh";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
];

function Delivery() {

  const [deliveries, setDeliveries] = useState(0);
  const [rating, setRating] = useState(0);
  const [avgCost, setAvgCost] = useState(0);

  const [ratingData, setRatingData] = useState([]);
  const [alertData, setAlertData] = useState([]);

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {

      const deliveriesRes =
        await API.get("/delivery/total_deliveries");

      setDeliveries(
        deliveriesRes.data["Total Deliveries"]
      );

      const ratingRes =
        await API.get("/delivery/avg_rating");

      setRating(
        ratingRes.data["Average Rating"]
      );

      const costRes =
        await API.get("/delivery/avg_cost");

      setAvgCost(
        costRes.data["Average Cost"]
      );

      const chartRes =
        await API.get("/delivery/top_ratings");

      setRatingData(chartRes.data);

      const alertRes =
        await API.get("/delivery/alerts");

      setAlertData(alertRes.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Delivery Intelligence
        </h1>

        <p className="dashboard-subtitle">
          Delivery Performance & Alert Monitoring
        </p>
      </div>

     <KafkaRefresh
  onRefresh={fetchDeliveryData}
/>

      <div className="kpi-container">

        <KpiCard
          title="Deliveries"
          value={deliveries.toLocaleString()}
          icon="🚚"
        />

        <KpiCard
          title="Avg Rating"
          value={rating}
          icon="⭐"
        />

        <KpiCard
          title="Avg Cost"
          value={`₹ ${avgCost}`}
          icon="💰"
        />

      </div>

      <div className="chart-box">

        <h3>Top 10 Deliveries By Rating</h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={ratingData}>

            <XAxis
              dataKey="delivery"
              interval={0}
              tick={{ fontSize: 11 }}
            />

            <YAxis />

            <Tooltip />

            <Bar dataKey="rating">

              {ratingData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div
        className="chart-box"
        style={{ marginTop: "30px" }}
      >

        <h3>🚨 Delivery Alerts</h3>

        {alertData.length === 0 ? (

          <h3
            style={{
              textAlign: "center",
              color: "green",
              marginTop: "20px"
            }}
          >
            No Active Delivery Alerts
          </h3>

        ) : (

          <table className="alert-table">

            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Order ID</th>
                <th>Delivery Time</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>

              {alertData.map((item) => (
                <tr key={item.alert_id}>
                  <td>{item.alert_id}</td>
                  <td>{item.order_id}</td>
                  <td>{item.delivery_time}</td>
                  <td>{item.alert_message}</td>
                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Delivery;