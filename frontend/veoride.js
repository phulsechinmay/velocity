const VEORIDE_PHONE_NUMBER = 9799858688
const VEORIDE_TOKEN = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxOjU1MzQiLCJpYXQiOjE1Nzk5OTUzMTgsImV4cCI6MTU4Nzc3MTMxOH0.NNuurt6awK2ub3Athx0AqlIVNzTiWhZo_Xdi6zlrGXqDSJ17H2UIHpR8jtCiWC_XXgkQSWvpEsqgcesaSVlSnQ"

function getNearbyBikes(lat, lng, userToken=VEORIDE_TOKEN) {
  params = {
    lat, lng, 
    user_token: userToken
  }
  axios.get(`${config.SERVER_URL}/api/veoride/get_nearby_bikes`, {params})
    .then(function (resp) {
      console.log(resp)
    })
}