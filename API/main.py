from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, text
from sqlalchemy.orm import Session
from database import SessionLocal
from models import *

# ====================================
# App Setup
# ====================================
app = FastAPI(
    title="SupplyChainX API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================================
# Database Dependency
# ====================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ====================================
# Home API
# ====================================
@app.get("/")
def home():
    return {
        "Project": "SupplyChainX",
        "Version": "1.0",
        "Status": "Running"
    }

# ====================================
# Orders API
# ====================================
@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    data = db.query(FactOrders).limit(5000).all()
    return data

# ====================================
# Fleet API
# ====================================
@app.get("/fleet")
def get_fleet(db: Session = Depends(get_db)):
    data = db.query(FactFleet).limit(5000).all()
    return data

# ====================================
# Inventory API
# ====================================
@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    data = db.query(FactInventory).limit(5000).all()
    return data

# ====================================
# Delivery API
# ====================================
@app.get("/deliveries")
def get_deliveries(db: Session = Depends(get_db)):
    data = db.query(FactDelivery).limit(5000).all()
    return data

# ====================================
# Shipment API
# ====================================
@app.get("/shipments")
def get_shipments(db: Session = Depends(get_db)):
    data = db.query(FactShipments).limit(5000).all()
    return data

# ====================================
# KPI APIs
# ====================================
@app.get("/kpi/total_orders")
def kpi_total_orders(db: Session = Depends(get_db)):
    total = db.query(func.count(FactOrders.order_id)).scalar()
    return {"Total Orders": total}

@app.get("/kpi/total_revenue")
def kpi_total_revenue(db: Session = Depends(get_db)):
    total = db.query(func.sum(FactOrders.order_value)).scalar()
    return {"Total Revenue": total}

@app.get("/kpi/avg_order_value")
def kpi_avg_order_value(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactOrders.order_value)).scalar()
    return {"Average Order Value": round(avg, 2) if avg else 0}

@app.get("/kpi/total_deliveries")
def kpi_total_deliveries(db: Session = Depends(get_db)):
    total = db.query(func.count(FactDelivery.delivery_id)).scalar()
    return {"Total Deliveries": total}

@app.get("/kpi/avg_rating")
def kpi_avg_rating(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactDelivery.customer_rating)).scalar()
    return {"Average Customer Rating": round(avg, 2) if avg else 0}

@app.get("/kpi/total_shipments")
def kpi_total_shipments(db: Session = Depends(get_db)):
    total = db.query(func.count(FactShipments.shipment_id)).scalar()
    return {"Total Shipments": total}

@app.get("/kpi/total_inventory_events")
def kpi_total_inventory_events(db: Session = Depends(get_db)):
    total = db.query(func.count(FactInventory.inventory_event_id)).scalar()
    return {"Total Inventory Events": total}

@app.get("/kpi/total_vehicles")
def kpi_total_vehicles(db: Session = Depends(get_db)):
    total = db.query(func.count(FactFleet.vehicle_id)).scalar()
    return {"Total Vehicles": total}

# ====================================
# Analytics APIs
# ====================================
@app.get("/analytics/orders_by_region")
def orders_by_region(db: Session = Depends(get_db)):
    data = (
        db.query(FactOrders.region, func.count(FactOrders.order_id))
        .group_by(FactOrders.region)
        .all()
    )
    return [{"region": row[0], "orders": row[1]} for row in data]

@app.get("/analytics/orders_by_status")
def orders_by_status(db: Session = Depends(get_db)):
    data = (
        db.query(FactOrders.order_status, func.count(FactOrders.order_id))
        .group_by(FactOrders.order_status)
        .all()
    )
    return [{"status": row[0], "count": row[1]} for row in data]

@app.get("/analytics/revenue_by_region")
def revenue_by_region(db: Session = Depends(get_db)):
    data = (
        db.query(FactOrders.region, func.sum(FactOrders.order_value))
        .group_by(FactOrders.region)
        .all()
    )
    return [{"region": row[0], "revenue": float(row[1]) if row[1] else 0} for row in data]

# ====================================
# Warehouse / Inventory APIs
# ====================================
@app.get("/inventory/total_warehouses")
def inventory_total_warehouses(db: Session = Depends(get_db)):
    total = db.query(FactInventory.warehouse_id).distinct().count()
    return {"Total Warehouses": total}

@app.get("/inventory/avg_inventory")
def inventory_avg_inventory(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactInventory.inventory_level)).scalar()
    return {"Average Inventory": round(avg, 2) if avg else 0}

@app.get("/inventory/low_stock")
def inventory_low_stock(db: Session = Depends(get_db)):
    total = (
        db.query(FactInventory)
        .filter(FactInventory.inventory_level < 100)
        .count()
    )
    return {"Low Stock Products": total}

@app.get("/inventory/by_warehouse")
def inventory_by_warehouse(db: Session = Depends(get_db)):
    data = (
        db.query(FactInventory.warehouse_id, func.avg(FactInventory.inventory_level))
        .group_by(FactInventory.warehouse_id).limit(10)
        .all()
    )
    return [{"warehouse": row[0], "inventory": round(row[1], 2)} for row in data]

@app.get("/inventory/status")
def inventory_status(db: Session = Depends(get_db)):
    low_stock = (
        db.query(FactInventory)
        .filter(FactInventory.inventory_level < 100)
        .count()
    )
    total = db.query(FactInventory).count()
    return {"Low Stock": low_stock, "Normal Stock": total - low_stock}

