import { useState } from "react";

function KafkaRefresh({ onRefresh }) {

  const [lastRefresh, setLastRefresh] =
    useState("Never");

  const handleRefresh = () => {

    onRefresh();

    setLastRefresh(
      new Date().toLocaleString()
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginBottom: "20px"
      }}
    >

      <button
        onClick={handleRefresh}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🔄 Refresh Data
      </button>

      <span>
        Last Refresh: {lastRefresh}
      </span>

    </div>
  );
}

export default KafkaRefresh;