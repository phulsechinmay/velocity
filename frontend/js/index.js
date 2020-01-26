// Initialize and add the map
var showTrafficLayer = false
var showBikingLayer = false
var showDirectionPanel = true
var showBikeRoute = false
var displayRoute
var bikeRoute
var carRoute
var walkLeg
var bikeLeg

function initMap() {
  const positions = [
    [30.6229431, -96.3369853],
    [30.6223614, -96.3397319],
    [30.6212282, -96.3409694],
    [30.6191394, -96.341943],
    [30.6156478, -96.3366204],
    [30.6159756, -96.336159],
    [30.6164511, -96.33529],
    [30.6158048, -96.3345014],
    [30.6148843, -96.3344063],
    [30.6144688, -96.3350124],
    [30.6125103, -96.3332856],
    [30.6150441, -96.3380101],
    [30.6139279, -96.3397786],
    [30.6121273, -96.3430092],
    [30.6170188, -96.3431747],
    [30.6153488, -96.344815],
    [30.616624, -96.3457007],
    [30.6082132, -96.342778],
    [30.6109209, -96.3464543],
    [30.6107195, -96.3478894],
    [30.6117368, -96.3491777],
    [30.6122769, -96.3477472],
    [30.6072649, -96.3563267],
    [30.6076066, -96.3538161],
    [30.6054296, -96.3472921],
    [30.6051064, -96.346981],
    [30.6050603, -96.3491375],
    [30.6013654, -96.3543799],
  ]

  var iconBase =
    'https://developers.google.com/maps/documentation/javascript/examples/full/images/'
  var directionsService = new google.maps.DirectionsService()
  var directionsRenderer = new google.maps.DirectionsRenderer()
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: positions[13][0],
      lng: positions[13][1],
    },
  })
  directionsRenderer.setMap(map)

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(30.5159362, -96.5171539),
    new google.maps.LatLng(30.7215865, -96.2252309)
  )
  var onChangeHandler = function() {
    if (($('#start').val() !== '') & ($('#end').val() !== '')) {
      calculateAndDisplayRoute(directionsService, directionsRenderer)
    }
  }

  const startAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('start'),
    {
      bounds: defaultBounds,
      strictBounds: true,
    }
  )
  startAutocomplete.addListener('place_changed', onChangeHandler)

  const endAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('end'),
    {
      bounds: defaultBounds,
      strictBounds: true,
    }
  )
  endAutocomplete.addListener('place_changed', onChangeHandler)

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var start = document.getElementById('start').value
    var end = document.getElementById('end').value
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: 'BICYCLING',
      },
      function(response, status) {
        if (status === 'OK') {
          bikeRoute = response
          //directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
      },
      function(response, status) {
        if (status === 'OK') {
          carRoute = response
          directionsRenderer.setDirections(response)
          displayBikeSuggestion()
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
  }

  function displayBikeSuggestion() {
    var bikeTime = bikeRoute.routes[0].legs[0].duration
    var carTime = carRoute.routes[0].legs[0].duration
    $('#bikeMsg').text(
      'Bike route is: ' +
        bikeTime['text'])
    $("#currentMsg").text(
        'Current route is: ' +
        carTime['text']
    )
    $("#bike-better-popup").show();
  }

  function walkToBike(origin, bike, destination) {
    directionsService.route(
      {
        origin: origin,
        destination: bike,
        travelMode: 'WALKING',
      },
      function(response, status) {
        if (status === 'OK') {
          walkLeg = response
          //directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
    directionsService.route(
      {
        origin: bike,
        destination: destination,
        travelMode: 'BICYCLING',
      },
      function(response, status) {
        if (status === 'OK') {
          bikeLeg = response
          //directionsRenderer.setDirections(response);
          walkLeg.routes[0].legs.push(bikeLeg.routes[0].legs[0])
          walkLeg.routes[0].warnings.pop();
          directionsRenderer.setDirections(walkLeg)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
    
  }

  var parking = {
    url: iconBase + 'parking_lot_maps.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  }

  var bike = {
    url: 'cycling.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  }

  var stationMarkers = []

  positions.forEach(function(position) {
    stationMarkers.push(
      new google.maps.Marker({
        position: new google.maps.LatLng(position[0], position[1]),
        icon: parking,
        map: map,
        zindex: 10,
        visible: false,
      })
    )
  })

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoom = map.getZoom()
    for (i = 0; i < stationMarkers.length; i++) {
      stationMarkers[i].setVisible(zoom >= 15)
    }
  })
  // Function that gets called if you click bike marker
  const chooseBike = bikeMarker => {
    const pos = bikeMarker.getPosition();
    walkToBike($("#start").val(), pos.lat() + "," + pos.lng(), $("#end").val());
  }
  // Show bikes on map
  const showBikeMarkers = data => {
    const bikeMarkers = []
    for (var i = 1; i < data.length; i++) {
      const bike_data = data[i]
      const lock_open = bike_data.lockStatus
      if (lock_open) {
        const lat = bike_data.location.lat
        const lng = bike_data.location.lng
        const bikeMarker = new google.maps.Marker({
          position: {
            lat,
            lng,
          },
          map: map,
          icon: bike,
        })
        bikeMarker.addListener('click', () => chooseBike(bikeMarker))
        bikeMarkers.push(bikeMarker)
      }
    }
    new MarkerClusterer(map, bikeMarkers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      gridSize: 30,
      minimumClusterSize: 10,
    })
  }
  $('#showBikeRoute').click(() => {
    showBikeRoute = !showBikeRoute
    directionsRenderer.setDirections(showBikeRoute ? bikeRoute : carRoute)
    $("#bike-better-popup").hide();
  })

  $('#showDirections').click(() => {
    showDirectionPanel = !showDirectionPanel
    directionsRenderer.setPanel(
      showDirectionPanel ? document.getElementById('right-panel') : null
    )
  })
  directionsRenderer.setPanel(
    showDirectionPanel ? document.getElementById('right-panel') : null
  )
  // Show traffic
  var trafficLayer = new google.maps.TrafficLayer()
  $('#traffic-layer-checkbox').click(() => {
    showTrafficLayer = !showTrafficLayer
    trafficLayer.setMap(showTrafficLayer ? map : null)
  })
  // Show bike layer
  var bikeLayer = new google.maps.BicyclingLayer()
  $('#bike-path-checkbox').click(() => {
    showBikingLayer = !showBikingLayer
    if (showBikingLayer) {
      $('#bikeLayerInfo').text(
        'Dark green routes indicated dedicated bicycle routes. Light green routes indicate streets with dedicated "bike lanes." Dashed routes indicate streets or paths otherwise recommended for bicycle usage.'
      )
      bikeLayer.setMap(map)
    } else {
      $('#bikeLayerInfo').text(' ')
      bikeLayer.setMap(null)
    }
  })
  // Show current location
  var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png'
  navigator.geolocation.getCurrentPosition(
    position => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      var myLatLng = new google.maps.LatLng(pos.lat, pos.lng)
      new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: im,
      })
      map.setCenter(pos)
      // Get nearby bikes
      getNearbyBikes(pos.lat, pos.lng)
        .then(showBikeMarkers)
        .catch(alert)
      // Fill current location in start box
      $('#start').val(pos.lat.toFixed(5) + ',' + pos.lng.toFixed(5))
    },
    () => alert('navigator.geolocation failed, may not be supported')
  )
  // Clear start input box if user places cursor into box
  $('#start').click(() => $('#start').val(''))
}
