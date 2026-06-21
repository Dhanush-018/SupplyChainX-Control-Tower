from sqlalchemy import *
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class FactOrders(Base):
    __tablename__ = "fact_orders"

    order_id = Column(Integer, primary_key=True)
    customer_id = Column(String(50))
    product_id = Column(String(50))
    order_value = Column(Float)
    region = Column(String(100))
    order_status = Column(String(50))


class FactFleet(Base):
    __tablename__ = "fact_fleet"

    vehicle_id = Column(String(50), primary_key=True)
    driver_id = Column(String(50))
    fuel_consumption = Column(Float)
    delay_minutes = Column(Float)


class FactInventory(Base):
    __tablename__ = "fact_inventory"

    inventory_event_id = Column(Integer, primary_key=True)
    warehouse_id = Column(String(50))
    product_id = Column(String(50))
    inventory_level = Column(Integer)


class FactDelivery(Base):
    __tablename__ = "fact_delivery"

    delivery_id = Column(Integer, primary_key=True)
    order_id = Column(Integer)
    delivery_status = Column(String(50))
    customer_rating = Column(Float)


class FactShipments(Base):
    __tablename__ = "fact_shipments"

    shipment_id = Column(Integer, primary_key=True)
    port_name = Column(String(100))
    customs_delay = Column(Float)
    shipment_status = Column(String(50))
  