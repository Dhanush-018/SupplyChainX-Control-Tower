# SupplyChainX Control Tower

## Project Overview

SupplyChainX is an Enterprise Supply Chain Analytics Platform that combines Data Engineering, Data Warehousing, Business Intelligence, Real-Time Streaming, Backend APIs, and Interactive Dashboards into a single solution.

The platform provides end-to-end visibility across:

- Orders
- Inventory
- Warehouses
- Fleet
- Suppliers
- Deliveries
- Shipments

It supports KPI monitoring, automated alerts, real-time Kafka streaming, and interactive analytics dashboards.

---

## Problem Statement

Modern supply chain systems generate large volumes of operational data from multiple sources. Monitoring inventory, deliveries, fleet performance, supplier risks, and shipments manually is difficult and often results in delayed decision-making.

SupplyChainX solves this challenge by providing a centralized Control Tower that integrates data, automates monitoring, generates alerts, and visualizes key business metrics.

---

## Project Architecture

Dataset
↓
Python ETL
↓
MySQL Data Warehouse
↓
Views / Procedures / Triggers
↓
FastAPI Backend
↓
Power BI Dashboards
↓
React Control Tower
↓
Apache Kafka Streaming
↓
Real-Time Monitoring

---

## Technology Stack

### Data Engineering

- Python
- Pandas
- NumPy

### Database

- MySQL
- SQLAlchemy

### Backend

- FastAPI
- Uvicorn

### Frontend

- React
- Vite
- Axios
- React Router
- Recharts

### Business Intelligence

- Power BI

### Real-Time Streaming

- Apache Kafka
- Zookeeper

---

## Key Features

### Data Warehouse

- Star Schema Design
- Fact Tables
- Dimension Tables

### Analytics

- Revenue Analysis
- Inventory Analysis
- Fleet Monitoring
- Supplier Performance
- Delivery Monitoring
- Shipment Intelligence

### Automation

- SQL Triggers
- Alert Generation
- Risk Monitoring

### Real-Time Streaming

- Kafka Producers
- Kafka Consumers
- MySQL Integration

### Dashboards

- Dashboard Overview
- Warehouse Intelligence
- Fleet Intelligence
- Supplier Intelligence
- Delivery Intelligence
- Shipment Intelligence

---

## Kafka Architecture

Producer
↓
Kafka Topic
↓
Consumer
↓
MySQL
↓
FastAPI
↓
React Dashboard

---

## Folder Structure

```text
SupplyChainXMain
│
├── API
├── frontend
├── kafka
├── MySQL
└── Screenshots
```

---

## Installation

### Backend

```bash
cd API
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Kafka

Start Zookeeper

```bash
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
```

Start Kafka

```bash
bin\windows\kafka-server-start.bat config\server.properties
```

Run Consumer

```bash
python orders_mysql_consumer.py
```

Run Producer

```bash
python orders_csv_producer.py
```

---

## Screenshots

Dashboard screenshots are available in the Screenshots folder.

---

## Future Enhancements

- Docker Deployment
- Kubernetes Scaling
- Databricks Integration
- AWS Cloud Deployment
- Real-Time Auto Refresh
- Machine Learning Forecasting

---

## Author

Dhanush T

B.E. Computer Science & Engineering

SupplyChainX - Real-Time Supply Chain Analytics Platform