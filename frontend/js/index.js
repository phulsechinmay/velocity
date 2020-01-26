// Initialize and add the map
var showTrafficLayer = false;
var showBikingLayer = false;
var showDirectionPanel = true;
var closestStation = false
var displayRoute;
var bikeRoute;
var carRoute;
var walkLeg;
var bikeLeg;
var currentRoute;
var currentPosition;

const getStartLocation = () => currentPosition || $('#start').val();

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
    [30.621442045000038, -96.32601518599995],
    [30.621996771000056, -96.32675938399996],
    [30.62263788300004, -96.32794504899994],
    [30.624849509000057, -96.33100961699995],
    [30.625649774000067, -96.32991544599997],
    [30.62649400600003, -96.33095225999995],
    [30.627921713000035, -96.33368736499995],
    [30.627614251000068, -96.32781538999996],
    [30.628183299000057, -96.32771405999995],
    [30.626333551000073, -96.31929366199995],
    [30.61949730400005, -96.34944070499995],
    [30.61976334800005, -96.34976444499995],
    [30.54680071200005, -96.24390004799994],
    [30.619523352000044, -96.34567805599994],
    [30.566894080000054, -96.31543346999996],
    [30.608838496000033, -96.30805210899996],
    [30.619230793000042, -96.34467513799996],
    [30.61935430500006, -96.34452714599996],
    [30.57791360400006, -96.28125173599994],
    [30.633188920000066, -96.33068857099994],
    [30.567327915000078, -96.30577230299997],
    [30.609555595000074, -96.32164046499997],
    [30.608148481000057, -96.28929937099997],
    [30.636917372000028, -96.30538515999996],
    [30.61707780300003, -96.32076987899995],
    [30.617494917000045, -96.32029753499995],
    [30.63408740500006, -96.32613066099998],
    [30.635890962000076, -96.32364718099996],
    [30.599477336000064, -96.30392713599997],
    [30.610922994000077, -96.31311681999995],
    [30.618989932000034, -96.34634970999997],
    [30.600112453000065, -96.30459655199996],
    [30.617223117000037, -96.32300804899995],
    [30.616983963000052, -96.32268652799996],
    [30.616813078000064, -96.32243844599998],
    [30.617543848000025, -96.32340661699999],
    [30.630782973000066, -96.33201921199998],
    [30.628495808000025, -96.33385129199996],
    [30.617900010000028, -96.29615741699996],
    [30.635799793000047, -96.32442779399997],
    [30.594613070000037, -96.29296847799998],
    [30.602313292000076, -96.33888582899999],
    [30.577080358000046, -96.28057557199998],
    [30.62343469500007, -96.29952854699997],
    [30.619396708000068, -96.34678197399995],
    [30.61234752400003, -96.31623396599997],
    [30.616464199000063, -96.31951316899995],
    [30.622314638000034, -96.34149647199996],
    [30.57030682900006, -96.26660908499997],
    [30.577360825000028, -96.28071778199995],
    [30.616739702000075, -96.34907520799999],
    [30.62777320500004, -96.30292033499995],
    [30.61509282800006, -96.31587262499994],
    [30.635594945000037, -96.30265936099994],
    [30.617921120000062, -96.32361002699997],
    [30.613891326000044, -96.31816084599996],
    [30.56652243600007, -96.26425479399995],
    [30.569574792000026, -96.27168548299994],
    [30.645211026000027, -96.29240336199996],
    [30.57681808600006, -96.29918360299996],
    [30.577535587000057, -96.29984049099994],
    [30.576771192000024, -96.30109641599995],
    [30.637114332000067, -96.32023794899999],
    [30.612550214000066, -96.32996461699997],
    [30.617669541000055, -96.29685550199997],
    [30.56805601600007, -96.28885238499998],
    [30.570624534000046, -96.29304348899996],
    [30.636313166000036, -96.32393122899998],
    [30.624411518000045, -96.29778392299994],
    [30.59228106100005, -96.34063636199994],
    [30.606031822000034, -96.31016388099994],
    [30.57973793000008, -96.31985258799995],
    [30.638833170000055, -96.31387864299995],
    [30.550449848000028, -96.26880084499999],
    [30.640829342000075, -96.31261245599995],
    [30.624091252000028, -96.29618974299996],
    [30.610022858000036, -96.30947378499997],
    [30.611816348000048, -96.31687987899994],
    [30.61252491500005, -96.31836482999995],
    [30.55941907400006, -96.26059609199996],
    [30.634055576000037, -96.32515785299995],
    [30.607459720000065, -96.30855392999996],
    [30.639588526000068, -96.31689921999998],
    [30.582093746000055, -96.28602798599997],
    [30.58996588800005, -96.31479276699997],
    [30.647302628000034, -96.29241345099996],
    [30.62413582000005, -96.32935397099999],
    [30.609959696000033, -96.32031528499994],
    [30.56739562100006, -96.21149195799995],
    [30.561996259000068, -96.25719208499999],
    [30.618825623000077, -96.34612665399999],
    [30.60778440200005, -96.31776789499997],
    [30.622085146000074, -96.34180616399999],
    [30.603948014000025, -96.33939900399997],
    [30.60733815900005, -96.30980613999998],
    [30.61990283700004, -96.34520477999996],
    [30.614106055000036, -96.32816021699995],
    [30.639911255000072, -96.31629211199999],
    [30.61288117400005, -96.31669201499994],
    [30.61131890400003, -96.31628029399997],
    [30.622413707000078, -96.31164947799994],
    [30.606905830000073, -96.30217981099997],
    [30.638892276000036, -96.31350494999998],
    [30.638141079000036, -96.30669685699996],
    [30.619269936000023, -96.34573194699999],
    [30.620594294000057, -96.34456399299995],
    [30.620752813000024, -96.34506870899997],
    [30.618431454000074, -96.34655735299998],
    [30.58073054700003, -96.29414370199999],
    [30.643560497000067, -96.31408148999998],
    [30.612098202000027, -96.32862724499995],
    [30.626281375000076, -96.33062231799994],
    [30.624780155000053, -96.30944813599996],
    [30.641756688000044, -96.31316984899996],
    [30.619330541000068, -96.31349190599997],
    [30.618155397000066, -96.32335011899994],
    [30.601536199000066, -96.30418128199994],
    [30.57309521800005, -96.30870822599996],
    [30.570207863000064, -96.29988419899996],
    [30.593169110000076, -96.32842871399998],
    [30.567425360000072, -96.23626709699994],
    [30.558666627000036, -96.24955335399994],
    [30.63528814400007, -96.32341576899995],
    [30.640025146000028, -96.31605689299994],
    [30.61329173200005, -96.31468251499996],
    [30.596182467000062, -96.30472820899996],
    [30.63606023500006, -96.31945877299995],
    [30.644028502000026, -96.30417408599999],
    [30.63310420700003, -96.32613377599995],
    [30.576045838000027, -96.30458531599999],
    [30.593631669000047, -96.33639449799995],
    [30.633868647000043, -96.32698792499997],
    [30.601265738000052, -96.28184122099998],
    [30.611499294000055, -96.32345660299995],
    [30.646974303000036, -96.29196216799994],
    [30.551416498000037, -96.26033538699994],
    [30.56330568100003, -96.26145254199997],
    [30.563358692000065, -96.26017557199998],
    [30.608391324000024, -96.28868242299995],
    [30.562747148000028, -96.27646669799998],
    [30.579293449000033, -96.29545472599995],
    [30.618532878000053, -96.31370179399994],
    [30.616216467000072, -96.31890203899997],
    [30.601025942000035, -96.31765329699994],
    [30.58017380000007, -96.29420668299997],
    [30.589914419000024, -96.30115519299994],
    [30.59977145000005, -96.33855904599994],
    [30.60843191300006, -96.33412183299998],
    [30.609519857000066, -96.33305114799998],
    [30.62168565500008, -96.34223728999996],
    [30.610541733000048, -96.31492641599999],
    [30.638854028000026, -96.31484645699999],
    [30.618218957000067, -96.30768302999996],
    [30.611367942000072, -96.33016658399998],
    [30.61874410400003, -96.34737287499996],
    [30.619279624000058, -96.34782288799994],
    [30.601829679000048, -96.34003410999998],
    [30.63513219200007, -96.32674787299999],
    [30.55338732000007, -96.27561348299997],
    [30.606027314000073, -96.30291162499998],
    [30.606113015000062, -96.30078050499998],
    [30.64095684600005, -96.29523830299996],
    [30.59773320000005, -96.29948338499997],
    [30.593694345000074, -96.29345091199997],
    [30.558443299000032, -96.26130005599998],
    [30.560888005000038, -96.25772227899995],
    [30.622650365000027, -96.29906406499998],
    [30.63840206100008, -96.31071440699998],
    [30.643010149000077, -96.31373754099997],
    [30.558481930000028, -96.26196065399995],
    [30.592540136000025, -96.32759034999998],
    [30.55629843300005, -96.27229911299997],
    [30.57820743700006, -96.28983799999997],
    [30.603344888000038, -96.28890453999998],
    [30.645002651000027, -96.29099323899999],
    [30.616850197000076, -96.31624831399995],
    [30.65094199400005, -96.29044937799995],
    [30.648993365000024, -96.29424942699995],
    [30.61072647900005, -96.30478055599997],
    [30.553716718000032, -96.26323240499994],
    [30.641064517000075, -96.32278306499995],
    [30.61871407800004, -96.29428265999996],
    [30.55739950000003, -96.26101090399999],
    [30.52850310100007, -96.29356378299997],
    [30.61280461800004, -96.32667666099996],
    [30.591209337000066, -96.31686621599994],
    [30.615174504000038, -96.29044268399997],
    [30.626811987000053, -96.32059815699995],
  ];

  var iconBase =
    'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: positions[13][0],
      lng: positions[13][1],
    },
  });
  directionsRenderer.setMap(map);

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(30.5159362, -96.5171539),
    new google.maps.LatLng(30.7215865, -96.2252309)
  );
  var onChangeHandler = function() {
    const start = getStartLocation();
    const end = $('#end').val();
    if (start && end) {
      calculateAndDisplayRoute(start, end);
    }
  };

  const startAutocomplete = new google.maps.places.Autocomplete(
    getStartLocation(),
    {
      bounds: defaultBounds,
      strictBounds: true,
    }
  );
  startAutocomplete.addListener('place_changed', onChangeHandler);

  const endAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('end'),
    {
      bounds: defaultBounds,
      strictBounds: true,
    }
  );
  endAutocomplete.addListener('place_changed', onChangeHandler);

  function calculateAndDisplayRoute(origin, destination) {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: 'BICYCLING',
      },
      function(response, status) {
        if (status === 'OK') {
          bikeRoute = response;
          bikeRoute.routes[0].warnings.pop();
          directionsService.route(
            {
              origin,
              destination,
              travelMode: 'DRIVING',
            },
            function(response, status) {
              if (status === 'OK') {
                carRoute = response;
                directionsRenderer.setDirections(response);
                displayBikeSuggestion();
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            }
          );
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  function displayBikeSuggestion() {
    var bikeTime = bikeRoute.routes[0].legs[0].duration;
    var carTime = carRoute.routes[0].legs[0].duration;
    $('#bikeMsg').text('Bike route is: ' + bikeTime['text']);
    $('#currentMsg').text('Current route is: ' + carTime['text']);
    $('#bike-better-popup').show();
  }

  function route(origin, destination, travelMode) {
    if (!['WALKING', 'BIKING', 'DRIVING'].includes(travelMode)) {
      alert('Unknown travel mode');
    }
    directionsService.route(
      {
        origin,
        destination,
        travelMode,
      },
      function(response, status) {
        if (status === 'OK') {
          currentRoute = response;
          currentRoute.routes[0].warnings.pop();
          directionsRenderer.setDirections(currentRoute);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  function walkThenBike(origin, bike, destination) {
    directionsService.route(
      {
        origin: origin,
        destination: bike,
        travelMode: 'WALKING',
      },
      function(response, status) {
        if (status === 'OK') {
          walkLeg = response;
          //directionsRenderer.setDirections(response);
          directionsService.route(
            {
              origin: bike,
              destination: destination,
              travelMode: 'BICYCLING',
            },
            function(response, status) {
              if (status === 'OK') {
                bikeLeg = response;
                //directionsRenderer.setDirections(response);
                walkLeg.routes[0].legs.push(bikeLeg.routes[0].legs[0]);
                walkLeg.routes[0].warnings.pop();
                directionsRenderer.setDirections(walkLeg);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            }
          );
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  var parking = {
    url: iconBase + 'parking_lot_maps.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  };

  var bike = {
    url: 'cycling.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
  };

  var stationMarkers = [];

  positions.forEach(function(position) {
    stationMarkers.push(
      new google.maps.Marker({
        position: new google.maps.LatLng(position[0], position[1]),
        icon: parking,
        map: map,
        zindex: 10,
        visible: false,
      })
    );
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoom = map.getZoom();
    for (i = 0; i < stationMarkers.length; i++) {
      stationMarkers[i].setVisible(zoom >= 15);
    }
  });
  // Function that gets called if you click bike marker
  const chooseBike = bikeMarker => {
    const pos = bikeMarker.getPosition();
    const start = getStartLocation();
    const end = $('#end').val();
    if (start && end) {
      walkThenBike(start, pos.lat() + ',' + pos.lng(), end);
    } else if (start) {
      route(start, pos.lat() + ',' + pos.lng(), 'WALKING');
    } else {
      alert('Please enter a start location');
    }
  };
  // Show bikes on map
  const showBikeMarkers = data => {
    const bikeMarkers = [];
    for (var i = 1; i < data.length; i++) {
      const bike_data = data[i];
      const lock_open = bike_data.lockStatus;
      if (lock_open) {
        const lat = bike_data.location.lat;
        const lng = bike_data.location.lng;
        const bikeMarker = new google.maps.Marker({
          position: {
            lat,
            lng,
          },
          map: map,
          icon: bike,
        });
        bikeMarker.addListener('click', () => chooseBike(bikeMarker));
        bikeMarkers.push(bikeMarker);
      }
    }
    new MarkerClusterer(map, bikeMarkers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      gridSize: 30,
      minimumClusterSize: 10,
    });
  };
  $('#showBikeRoute').click(() => {
    directionsRenderer.setDirections(bikeRoute);
    $('#bike-better-popup').hide();
  });

  $('#showDirections').click(() => {
    showDirectionPanel = !showDirectionPanel;
    directionsRenderer.setPanel(
      showDirectionPanel ? document.getElementById('right-panel') : null
    );
  });
  directionsRenderer.setPanel(
    showDirectionPanel ? document.getElementById('right-panel') : null
  )
  $('#closest-checkbox').click(()=>{
    closestStation = !closestStation
  })
  // Show traffic
  var trafficLayer = new google.maps.TrafficLayer();
  $('#traffic-layer-checkbox').click(() => {
    showTrafficLayer = !showTrafficLayer;
    trafficLayer.setMap(showTrafficLayer ? map : null);
  });
  // Show bike layer
  var bikeLayer = new google.maps.BicyclingLayer();
  $('#bike-path-checkbox').click(() => {
    showBikingLayer = !showBikingLayer;
    if (showBikingLayer) {
      $('#bikeLayerInfo').text(
        'Dark green routes indicated dedicated bicycle routes. Light green routes indicate streets with dedicated "bike lanes." Dashed routes indicate streets or paths otherwise recommended for bicycle usage.'
      );
      bikeLayer.setMap(map);
    } else {
      $('#bikeLayerInfo').text(' ');
      bikeLayer.setMap(null);
    }
  });
  // Show current location
  var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
  navigator.geolocation.getCurrentPosition(
    position => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      var myLatLng = new google.maps.LatLng(pos.lat, pos.lng);
      new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: im,
      });
      map.setCenter(pos);
      // Get nearby bikes
      getNearbyBikes(pos.lat, pos.lng)
        .then(showBikeMarkers)
        .catch(alert);
      // Fill current location in start box
      currentPosition = pos.lat + ',' + pos.lng;
      $('#start').val('Your location');
    },
    () => alert('navigator.geolocation failed, may not be supported')
  );
  // Clear start input box if user places cursor into box
  $('#start').click(() => {
    currentPosition = null;
    $('#start').val('');
  });
}