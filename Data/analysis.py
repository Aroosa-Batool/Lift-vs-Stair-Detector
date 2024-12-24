import pandas as pd
import json
from datetime import datetime
import matplotlib.pyplot as plt

# Load the JSON file
with open('c:/Users/batoo/Documents/Lift-vs-Stair-Detector/Data/Still.json') as file:
    data = json.load(file)

# Normalize MongoDB-style JSON to a usable format
records = []
for record in data:
    records.append({
        "pressure": record["pressure"],
        "altitude": record["altitude"],
        "acceleration_x": record["acceleration_x"],
        "acceleration_y": record["acceleration_y"],
        "acceleration_z": record["acceleration_z"],
        "timestamp": datetime.strptime(record["timestamp"]["$date"], "%Y-%m-%dT%H:%M:%S.%fZ"),
    })

# Convert to a Pandas DataFrame
df = pd.DataFrame(records)

# Preview the DataFrame
print(df.head())
print(df.describe())
plt.figure(figsize=(10, 6))
plt.plot(df['timestamp'], df['pressure'], label='Pressure')
plt.title('Pressure Over Time')
plt.xlabel('Timestamp')
plt.ylabel('Pressure (Pa)')
plt.legend()
plt.grid()
plt.show()

print("Correlation Matrix:")
print(df.corr())

# Heatmap
import seaborn as sns
plt.figure(figsize=(8, 6))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

plt.figure(figsize=(10, 6))
plt.plot(df['timestamp'], df['acceleration_x'], label='Acceleration X')
plt.plot(df['timestamp'], df['acceleration_y'], label='Acceleration Y')
plt.plot(df['timestamp'], df['acceleration_z'], label='Acceleration Z')
plt.title('Acceleration Over Time')
plt.xlabel('Timestamp')
plt.ylabel('Acceleration (m/s²)')
plt.legend()
plt.grid()
plt.show()
