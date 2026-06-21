# SupplyChainX Control Tower

SupplyChainX is a Real-Time Supply Chain Analytics Platform designed to provide end-to-end visibility across supply chain operations. The platform integrates Data Engineering, Data Warehousing, Business Intelligence, Backend APIs, Frontend Dashboards, and Real-Time Streaming into a single enterprise solution.

The system centralizes data related to Orders, Inventory, Warehouses, Fleet Operations, Suppliers, Deliveries, and Shipments, enabling organizations to monitor key performance indicators, track operational efficiency, identify risks, and support data-driven decision-making.

The project follows a complete data pipeline architecture. Raw datasets are extracted, cleaned, transformed, and loaded into a MySQL Data Warehouse using Python, Pandas, and SQLAlchemy. A Star Schema design with Fact and Dimension tables is implemented to support analytical queries and reporting.

Advanced database objects such as Views, Stored Procedures, Materialized Summary Tables, and Triggers are used to automate business logic and generate alerts for critical events including low inventory levels, supplier risks, and operational exceptions.

FastAPI is used to build REST APIs that expose KPIs, analytics, and monitoring information. These APIs are consumed by a custom React-based SupplyChainX Control Tower that provides interactive dashboards, KPI cards, charts, and alert monitoring modules.

Apache Kafka is integrated to simulate real-time event streaming. Producers generate supply chain events, consumers process them, and the data is automatically loaded into MySQL, enabling near real-time monitoring and dashboard updates.

## Key Features

* End-to-End Supply Chain Visibility
* Data Warehouse with Star Schema Architecture
* ETL Pipeline using Python and Pandas
* FastAPI REST API Development
* React-Based Enterprise Control Tower
* Interactive KPI Dashboards and Charts
* Apache Kafka Real-Time Streaming
* SQL Triggers and Automated Alert Generation
* Power BI Business Intelligence Dashboards
* Warehouse, Fleet, Supplier, Delivery, and Shipment Monitoring

## Technology Stack

Frontend:

* React
* Vite
* Axios
* React Router
* Recharts

Backend:

* FastAPI
* SQLAlchemy
* Uvicorn

Database:

* MySQL

Data Engineering:

* Python
* Pandas
* NumPy

Streaming:

* Apache Kafka


Business Intelligence:

* Power BI

This project demonstrates the complete lifecycle of a modern data-driven enterprise application, from data ingestion and warehousing to real-time analytics and visualization.
