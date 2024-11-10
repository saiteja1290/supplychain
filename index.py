# seed_database.py
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB connection URI
MONGODB_URI = ""

# Sample data
suppliers_data = [
    {
        "supplierName": "Tech Components Ltd",
        "avgDeliveryTime": 2.5,
        "orderAccuracy": 95
    },
    {
        "supplierName": "Global Electronics",
        "avgDeliveryTime": 3.2,
        "orderAccuracy": 88
    },
    {
        "supplierName": "FastTrack Logistics",
        "avgDeliveryTime": 1.8,
        "orderAccuracy": 92
    },
    {
        "supplierName": "Quality Parts Co",
        "avgDeliveryTime": 4.1,
        "orderAccuracy": 85
    },
    {
        "supplierName": "Reliable Supplies",
        "avgDeliveryTime": 2.9,
        "orderAccuracy": 91
    }
]

inventory_data = [
    {
        "productName": "CPU i7 11th Gen",
        "currentStock": 45,
        "lowStockThreshold": 20
    },
    {
        "productName": "16GB DDR4 RAM",
        "currentStock": 15,
        "lowStockThreshold": 30
    },
    {
        "productName": "1TB SSD Drive",
        "currentStock": 75,
        "lowStockThreshold": 25
    },
    {
        "productName": "Gaming Monitor 27\"",
        "currentStock": 12,
        "lowStockThreshold": 15
    },
    {
        "productName": "Mechanical Keyboard",
        "currentStock": 28,
        "lowStockThreshold": 20
    },
    {
        "productName": "Wireless Mouse",
        "currentStock": 8,
        "lowStockThreshold": 25
    }
]

# Generate random order IDs
def generate_order_id():
    return f"ORD{random.randint(1000, 9999)}"

# Generate random dates within the last 30 days
def random_date():
    days_ago = random.randint(0, 30)
    return datetime.now() - timedelta(days=days_ago)

# Generate fulfillment data
fulfillment_data = [
    {
        "orderId": generate_order_id(),
        "status": random.choice(["Pending", "Shipped", "Delivered"]),
        "lastUpdated": random_date()
    } for _ in range(15)  # Generate 15 orders
]

def seed_database():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGODB_URI)
        db = client.supply_chain  # database name
        
        # Clear existing collections
        db.suppliers.delete_many({})
        db.inventory.delete_many({})
        db.fulfillment.delete_many({})
        
        # Insert suppliers data
        result_suppliers = db.suppliers.insert_many(suppliers_data)
        print(f"Inserted {len(result_suppliers.inserted_ids)} suppliers")
        
        # Insert inventory data
        result_inventory = db.inventory.insert_many(inventory_data)
        print(f"Inserted {len(result_inventory.inserted_ids)} inventory items")
        
        # Insert fulfillment data
        result_fulfillment = db.fulfillment.insert_many(fulfillment_data)
        print(f"Inserted {len(result_fulfillment.inserted_ids)} orders")
        
        # Create indexes for better query performance
        db.suppliers.create_index("supplierName", unique=True)
        db.inventory.create_index("productName", unique=True)
        db.fulfillment.create_index("orderId", unique=True)
        
        print("\nDatabase seeded successfully!")
        
        # Print sample data for verification
        print("\nSample data verification:")
        print("\nSuppliers:")
        print(db.suppliers.find_one())
        print("\nInventory:")
        print(db.inventory.find_one())
        print("\nFulfillment:")
        print(db.fulfillment.find_one())
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_database()
