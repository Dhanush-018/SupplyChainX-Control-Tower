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
    "fleet_topic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for Fleet Data...")

for msg in consumer:

    data = msg.value

    sql = """
    INSERT INTO fact_fleet
    (
        vehicle_id,
        driver_id,
        fuel_consumption,
        delay_minutes,
        route_status,
        timestamp
    )
    VALUES (%s,%s,%s,%s,%s,%s)
    """

    values = (
        data["vehicle_id"],
        data["driver_id"],
        data["fuel_consumption"],
        data["delay_minutes"],
        data["route_status"],
        data["timestamp"]
    )

    try:
        cursor.execute(sql, values)
        conn.commit()
        print("Inserted:", data["vehicle_id"])

    except Exception as e:
        print("DATABASE ERROR:", e)