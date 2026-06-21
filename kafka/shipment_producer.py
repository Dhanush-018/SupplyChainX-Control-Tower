from kafka import KafkaProducer
import pandas as pd
import json
import time

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8')
)

df = pd.read_csv(
    r"C:\Users\DELL\Downloads\cleaned_datasets\port_shipment_operations_cleaned.csv"
)

for _, row in df.iterrows():

    producer.send(
        "shipment_topic",
        row.to_dict()
    )

    print("Sent:", row["shipment_id"])

    time.sleep(20)

producer.flush()

print("Shipment Streaming Completed")