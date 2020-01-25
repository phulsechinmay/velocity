from flask import Flask
import requests
import json

app = Flask(__name__)
auth = "AIzaSyCdqos0PqD7ozbyWxR-kLZwDSix4rhIoEM"

def getDriections(origins, destination, waypoints):
    url = "https://maps.googleapis.com/maps/api/directions/json?"

def getTravelTime(origin,destination,waypoints):
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
    headers = {
        "units": "imperial",
        "mode": "walking",
        "origins": origin,
        "destinations": destination,
        "waypoints" : waypoints,
        "key": auth
    }
    res = requests.get(url,params=headers)
    if(res.status_code == 200):
        res = res.json()
        duration = res["rows"][0]["elements"][0]["duration"]["text"]
        print("Travel Time: " + str(duration))
        return res
    else:
        print("DISTANCE MATRIX API ERROR")

if __name__ == "__main__":
    getTravelTime("2 Commons, Mosher Residence Hall, 725 Mosher Cir, College Station, TX 77840","Kyle Field","Sbisa Dining Hall, 233 Houston St, College Station, TX 77840")