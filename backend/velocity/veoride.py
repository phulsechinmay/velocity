from velocity import app, constants
from flask import request, jsonify
import requests

@app.route(f"{constants.VEORIDE_ENDPOINT_PREFIX}/request_verification_code")
def veoride_request_verification_code():
  phone_number = request.args.get('phone_number')

  try:
    verification_code_resp = requests.get(f"{constants.VEORIDE_API_PREFIX}/auth/customers/{phone_number}/verification_code")
  except:
    return "Internal Server Error", 500

  if verification_code_resp.status_code != 200:
    return "There was an error with VeoRide", 500

  return "Verification code request sent", 200

@app.route(f"{constants.VEORIDE_ENDPOINT_PREFIX}/verify_code")
def veoride_verify_code():
  phone_number = request.args.get('phone_number')
  verification_code = request.args.get('verification_code')

  verify_code_body = {
      "phone": phone_number,
      "phoneModel": constants.VEORIDE_PHONE_MODEL,
      "appVersion": constants.VEORIDE_APP_VERSION,
      "code": verification_code,
  }
  verify_code_resp = requests.post(f"{constants.VEORIDE_API_PREFIX}/auth/customers/verify_code", json=verify_code_body)

  if verify_code_resp.status_code != 200:
    return jsonify({"error": "VeoRide verification failed."}), 401

  verify_code_resp_json = verify_code_resp.json()
  user_token = verify_code_resp_json['data']['jwtAuthentication']['tokenType'] + ' ' + verify_code_resp_json['data']['jwtAuthentication']['accessToken']

  return jsonify({"user_token": user_token}), 200


"""
origin: tuple of (lat, lng)
destinations: list of tuples of (lat, lng)
"""
def get_walking_travel_info(origin, destinations):
  encoded_destinations = "|".join([f"{lat},{lng}" for lat, lng in destinations])
  encoded_origin = f"{origin[0]},{origin[1]}"

  params = {
    "units": "imperial",
    "mode": "walking",
    "origins": encoded_origin,
    "destinations": encoded_destinations,
    "key": constants.GOOGLE_API_KEY
  }
  walking_info_resp = requests.get("https://maps.googleapis.com/maps/api/distancematrix/json?" ,params=params)
  
  if walking_info_resp.status_code != 200: return None

  walking_info = [{
    "distance": dest["distance"]["value"],
    "duration": dest["duration"]["value"]
  } for dest in walking_info_resp.json()["rows"][0]["elements"]]

  return walking_info


""" Returns: List of bikes and their data sorted by walking duration is ascending order
"""
@app.route(f"{constants.VEORIDE_ENDPOINT_PREFIX}/get_nearby_bikes")
def veoride_get_nearby_bikes():
  num_bikes = int(request.args.get('num_bikes'))
  if not num_bikes:
    num_bikes = constants.DEFAULT_NUM_BIKES

  user_token = request.args.get('user_token')
  lat = request.args.get('lat')
  lng = request.args.get('lng')

  headers = {
      "Authorization": user_token
  }
  bikes_result = requests.get(f"{constants.VEORIDE_API_PREFIX}/customers/vehicles?lat={lat}&lng={lng}", headers=headers)
  
  if bikes_result.status_code != 200:
    return jsonify({"error": "Error with fetching nearby bikes."}), 500

  bike_data = bikes_result.json()['data']
  # TODO: Check if bike data is sorted by distance from user
  if len(bike_data) > num_bikes:
    bike_data = bike_data[:num_bikes]

  bike_locations = [(bike['location']['lat'], bike['location']['lng']) for bike in bike_data]
  walking_travel_info = get_walking_travel_info((lat, lng), bike_locations)
  
  for i, travel_info in enumerate(walking_travel_info):
    bike_data[i]["walking_time"] = travel_info["duration"]

  bike_data.sort(key=lambda data: data["walking_time"])

  return jsonify({"data": bike_data}), 200

