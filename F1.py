from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.getenv('MONGODB_URI')
DBS_NAME = os.getenv('MONGO_DB_NAME')

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/api/qualy")
def poleposition():

    COLLECTION_NAME = 'poleposition'
    FIELDS = {'raceId': True, 'driverId': True, 'lap_time': True, 'surname': True, 'circuitId': True, 'date': True, 'Circuit': True, '_id': False}
    connection = MongoClient(MONGODB_URI)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    data = collection.  find(projection=FIELDS, limit=20000)
    json_data = []
    for datum in data:
        json_data.append(datum)
    json_data = json.dumps(json_data)
    connection.close()
    return json_data

@app.route("/api/fastestlaps")
def fastestlap():

    COLLECTION_NAME = 'fastestlaptimes'
    FIELDS = {'raceId': True, 'forename': True, 'min_lap_time': True, 'surname': True, 'circuitId': True, 'date': True, 'circuit': True, 'min_laptime': True, '_id': False}
    connection = MongoClient(MONGODB_URI)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    laptimes = collection.  find(projection=FIELDS, limit=20000)
    json_laptimes = []
    for laptime in laptimes:
        json_laptimes.append(laptime)
    json_laptimes = json.dumps(json_laptimes)
    connection.close()
    return json_laptimes

if __name__ == '__main__':
    app.run(debug=True)
