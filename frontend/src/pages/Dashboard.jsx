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
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
];

function Dashboard() {

  const [regionData, setRegionData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [deliveries, setDeliveries] = useState(0);
  const [inventoryEvents, setInventoryEvents] = useState(0);
  const [vehicles, setVehicles] = useState(0);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {

      const ordersRes = await API.get("/kpi/total_orders");
      setOrders(ordersRes.data["Total Orders"]);

      const revenueRes = await API.get("/kpi/total_revenue");
      setRevenue(Object.values(revenueRes.data)[0]);

      const deliveriesRes = await API.get("/kpi/total_deliveries");
      setDeliveries(Object.values(deliveriesRes.data)[0]);

      const inventoryRes = await API.get("/kpi/total_inventory_events");
      setInventoryEvents(Object.values(inventoryRes.data)[0]);

      const vehiclesRes = await API.get("/kpi/total_vehicles");
      setVehicles(Object.values(vehiclesRes.data)[0]);

      const regionRes = await API.get("/analytics/orders_by_region");
      setRegionData(regionRes.data);

      const statusRes = await API.get("/analytics/orders_by_status");
      setStatusData(statusRes.data);

      const revenueRegionRes =
        await API.get("/analytics/revenue_by_region");

      const formattedRevenue =
        revenueRegionRes.data.map(item => ({
          ...item,
          revenue: Number(
            (item.revenue / 10000000).toFixed(2)
          )
        }));

      setRevenueData(formattedRevenue);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Dashboard Overview
        </h1>

        <p className="dashboard-subtitle">
          Real-Time Supply Chain Analytics Platform
        </p>
         <KafkaRefresh
      onRefresh={fetchKPIs}
    />

      </div>

    
      <div className="kpi-container">

        <KpiCard
          title="Total Orders"
          value={orders.toLocaleString()}
          icon="📦"
        />

        <KpiCard
          title="Revenue"
          value={`₹ ${(revenue / 10000000).toFixed(2)} Cr`}
          icon="💰"
        />

        <KpiCard
          title="Deliveries"
          value={deliveries.toLocaleString()}
          icon="🚚"
        />

        <KpiCard
          title="Inventory Events"
          value={inventoryEvents.toLocaleString()}
          icon="🏭"
        />

        <KpiCard
          title="Vehicles"
          value={vehicles.toLocaleString()}
          icon="🚛"
        />

      </div>

      <div className="charts-container">

        {/* Orders By Region */}

        <div className="chart-box">

          <h3>Orders By Region</h3>

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={regionData}>

              <XAxis dataKey="region" />

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  value.toLocaleString(),
                  "Orders"
                ]}
              />

              <Bar dataKey="orders">

                {regionData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Orders By Status */}

        <div className="chart-box">

          <h3>Orders By Status</h3>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                outerRadius={110}
                label
              >

                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
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

        {/* Revenue By Region */}

        <div className="chart-box">

          <h3>Revenue By Region (Crores)</h3>

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={revenueData}>

              <XAxis dataKey="region" />

              <YAxis
                tickFormatter={(value) => `${value} Cr`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹ ${value} Cr`,
                  "Revenue"
                ]}
              />

              <Bar dataKey="revenue">

                {revenueData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;