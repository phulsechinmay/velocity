import requests
import time

host = "manhattan-host.veoride.com"
port = 8444
output_file = "bike_data.csv"

def request_verification_code(phonenumber):
    loginurl = f"https://{host}:{port}/api/auth/customers/{phonenumber}/verification_code"

    result = requests.get(loginurl)

    return result

def verify_code(phonenumber, code, phoneModel="iPhone XR"):
    appversion = "2.2.1"
    verifyurl = f"https://{host}:{port}/api/auth/customers/verify_code"
    body = {
        "phone": phonenumber,
        "phoneModel": phoneModel,
        "appVersion": appversion,
        "code": code,
    }
    result = requests.post(verifyurl, json=body)
    return result

def bikes_nearby(accesstoken, lat, lng):
    nearbyurl = f"https://{host}:{port}/api/customers/vehicles?lat={lat}&lng={lng}"
    headers = {
        "Authorization": token
    }

    result = requests.get(nearbyurl, headers=headers)
    return result

def get_bike_data(token, lat, long):
  print("Getting bikes for location:")
  print(lat)
  print(lon)

  result = bikes_nearby(token, lat, lon)
  if result.status_code != 200:
      print("Failed to fetch bikes!")
      exit()
  json = result.json() 
  list = json['data']
  bike_data = []
  for bike in list:
      print(f"Now monitoring {bike['vehicleNumber']}; lock status: {bike['lockStatus']}; location: {bike['location']['lat']}, {bike['location']['lng']}")
      bike_data.append(bike)

  return bike_data

if __name__ == "__main__":
  phone = input("What is the phone number? ")
  result = request_verification_code(phone)
  code = input("What is the verification code? ")
  result = verify_code(phone, code)
  json = result.json()
  if result.status_code != 200:
      print ("failure!")
      exit()
  token = json['data']['jwtAuthentication']['tokenType'] + ' ' + json['data']['jwtAuthentication']['accessToken']

  try:
      lat = float(input("What is your latitude? (Default location is ZACH)"))
      lon = float(input("What is your longitude?"))
  except:
      lat, lon = 30.621483,-96.339980 # Default is ZACH

  bike_data = get_bike_data(token, lat, lon)
  output = ["bike_id, lock_status, lat, lon"]
  for bike in bike_data:
    output.append(f"{bike['vehicleNumber']}, {bike['lockStatus']}, {bike['location']['lat']}, {bike['location']['lng']}")
  
  with open(output_file, 'w+') as fp:
    fp.write('\n'.join(output))