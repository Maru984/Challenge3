//kaart
mapboxgl.accessToken = 'pk.eyJ1IjoicmVvdWwxOCIsImEiOiJja21sdG90ZWUwZ21vMnByem1wM3JoenZyIn0.5p8Yliukd7hh1N9X3rA9Wg';
	
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [-60.283417, 51.413947],
    zoom: 5,
    bearing: -100,
    pitch: 300,
  });

// kaart: zoekbalk
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  }),
  'top-right'
);

//kaart
map.addControl(new mapboxgl.NavigationControl()); 

var Florida = new mapboxgl.Popup().setHTML('<h3>Space Launch Complex 40</h3><p>1e Landingplek <br /> Check het weer onder de map.<br /> Stad: Florida</p>');
var California = new mapboxgl.Popup().setHTML('<h3>Vandenberg Air Force Base</h3><p>1e Landingplek <br /> Check het weer onder de map.<br /> Stad: California</p>');
var DenHaag = new mapboxgl.Popup().setHTML('<h3>Den Haag</h3><p>3e Landingplek <br /> Check het weer onder de map.<br /> Stad: Den Haag </p>');


var mapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var mapUrlApiKey = '4d3aa280b33cfb3bb3f277c9ee3d0b73';

var steden = [
  {
    name: 'Cape Canaveral Air Force Station Lanceercomplex 40',
    coordinates: [-80.577249, 28.562048]
  },
  {
    name: 'Vandenberg Air Force Base',
    coordinates: [-120.567747, 34.733238]
  },
  {
    name: 'Den Haag',
    coordinates: [4.32284, 52.067101]
  },
];

map.on('load', function () {
  steden.forEach(function(city) {
    var request = mapUrl + '?' + 'appid=' + mapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Cursor",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1
        }
      });
    }
  );
}

//het weer
function getAPIdata() {

  var city = document.getElementById('balk').value;
	var request = 'https://api.openweathermap.org/data/2.5/weather?appid=4d3aa280b33cfb3bb3f277c9ee3d0b73&lang=nl&q=' + city;

	fetch(request)	
	
	.then(function(response) {
		return response.json();
	})
	
	.then(function(response) {
	  var weatherBox = document.getElementById('weather');
		weatherBox.innerHTML = (response.main.temp -273.15).toFixed(2)+' &#730 C <br />' + response.weather[0].description;
	});
}

document.getElementById('weerButton').onclick = function(){
    getAPIdata();
};

//Hondenshow
function getAPIdata2() {

	var request2 = 'https://random.dog/woof.json?ref=apilist.fun';
	var img = document.getElementById('honden');
	fetch(request2)	
	
	.then(function(response) {
		return response.json();
	})
	
	.then(function(response) {
		
	img.src =  response.url;
	console.log(response);
	});
}

document.getElementById('fotoButton').onclick = function(){

	getAPIdata2();

}
