from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'ds015995.mlab.com'
MONGODB_PORT = 15995
DBS_NAME = 'heroku_bqvpfh1t'
MONGO_URI = 'mongodb://root:95ke5312@ds015995.mlab.com:15995/heroku_bqvpfh1t'

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/api/austria")
def austrianGP():
    DBS_NAME = 'gp_finishes'
    COLLECTION_NAME = 'austria'
    FIELDS = {'Pos': True, 'No': True, 'Driver': True, 'Constructor': True, 'Laps': True, 'Grid': True, 'Time': True,
              'Status': True, 'Points': True, '_id': False}
    connection = MongoClient(MONGO_URI)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.  find(projection=FIELDS, limit=20000)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects)
    connection.close()
    return json_projects

@app.route("/api/qualy")
def poleposition():
    DBS_NAME = 'poleposition'
    COLLECTION_NAME = 'data'
    FIELDS = {'raceId': True, 'driverId': True, 'lap_time': True, 'surname': True, 'circuitId': True, 'date': True, 'Circuit': True, '_id': False}
    connection = MongoClient(MONGO_URI)
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
    DBS_NAME = 'fastestlap'
    COLLECTION_NAME = 'laptime'
    FIELDS = {'raceId': True, 'forename': True, 'min_lap_time': True, 'surname': True, 'circuitId': True, 'date': True, 'circuit': True, 'min_laptime': True, '_id': False}
    connection = MongoClient(MONGO_URI)
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
