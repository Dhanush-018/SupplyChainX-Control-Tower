import { useState, useEffect } from "react";
import API from "../services/api";
import KpiCard from "../components/KpiCard";
import KafkaRefresh
from "../components/KafkaRefresh";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#ef4444", // Low Stock
  "#10b981", // Normal Stock
  "#2563eb",
  "#f59e0b",
  "#8b5cf6"
];

function Warehouse() {

  const [warehouses, setWarehouses] = useState(0);
  const [avgInventory, setAvgInventory] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const [warehouseData, setWarehouseData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {

      const warehouseRes =
        await API.get("/inventory/total_warehouses");

      setWarehouses(
        Object.values(warehouseRes.data)[0]
      );

      const avgRes =
        await API.get("/inventory/avg_inventory");

      setAvgInventory(
        Object.values(avgRes.data)[0]
      );

      const lowRes =
        await API.get("/inventory/low_stock");

      setLowStock(
        Object.values(lowRes.data)[0]
      );

      const byWarehouseRes =
        await API.get("/inventory/by_warehouse");

      const sortedWarehouses =
        byWarehouseRes.data
          .sort((a, b) => b.inventory - a.inventory)
          .slice(0, 10);
          console.log("Warehouse Count =", sortedWarehouses.length);
          console.log(sortedWarehouses);

      setWarehouseData(sortedWarehouses);

      const statusRes =
        await API.get("/inventory/status");

      setStatusData([
        {
          name: "Low Stock",
          value: statusRes.data["Low Stock"]
        },
        {
          name: "Normal Stock",
          value: statusRes.data["Normal Stock"]
        }
      ]);

      const alertsRes =
        await API.get("/inventory/alerts");

      setAlerts(alertsRes.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Warehouse Operations
        </h1>

        <p className="dashboard-subtitle">
          Inventory Monitoring & Stock Intelligence
        </p>

      </div>
      <KafkaRefresh onRefresh={fetchWarehouseData}/>

      

      <div className="kpi-container">

        <KpiCard
          title="Warehouses"
          value={warehouses}
          icon="🏭"
        />

        <KpiCard
          title="Avg Inventory"
          value={Math.round(avgInventory)}
          icon="📦"
        />

        <KpiCard
          title="Low Stock"
          value={lowStock}
          icon="⚠️"
        />

      </div>

      <div className="charts-container">

        {/* Top Warehouses */}

        <div className="chart-box">

          <h3>Top 10 Warehouses By Inventory</h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={warehouseData}>

              <XAxis dataKey="warehouse"
               interval={0}
              tick={{ fontSize: 12 }}
/>

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  value.toLocaleString(),
                  "Inventory Level"
                ]}
              />

              <Bar dataKey="inventory"
               barSize={35}
>

                {warehouseData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      [
                        "#2563eb",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6"
                      ][index % 5]
                    }
                  />

                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Inventory Status */}

        <div className="chart-box">

          <h3>Inventory Status</h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {statusData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Alerts */}

      <div className="chart-box">

        <h3>🚨 Inventory Alerts</h3>

        <table className="alert-table">

          <thead>

            <tr>
              <th>Product ID</th>
              <th>Inventory Level</th>
              <th>Alert Message</th>
            </tr>

          </thead>

          <tbody>

            {alerts.length > 0 ? (

              alerts.map((item, index) => (

                <tr key={index}>

                  <td>{item.product_id}</td>

                  <td>
                    <strong>
                      {item.inventory_level}
                    </strong>
                  </td>

                  <td>
                    {item.alert_message}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="3">
                  No Active Inventory Alerts
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Warehouse;