// Initialize and add the map
var showTrafficLayer = false;
var showBikingLayer = false;
var showDirectionPanel = false;
var showBikeRoute = false;
var displayRoute;
var bikeRoute;
var carRoute;

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
    [30.6013654, -96.3543799]
  ];

  var iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: {
      lat: positions[13][0],
      lng: positions[13][1]
    }
  });
  directionsRenderer.setMap(map);
  if(showDirectionPanel){
    directionsRenderer.setPanel(document.getElementById("right-panel"));
  }

  var control = document.getElementById("floating-panel");
  control.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(30.5159362,-96.5171539),
    new google.maps.LatLng(30.7215865,-96.2252309)
  );
  var startAutocomplete = new google.maps.places.Autocomplete(document.getElementById('start'), {
    bounds: defaultBounds,
    strictBounds: true
  });

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  startAutocomplete.addListener("place_changed", function(){
    var endAutocomplete = new google.maps.places.Autocomplete(document.getElementById('end'), {
      bounds: defaultBounds,
      strictBounds: true
    });
    endAutocomplete.addListener("place_changed",onChangeHandler);
  });
  
  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: "BICYCLING"
      },
      function(response, status) {
        if (status === "OK") {
          bikeRoute = response;
          //directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: "DRIVING"
      },
      function(response, status) {
        if (status === "OK") {
          carRoute = response;
          directionsRenderer.setDirections(response);
          displayBikeSuggestion();
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  function displayBikeSuggestion(){
    var bikeTime = bikeRoute.routes[0].legs[0].duration;
    var carTime = carRoute.routes[0].legs[0].duration;
    if(carTime["value"] > bikeTime["value"]){
      $('#bikeMsg').text("Bike Route is: "+bikeTime["text"]+"Current route is: "+carTime["text"]);
    }
  }

  var parking = {
    url: iconBase + "parking_lot_maps.png",
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0)
  };

  var bike = {
    url: "cycling.png",
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0)
  };

  var markers = [];

  positions.forEach(function(position) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(position[0], position[1]),
      icon: parking,
      map: map,
      zindex: 10,
      visible: false
    });
    markers.push(marker);
  });

  google.maps.event.addListener(map, "zoom_changed", function() {
    var zoom = map.getZoom();
    for (i = 0; i < markers.length; i++) {
      markers[i].setVisible(zoom >= 15);
    }
  });

  // The bikes, shown on the map
  const url = "/bikes_near_zach.csv";
  const showMarkers = data => {
    const rows = data.split("\n");
    const header = rows[0];
    const markers = [];
    for (var i = 1; i < rows.length; i++) {
      const x = rows[i].split(",");
      const lock_open = parseInt(x[1]);
      if (lock_open) {
        const lat = parseFloat(x[2]);
        const lng = parseFloat(x[3]);

        markers.push(
          new google.maps.Marker({
            position: {
              lat,
              lng
            },
            map: map,
            icon: bike
          })
        );
      }
    }
    var markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
  };
  $('#showBikeRoute').click(()=>{
    showBikeRoute = !showBikeRoute;
    directionsRenderer.setDirections(showBikeRoute ? bikeRoute : carRoute);
  });
  $('#showDirections').click(()=>{
    showDirectionPanel = !showDirectionPanel;
    console.log("showDirections: ",showDirectionPanel);
  });
  $.get(url, showMarkers);
  // Show traffic
  var trafficLayer = new google.maps.TrafficLayer();
  $("#showTraffic").click(() => {
    showTrafficLayer = !showTrafficLayer;
    trafficLayer.setMap(showTrafficLayer ? map : null);
  });
  // Show bike layer
  var bikeLayer = new google.maps.BicyclingLayer();
  $("#showBikeLayer").click(() => {
    showBikingLayer = !showBikingLayer;
    if (showBikingLayer) {
      $("#bikeLayerInfo").text(
        'Dark green routes indicated dedicated bicycle routes. Light green routes indicate streets with dedicated "bike lanes." Dashed routes indicate streets or paths otherwise recommended for bicycle usage.'
      );
      bikeLayer.setMap(map);
    } else {
      $("#bikeLayerInfo").text(" ");
      bikeLayer.setMap(null);
    }
  });
  // Show current location
  var im = "http://www.robotwoods.com/dev/misc/bluecircle.png";
  navigator.geolocation.getCurrentPosition(
    position => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var myLatLng = new google.maps.LatLng(pos.lat, pos.lng);
      var userMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: im
      });
      map.setCenter(pos);
    },
    () => alert("navigator.geolocation failed, may not be supported")
  );
}
