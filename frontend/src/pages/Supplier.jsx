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

function Supplier() {

  const [suppliers, setSuppliers] = useState(0);
  const [rating, setRating] = useState(0);
  const [riskAlerts, setRiskAlerts] = useState(0);

  const [ratingData, setRatingData] = useState([]);
  const [alertData, setAlertData] = useState([]);

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {

    try {

      const totalRes =
        await API.get("/supplier/total_suppliers");

      setSuppliers(
        totalRes.data["Total Suppliers"]
      );

      const ratingRes =
        await API.get("/supplier/avg_rating");

      setRating(
        ratingRes.data["Average Rating"]
      );

      const riskRes =
        await API.get("/supplier/risk_count");

      setRiskAlerts(
        riskRes.data["Risk Alerts"]
      );

      const topRes =
        await API.get("/supplier/top_ratings");

      setRatingData(topRes.data);

      const alertRes =
        await API.get("/supplier/alerts");

      setAlertData(alertRes.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Supplier Intelligence
        </h1>

        <p className="dashboard-subtitle">
          Supplier Performance & Risk Monitoring
        </p>

      </div>

      <KafkaRefresh
  onRefresh={fetchSupplierData}
/>

      <div className="kpi-container">

        <KpiCard
          title="Suppliers"
          value={suppliers}
          icon="🏢"
        />

        <KpiCard
          title="Avg Rating"
          value={rating}
          icon="⭐"
        />

        <KpiCard
          title="Risk Alerts"
          value={riskAlerts}
          icon="🚨"
        />

      </div>

      <div className="chart-box">

        <h3>
          Top 10 Suppliers By Rating
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={ratingData}>

            <XAxis
              dataKey="supplier"
              interval={0}
            />

            <YAxis />

            <Tooltip />

            <Bar dataKey="rating">

              {ratingData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % 5]
                    }
                  />
                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div
        className="chart-box"
        style={{ marginTop: "30px" }}
      >

        <h3>
          🚨 Supplier Risk Alerts
        </h3>

        <table className="alert-table">

          <thead>

            <tr>
              <th>Alert ID</th>
              <th>Supplier</th>
              <th>Rating</th>
              <th>Message</th>
            </tr>

          </thead>

          <tbody>

            {alertData.map((item) => (

              <tr key={item.alert_id}>

                <td>{item.alert_id}</td>

                <td>{item.supplier_id}</td>

                <td>{item.supplier_rating}</td>

                <td>{item.alert_message}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Supplier;