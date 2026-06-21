import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <h2>SupplyChainX</h2>
        <p>Control Tower</p>
      </div>

      <ul>

        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            📊 Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/warehouse"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            🏭 Warehouse
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/fleet"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            🚛 Fleet
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/supplier"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            🤝 Supplier
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/delivery"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            📦 Delivery
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/shipment"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            🚢 Shipment
          </NavLink>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;