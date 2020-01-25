from velocity import app
from flask import request, jsonify
import requests

ENDPOINT_PREFIX = "/api/veoride"
VEORIDE_HOST = "manhattan-host.veoride.com"
VEORIDE_PORT = 8444
VEORIDE_API_PREFIX = f"https://{VEORIDE_HOST}:{VEORIDE_PORT}/api"

VEORIDE_PHONE_MODEL = "iPhone XR"
VEORIDE_APP_VERSION = "2.2.1"

DEFAULT_NUM_BIKES = 30

@app.route(f"{ENDPOINT_PREFIX}/request_verification_code")
def veoride_request_verification_code():
  phone_number = request.args.get('phone_number')

  try:
    verification_code_resp = requests.get(f"{VEORIDE_API_PREFIX}/auth/customers/{phone_number}/verification_code")
  except:
    return "Internal Server Error", 500

  if verification_code_resp.status_code != 200:
    return "There was an error with VeoRide", 500

  return "Verification code request sent", 200

@app.route(f"{ENDPOINT_PREFIX}/verify_code")
def veoride_verify_code():
  phone_number = request.args.get('phone_number')
  verification_code = request.args.get('verification_code')

  verify_code_body = {
      "phone": phone_number,
      "phoneModel": VEORIDE_PHONE_MODEL,
      "appVersion": VEORIDE_APP_VERSION,
      "code": verification_code,
  }
  verify_code_resp = requests.post(f"{VEORIDE_API_PREFIX}/auth/customers/verify_code", json=verify_code_body)

  if verify_code_resp.status_code != 200:
    return jsonify({"error": "VeoRide verification failed."}), 401

  verify_code_resp_json = verify_code_resp.json()
  user_token = verify_code_resp_json['data']['jwtAuthentication']['tokenType'] + ' ' + verify_code_resp_json['data']['jwtAuthentication']['accessToken']

  return jsonify({"user_token": user_token}), 200

@app.route(f"{ENDPOINT_PREFIX}/get_nearby_bikes")
def veoride_get_nearby_bikes():
  num_bikes = request.args.get('num_bikes')
  if not num_bikes:
    num_bikes = DEFAULT_NUM_BIKES

  user_token = request.args.get('user_token')
  lat = request.args.get('lat')
  lng = request.args.get('lng')

  headers = {
      "Authorization": user_token
  }

  bikes_result = requests.get(f"{VEORIDE_API_PREFIX}/customers/vehicles?lat={lat}&lng={lng}", headers=headers)
  
  if bikes_result.status_code != 200:
    return jsonify({"error": "Error with fetching nearby bikes."}), 500

  bike_data = bikes_result.json()['data']
  # TODO: Check if bike data is sorted by distance from user
  if len(bike_data) > num_bikes:
    bike_data = bike_data[:num_bikes]

  return jsonify({"data": bike_data}), 200

