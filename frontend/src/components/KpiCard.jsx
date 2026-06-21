function KpiCard({ title, value, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>

      <h3>{title}</h3>

      <h2>{value}</h2>
    </div>
  );
}

export default KpiCard;