const VEORIDE_PHONE_NUMBER = 9799858688
const VEORIDE_TOKEN =
  'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxOjU1MzQiLCJpYXQiOjE1Nzk5OTUzMTgsImV4cCI6MTU4Nzc3MTMxOH0.NNuurt6awK2ub3Athx0AqlIVNzTiWhZo_Xdi6zlrGXqDSJ17H2UIHpR8jtCiWC_XXgkQSWvpEsqgcesaSVlSnQ'

function getNearbyBikes(lat, lng, userToken = VEORIDE_TOKEN) {
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
  return new Promise(function(resolve, reject){
    params = {
      origin
    }
    axios
      .get(`${config.SERVER_URL}/api/veorider/get_nearby_stations`, {params})
      .then(function(resp){
        if(resp.status != 200){
          reject(resp.data.error)
        }
        resolve(resp.data.data)
      })
  })
}
