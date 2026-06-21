from kafka import KafkaConsumer
import json
import pymysql

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="password",
    database="supplychainx"
)

cursor = conn.cursor()

consumer = KafkaConsumer(
    "shipment_topic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for Shipment Data...")

for msg in consumer:

    data = msg.value

    sql = """
    INSERT INTO fact_shipments
    (
        shipment_id,
        port_name,
        container_count,
        customs_delay,
        shipment_status
    )
    VALUES (%s,%s,%s,%s,%s)
    """

    values = (
        data["shipment_id"],
        data["port_name"],
        data["container_count"],
        data["customs_delay"],
        data["shipment_status"]
    )

    try:
        cursor.execute(sql, values)
        conn.commit()
        print("Inserted:", data["shipment_id"])

    except Exception as e:
        print("DATABASE ERROR:", e)
        