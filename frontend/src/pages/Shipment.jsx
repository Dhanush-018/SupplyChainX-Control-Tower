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

function Shipment() {

  const [shipments, setShipments] = useState(0);
  const [delay, setDelay] = useState(0);
  const [incidents, setIncidents] = useState(0);

  const [portData, setPortData] = useState([]);
  const [alertData, setAlertData] = useState([]);

  useEffect(() => {
    fetchShipmentData();
  }, []);

  const fetchShipmentData = async () => {

    try {

      const shipmentsRes =
        await API.get("/shipment/total_shipments");

      setShipments(
        shipmentsRes.data["Total Shipments"]
      );

      const delayRes =
        await API.get("/shipment/avg_customs_delay");

      setDelay(
        delayRes.data["Average Delay"]
      );

      const incidentRes =
        await API.get("/shipment/incidents");

      setIncidents(
        incidentRes.data["Incidents"]
      );

      const chartRes =
        await API.get("/shipment/top_ports");

      setPortData(chartRes.data);

      const alertRes =
        await API.get("/shipment/alerts");

      setAlertData(alertRes.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Shipment Intelligence
        </h1>

        <p className="dashboard-subtitle">
          Port Operations & Customs Monitoring
        </p>

      </div>

      <KafkaRefresh
  onRefresh={fetchShipmentData}
/>

      <div className="kpi-container">

        <KpiCard
          title="Shipments"
          value={shipments.toLocaleString()}
          icon="🚢"
        />

        <KpiCard
          title="Avg Customs Delay"
          value={`${delay} Hrs`}
          icon="⏱"
        />

        <KpiCard
          title="Incidents"
          value={incidents}
          icon="🚨"
        />

      </div>

      <div className="chart-box">

        <h3>Top 10 Ports By Delay</h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={portData}>

            <XAxis
              dataKey="port"
              interval={0}
              tick={{ fontSize: 11 }}
            />

            <YAxis />

            <Tooltip />

            <Bar dataKey="delay">

              {portData.map((entry, index) => (
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

        <h3>🚨 Logistics Incidents</h3>

        <table className="alert-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Order</th>
              <th>Delay(Hrs)</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>

            {alertData.map((item) => (
              <tr key={item.incident_id}>
                <td>{item.incident_id}</td>
                <td>{item.order_id}</td>
                <td>{item.delay_hours}</td>
                <td>{item.incident_message}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Shipment;