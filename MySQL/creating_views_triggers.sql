USE supplychainx;
CREATE TABLE inventory_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    inventory_level INT,
    alert_message VARCHAR(255),
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE logistics_incidents (
    incident_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    delay_hours INT,
    incident_message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE supplier_risk_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    supplier_rating DECIMAL(3,2),
    alert_message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE maintenance_tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    issue_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE warehouse_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id INT,
    utilization DECIMAL(5,2),
    alert_message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- View Name: vw_supplychain_performance
-- Purpose: Stores region-wise total orders and total revenue.
CREATE VIEW vw_supplychain_performance AS
SELECT
    region,
    COUNT(order_id) total_orders,
    SUM(order_value) revenue
FROM fact_orders
GROUP BY region;


-- View Name: vw_fleet_intelligence
-- Purpose: Stores average fuel consumption and average delay for each vehicle.
CREATE VIEW vw_fleet_intelligence AS
SELECT
    vehicle_id,
    AVG(fuel_consumption) avg_fuel_consumption,
    AVG(delay_minutes) avg_delay_minutes
FROM fact_fleet
GROUP BY vehicle_id;


-- View Name: vw_warehouse_efficiency
-- Purpose: Stores warehouse utilization, picking time, and workforce efficiency metrics.
CREATE VIEW vw_warehouse_efficiency AS
SELECT
    warehouse_id,
    AVG(storage_utilization) avg_storage_utilization,
    AVG(picking_time) avg_picking_time,
    AVG(workforce_count) avg_workforce
FROM fact_warehouse
GROUP BY warehouse_id;


-- View Name: vw_delivery_performance
-- Purpose: Stores delivery performance statistics grouped by delivery status.
CREATE VIEW vw_delivery_performance AS
SELECT
    delivery_status,
    COUNT(delivery_id) total_deliveries,
    AVG(delivery_time) avg_delivery_time,
    AVG(customer_rating) avg_customer_rating,
    AVG(delivery_cost) avg_delivery_cost
FROM fact_delivery
GROUP BY delivery_status;

-- ---------------Procedures---------------

-- Procedure Name: sp_daily_supplychain_summary
-- Purpose: Returns total orders and overall revenue summary.
DELIMITER $$

CREATE PROCEDURE sp_daily_supplychain_summary()
BEGIN

SELECT
COUNT(*) total_orders,
SUM(order_value) revenue

FROM fact_orders;

END $$

DELIMITER ;

-- Procedure Name: sp_inventory_replenishment
-- Purpose: Returns inventory items with stock levels below 100.
DELIMITER $$

CREATE PROCEDURE sp_inventory_replenishment()
BEGIN

SELECT *
FROM fact_inventory
WHERE inventory_level < 100;

END $$

DELIMITER ;

-- Procedure Name: sp_route_optimization
-- Purpose: Returns average vehicle delays to support route optimization.
DELIMITER $$

CREATE PROCEDURE sp_route_optimization()
BEGIN

SELECT
vehicle_id,
AVG(delay_minutes) avg_delay

FROM fact_fleet
GROUP BY vehicle_id
ORDER BY avg_delay;

END $$

DELIMITER ;

-- Procedure Name: sp_supplier_scorecard
-- Purpose: Returns supplier performance scores based on ratings.
DELIMITER $$

CREATE PROCEDURE sp_supplier_scorecard()
BEGIN

SELECT
supplier_id,
AVG(supplier_rating) supplier_score

FROM fact_suppliers
GROUP BY supplier_id;

END $$

DELIMITER ;
-- Procedure Name: sp_supplychain_health
-- Purpose: Returns overall customer rating and delivery performance metrics.
DELIMITER $$

CREATE PROCEDURE sp_supplychain_health()
BEGIN

SELECT
AVG(customer_rating) avg_customer_rating,
AVG(delivery_time) avg_delivery_time

FROM fact_delivery;

END $$

DELIMITER ;

-- Procedure Name: sp_cost_optimization
-- Purpose: Returns average delivery cost for cost analysis.
DELIMITER $$

CREATE PROCEDURE sp_cost_optimization()
BEGIN

SELECT
AVG(delivery_cost) avg_delivery_cost

FROM fact_delivery;

END $$

DELIMITER ;

-- Procedure Name: sp_supplier_scorecard
-- Purpose: Returns average supplier ratings grouped by supplier.
DELIMITER $$

CREATE PROCEDURE sp_supplier_scorecard()
BEGIN

SELECT
supplier_id,
AVG(supplier_rating) supplier_score

FROM fact_supplier
GROUP BY supplier_id;

END $$

DELIMITER ;

-- --------------------Triggers-----------
-- Trigger Name: trg_low_inventory
-- Purpose: Generates a low inventory alert when stock falls below 100.
DELIMITER $$

CREATE TRIGGER trg_low_inventory
AFTER INSERT ON fact_inventory
FOR EACH ROW
BEGIN

IF NEW.inventory_level < 100 THEN

INSERT INTO inventory_alerts
(
product_id,
inventory_level,
alert_message
)

VALUES
(
NEW.product_id,
NEW.inventory_level,
'Low Inventory Alert'
);

END IF;

END $$

DELIMITER ;

-- Trigger Name: trg_delivery_delay
-- Purpose: Generates an alert when delivery time exceeds 72 hours.
DELIMITER $$

CREATE TRIGGER trg_delivery_delay
AFTER INSERT ON fact_delivery
FOR EACH ROW
BEGIN

IF NEW.delivery_time > 72 THEN

INSERT INTO delivery_alerts
(
order_id,
delivery_time,
alert_message
)

VALUES
(
NEW.order_id,
NEW.delivery_time,
'Delivery Delay Alert'
);

END IF;

END $$

DELIMITER ;

-- Trigger Name: trg_supplier_risk
-- Purpose: Generates a risk alert for suppliers with rating below 3.
DELIMITER $$

CREATE TRIGGER trg_supplier_risk
AFTER INSERT ON fact_supplier
FOR EACH ROW
BEGIN

IF NEW.supplier_rating < 3 THEN

INSERT INTO supplier_risk_alerts
(
supplier_id,
supplier_rating,
alert_message
)

VALUES
(
NEW.supplier_id,
NEW.supplier_rating,
'Supplier Risk Alert'
);

END IF;

END $$

DELIMITER ;

-- ----------------Materlized Views-------------
-- Materialized View Name: mv_regional_summary
-- Purpose: Stores precomputed regional order counts and revenue totals.
CREATE TABLE mv_regional_summary AS
SELECT
region,
COUNT(*) total_orders,
SUM(order_value) revenue
FROM fact_orders
GROUP BY region;

-- Materialized View Name: mv_warehouse_summary
-- Purpose: Stores precomputed warehouse utilization statistics.
CREATE TABLE mv_warehouse_summary AS
SELECT
warehouse_id,
AVG(storage_utilization) utilization
FROM fact_warehouse
GROUP BY warehouse_id;

-- Materialized View Name: mv_fleet_summary
-- Purpose: Stores precomputed vehicle fuel consumption statistics.
CREATE TABLE mv_fleet_summary AS
SELECT
vehicle_id,
AVG(fuel_consumption) fuel_consumption
FROM fact_fleet
GROUP BY vehicle_id;

-- Materialized View Name: mv_delivery_summary
-- Purpose: Stores precomputed average delivery time by delivery status.
CREATE TABLE mv_delivery_summary AS
SELECT
delivery_status,
AVG(delivery_time) avg_delivery_time
FROM fact_delivery
GROUP BY delivery_status;
-- --------------------------Insering some records for triggers--------------------
use supplychainx;
INSERT INTO inventory_alerts
(product_id, inventory_level, alert_message)
VALUES
(1001,45,'Low Inventory Alert'),
(1002,22,'Low Inventory Alert'),
(1003,78,'Low Inventory Alert'),
(1004,35,'Low Inventory Alert'),
(1005,15,'Low Inventory Alert');

INSERT INTO supplier_risk_alerts
(supplier_id, supplier_rating, alert_message)
VALUES
(501,2.4,'Supplier Risk Alert'),
(502,1.8,'Supplier Risk Alert'),
(503,2.9,'Supplier Risk Alert');

INSERT INTO warehouse_alerts
(warehouse_id, utilization, alert_message)
VALUES
(101,96.5,'Warehouse Capacity Critical'),
(102,94.2,'Warehouse Capacity Warning'),
(103,98.1,'Warehouse Capacity Critical');

INSERT INTO maintenance_tickets
(vehicle_id, issue_description)
VALUES
(1001,'Engine Overheating'),
(1002,'Brake Inspection Required'),
(1003,'Oil Leakage Detected'),
(1004,'Tire Replacement Required');

INSERT INTO maintenance_tickets
(vehicle_id, issue_description)
VALUES
(1001,'Engine Overheating'),
(1002,'Brake Inspection Required'),
(1003,'Oil Leakage Detected'),
(1004,'Tire Replacement Required');

INSERT INTO logistics_incidents
(order_id, delay_hours, incident_message)
VALUES
(2001,18,'Port Congestion'),
(2002,24,'Weather Delay'),
(2003,12,'Customs Hold'),
(2004,36,'Route Disruption');
INSERT INTO delivery_alerts
(order_id, delivery_time, alert_message)

VALUES
('Ord1001', 220, 'Delayed Delivery'),

('Ord1002', 240, 'Delayed Delivery'),

('Ord1003', 260, 'Critical Delay');


SELECT * FROM maintenance_tickets LIMIT 5;
SELECT * FROM supplier_risk_alerts LIMIT 5;
SELECT * FROM supplier_performance LIMIT 5;
SELECT * FROM delivery_alerts LIMIT 5;
SELECT * FROM fact_delivery LIMIT 5;
SELECT * FROM logistics_incidents LIMIT 5;
SELECT * FROM fact_shipments LIMIT 5;
SELECT COUNT(*) FROM fact_orders;
SELECT * FROM inventory_alerts;
INSERT INTO fact_inventory
(
    alert_id,
    product_id,
    inventory_level,
    alert_message,
    alert_date
)
VALUES
(
    'WH_TEST',
    'P_TEST',
    50
);
INSERT INTO fact_inventory
(
    warehouse_id,
    product_id,
    inventory_level
)
VALUES
(
    'WH_TEST',
    '9999',
    50
);
INSERT INTO fact_inventory
(
    warehouse_id,
    product_id,
    inventory_level
)
VALUES
(
    'WH_TEST',
    '9979',
    50
);