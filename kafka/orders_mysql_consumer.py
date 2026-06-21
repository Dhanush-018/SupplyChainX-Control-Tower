from kafka import KafkaConsumer
import json
import pymysql

# MySQL Connection
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="password",
    database="supplychainx"
)

cursor = conn.cursor()

# Kafka Consumer
consumer = KafkaConsumer(
    "orders_topic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for Orders...")

for msg in consumer:

    data = msg.value

    sql = """
    INSERT INTO fact_orders
    (
        order_id,
        customer_id,
        product_id,
        order_date,
        order_value,
        order_status,
        delivery_priority,
        region,
        fulfillment_center
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        data["order_id"],
        data["customer_id"],
        data["product_id"],
        data["order_date"],
        data["order_value"],
        data["order_status"],
        data["delivery_priority"],
        data["region"],
        data["fulfillment_center"]
    )

    try:
        cursor.execute(sql, values)
        conn.commit()

        print("Inserted:", data["order_id"])

    except Exception as e:
        print("DATABASE ERROR:", e)