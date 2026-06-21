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
    "delivery_topic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for Delivery Data...")

for msg in consumer:

    data = msg.value

    sql = """
    INSERT INTO fact_delivery
    (
        delivery_id,
        order_id,
        delivery_time,
        customer_rating,
        delivery_cost,
        delivery_status
    )
    VALUES (%s,%s,%s,%s,%s,%s)
    """

    values = (
        data["delivery_id"],
        data["order_id"],
        data["delivery_time"],
        data["customer_rating"],
        data["delivery_cost"],
        data["delivery_status"]
    )

    try:
        cursor.execute(sql, values)
        conn.commit()
        print("Inserted:", data["delivery_id"])

    except Exception as e:
        print("DATABASE ERROR:", e)