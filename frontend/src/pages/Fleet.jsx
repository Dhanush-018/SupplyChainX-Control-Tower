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

function Fleet() {

  const [vehicles, setVehicles] = useState(0);
  const [avgFuel, setAvgFuel] = useState(0);
  const [avgDelay, setAvgDelay] = useState(0);

  const [delayData, setDelayData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {

      const vehiclesRes =
        await API.get("/fleet/total_vehicles");

      setVehicles(
        vehiclesRes.data["Total Vehicles"]
      );

      const fuelRes =
        await API.get("/fleet/avg_fuel");

      setAvgFuel(
        fuelRes.data["Average Fuel"]
      );

      const delayRes =
        await API.get("/fleet/avg_delay");

      setAvgDelay(
        delayRes.data["Average Delay"]
      );

      const delayAnalysis =
        await API.get("/fleet/delay_analysis");

      setDelayData(delayAnalysis.data);

      const fuelAnalysis =
        await API.get("/fleet/fuel_analysis");

      setFuelData(fuelAnalysis.data);

      const maintenanceRes =
        await API.get("/fleet/maintenance");

      setMaintenanceData(
        maintenanceRes.data
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Fleet Operations
        </h1>

        <p className="dashboard-subtitle">
          Vehicle Monitoring & Transport Intelligence
        </p>

      </div>

      <KafkaRefresh
  onRefresh={fetchFleetData}
/>

      <div className="kpi-container">

        <KpiCard
          title="Vehicles"
          value={vehicles.toLocaleString()}
          icon="🚛"
        />

        <KpiCard
          title="Avg Fuel"
          value={avgFuel}
          icon="⛽"
        />

        <KpiCard
          title="Avg Delay"
          value={`${avgDelay} min`}
          icon="⏱"
        />

      </div>

      <div className="charts-container">

        <div className="chart-box">

          <h3>
            Top 10 Delay Vehicles
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={delayData}>

              <XAxis
                dataKey="vehicle"
                interval={0}
                tick={{ fontSize: 11 }}
              />

              <YAxis />

              <Tooltip />

              <Bar dataKey="delay">

                {delayData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % 5]
                    }
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-box">

          <h3>
            Top 10 Fuel Consumption
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={fuelData}>

              <XAxis
                dataKey="vehicle"
                interval={0}
                tick={{ fontSize: 11 }}
              />

              <YAxis />

              <Tooltip />

              <Bar dataKey="fuel">

                {fuelData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % 5]
                    }
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="chart-box">

        <h3>
          🔧 Maintenance Tickets
        </h3>

        <table className="alert-table">

          <thead>
            <tr>
              <th>Ticket</th>
              <th>Vehicle</th>
              <th>Issue</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {maintenanceData.map(
              (item, index) => (

                <tr key={index}>
                  <td>{item.ticket_id}</td>
                  <td>{item.vehicle_id}</td>
                  <td>{item.issue_description}</td>
                  <td>{item.created_at}</td>
                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Fleet;

