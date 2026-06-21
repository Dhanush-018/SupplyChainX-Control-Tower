import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Warehouse from "./pages/Warehouse";
import Fleet from "./pages/Fleet";
import Supplier from "./pages/Supplier";
import Delivery from "./pages/Delivery";
import Shipment from "./pages/Shipment";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <Navbar />

        <div className="main-layout">
          <Sidebar />

          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/shipment" element={<Shipment />} />
            </Routes>
          </div>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;