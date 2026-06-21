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
    "inventory_topic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for Inventory Data...")

for msg in consumer:

    data = msg.value

    sql = """
    INSERT INTO fact_inventory
    (
        inventory_event_id,
        warehouse_id,
        product_id,
        inventory_level
    )
    VALUES (%s,%s,%s,%s)
    """

    values = (
        data["inventory_event_id"],
        data["warehouse_id"],
        data["product_id"],
        data["inventory_level"]
    )

    try:
        cursor.execute(sql, values)
        conn.commit()
        print("Inserted:", data["inventory_event_id"])

    except Exception as e:
        print("DATABASE ERROR:", e)