create database supplychainX2;
use supplychainx2;
SELECT COUNT(*) FROM orders_small;
select count(*) from delivery_events;
select count(*) from fleet_gps_tracking;
select count(*) from inventory_movement;
select count(*) from orders_data;
select count(*) from port_shipment_operations;
select count(*) from supplier_performance;
select count(*) from warehouse_operations;
CREATE TABLE dim_time AS
SELECT DISTINCT
    order_date AS full_date,
    YEAR(order_date) AS year,
    MONTH(order_date) AS month,
    DAY(order_date) AS day
FROM orders_data;

CREATE TABLE dim_region AS
SELECT DISTINCT
    region
FROM orders_data;

CREATE TABLE dim_product AS
SELECT DISTINCT
    product_id
FROM orders_data;

CREATE TABLE dim_warehouse AS
SELECT DISTINCT
    warehouse_id
FROM warehouse_operations;

CREATE TABLE dim_supplier AS
SELECT DISTINCT
    supplier_id,
    product_category,
    region
FROM supplier_performance;


CREATE TABLE fact_orders1 AS
SELECT
    order_id,
    customer_id,
    product_id,
    order_date,
    order_value,
    order_status,
    delivery_priority,
    region
FROM orders_data;

ALTER TABLE fact_orders
ADD fulfillment_center VARCHAR(100);
UPDATE fact_orders fo
JOIN orders_data o
ON fo.order_id = o.order_id
SET fo.fulfillment_center = o.fulfillment_center;

CREATE TABLE fact_warehouse AS
SELECT
    warehouse_id,
    product_id,
    inbound_quantity,
    outbound_quantity,
    storage_utilization,
    picking_time,
    workforce_count,
    timestamp
FROM warehouse_operations;

CREATE TABLE fact_fleet AS
SELECT
    vehicle_id,
    driver_id,
    fuel_consumption,
    delay_minutes,
    route_status,
    timestamp
FROM fleet_gps_tracking;

CREATE TABLE fact_suppliers AS
SELECT
    supplier_id,
    delivery_delay,
    defect_rate,
    procurement_cost,
    supplier_rating
FROM supplier_performance;

CREATE TABLE fact_inventory AS
SELECT
    inventory_event_id,
    warehouse_id,
    product_id,
    inventory_level
FROM inventory_movement;

CREATE TABLE fact_delivery AS
SELECT
    delivery_id,
    order_id,
    delivery_time,
    customer_rating,
    delivery_cost,
    delivery_status
FROM delivery_events;

CREATE TABLE fact_shipments AS
SELECT
    shipment_id,
    port_name,
    container_count,
    customs_delay,
    shipment_status
FROM port_shipment_operations;

use supplychainx2;
show tables;

