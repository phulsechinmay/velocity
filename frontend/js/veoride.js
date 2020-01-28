function getNearbyBikes(lat, lng, userToken = config.VEORIDE_TOKEN) {
  return new Promise(function(resolve, reject) {
    params = {
      lat,
      lng,
      user_token: userToken,
      num_bikes: 100,
    }
    axios
      .get(`${config.SERVER_URL}/api/veoride/get_nearby_bikes`, { params })
      .then(function(resp) {
        if (resp.status != 200) {
          reject(resp.data.error)
        }
        resolve(resp.data.data)
      })
  })
}

function getNearbyStations(origin){
  console.log(origin)
  return new Promise(function(resolve, reject){
    params = {
      origin
    }
    axios
      .get(`${config.SERVER_URL}/api/veoride/get_nearby_stations`, {params})
      .then(function(resp){
        if(resp.status != 200){
          reject(resp.data.error)
        }
        resolve(resp.data.data)
      })
  })
}