@app.get("/inventory/alerts")
def inventory_alerts(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT *
        FROM inventory_alerts
        ORDER BY alert_id DESC
        LIMIT 20
    """)).mappings().all()
    return list(data)

# ====================================
# Fleet APIs
# ====================================
@app.get("/fleet/total_vehicles")
def fleet_total_vehicles(db: Session = Depends(get_db)):
    total = db.query(func.count(FactFleet.vehicle_id)).scalar()
    return {"Total Vehicles": total}

@app.get("/fleet/avg_fuel")
def fleet_avg_fuel(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactFleet.fuel_consumption)).scalar()
    return {
    "Average Fuel": round(avg, 2) if avg else 0
}

@app.get("/fleet/avg_delay")
def fleet_avg_delay(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactFleet.delay_minutes)).scalar()
    return {
    "Average Delay": round(avg, 2) if avg else 0
}
@app.get("/fleet/delay_analysis")
def fleet_delay_analysis(db: Session = Depends(get_db)):
    data = (
        db.query(FactFleet.vehicle_id, FactFleet.delay_minutes)
        .order_by(FactFleet.delay_minutes.desc())
        .limit(10)
        .all()
    )
    return [{"vehicle": row[0], "delay": row[1]} for row in data]

@app.get("/fleet/fuel_analysis")
def fleet_fuel_analysis(db: Session = Depends(get_db)):
    data = (
        db.query(FactFleet.vehicle_id, FactFleet.fuel_consumption)
        .order_by(FactFleet.fuel_consumption.desc())
        .limit(10)
        .all()
    )
    return [{"vehicle": row[0], "fuel": row[1]} for row in data]

@app.get("/fleet/maintenance")
def fleet_maintenance(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT
            ticket_id,
            vehicle_id,
            issue_description,
            created_at
        FROM maintenance_tickets
        ORDER BY ticket_id DESC
        LIMIT 20
    """))
    return [dict(row._mapping) for row in result]

# ====================================
# Suppliers APIs
# ====================================
@app.get("/supplier/total_suppliers")
def supplier_total_suppliers(db: Session = Depends(get_db)):
    total = db.execute(text("SELECT COUNT(*) FROM dim_supplier")).scalar()
    return {"Total Suppliers": total}

@app.get("/supplier/avg_rating")
def supplier_avg_rating(db: Session = Depends(get_db)):
    avg = db.execute(text("SELECT AVG(supplier_rating) FROM supplier_performance")).scalar()
    return {
    "Average Rating": round(avg, 2) if avg else 0
}

@app.get("/supplier/risk_count")
def supplier_risk_count(db: Session = Depends(get_db)):
    total = db.execute(text("SELECT COUNT(*) FROM supplier_risk_alerts")).scalar()
    return {"Risk Alerts": total}

@app.get("/supplier/top_ratings")
def supplier_top_ratings(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT supplier_id, supplier_rating
        FROM supplier_performance
        ORDER BY supplier_rating DESC
        LIMIT 10
    """))
    return [{"supplier": row.supplier_id, "rating": row.supplier_rating} for row in data]

@app.get("/supplier/alerts")
def supplier_alerts(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT
            alert_id,
            supplier_id,
            supplier_rating,
            alert_message,
            created_at
        FROM supplier_risk_alerts
        ORDER BY alert_id DESC
        LIMIT 20
    """))
    return [dict(row._mapping) for row in data]

# ====================================
# Delivery APIs
# ====================================
@app.get("/delivery/total_deliveries")
def delivery_total_deliveries(db: Session = Depends(get_db)):
    total = db.execute(text("SELECT COUNT(*) FROM fact_delivery")).scalar()
    return {"Total Deliveries": total}

@app.get("/delivery/avg_rating")
def delivery_avg_rating(db: Session = Depends(get_db)):
    avg = db.execute(text("SELECT AVG(customer_rating) FROM fact_delivery")).scalar()
    return {
    "Average Rating": round(avg, 2) if avg else 0
}

@app.get("/delivery/avg_cost")
def delivery_avg_cost(db: Session = Depends(get_db)):
    avg = db.execute(text("SELECT AVG(delivery_cost) FROM fact_delivery")).scalar()
    return {
    "Average Cost": round(avg, 2) if avg else 0
}

@app.get("/delivery/top_ratings")
def delivery_top_ratings(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT delivery_id, customer_rating
        FROM fact_delivery
        ORDER BY customer_rating DESC
        LIMIT 10
    """))
    return [{"delivery": row.delivery_id, "rating": row.customer_rating} for row in data]

@app.get("/delivery/alerts")
def delivery_alerts(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT *
        FROM delivery_alerts
        ORDER BY alert_id DESC
        LIMIT 20
    """))
    return [dict(row._mapping) for row in data]

# ====================================
# Shipments APIs
# ====================================
@app.get("/shipment/total_shipments")
def shipment_total_shipments(db: Session = Depends(get_db)):
    total = db.query(func.count(FactShipments.shipment_id)).scalar()
    return {"Total Shipments": total}

@app.get("/shipment/avg_customs_delay")
def shipment_avg_customs_delay(db: Session = Depends(get_db)):
    avg = db.query(func.avg(FactShipments.customs_delay)).scalar()
    return {
    "Average Delay": round(avg, 2) if avg else 0
}

@app.get("/shipment/incidents")
def shipment_incidents(db: Session = Depends(get_db)):
    total = db.execute(text("SELECT COUNT(*) FROM logistics_incidents")).scalar()
    return {"Incidents": total}

@app.get("/shipment/top_ports")
def shipment_top_ports(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT port_name, customs_delay
        FROM fact_shipments
        ORDER BY customs_delay DESC
        LIMIT 10
    """))
    return [{"port": row.port_name, "delay": row.customs_delay} for row in data]

@app.get("/shipment/alerts")
def shipment_alerts(db: Session = Depends(get_db)):
    data = db.execute(text("""
        SELECT *
        FROM logistics_incidents
        ORDER BY incident_id DESC
        LIMIT 20
    """))
    return [dict(row._mapping) for row in data]
