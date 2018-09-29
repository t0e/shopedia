
// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

// This adds the map
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v9',
  // initial position in [long, lat] format
  center: [96.149722, 16.780833],
  // initial zoom
  zoom: 13
});

var stores = {
  "type": "FeatureCollection",
  "features": [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1447715,
      16.9927839
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 234-7336",
      "phone": "2022347336",
      "name": "Royal Store",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1447715,
      16.9927839
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 507-8357",
      "phone": "2025078357",
      "name": "5 Star Mobile",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1446575,
      16.9971255
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 387-9338",
      "phone": "2023879338",
      "name": "Mahar Nwe Tea Shop",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1566413,
      16.8280707
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 507-8357",
      "phone": "2025078357",
      "name": "Harry's Bar Myanmar",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1561086,
      16.8317777
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 507-8357",
      "phone": "2025078357",
      "name": "Cafe Dibar Yangon",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
      96.1590728,
      16.8287838
      ]
    },
    "properties": {
      "phoneFormatted": "(202) 507-8357",
      "phone": "2025078357",
      "name": "Sky Line Tea & Kyay Oh",
      "city": "Mingalardon",
      "country": "Myanmar",
      "state": "Yangon"
    }
  }

  ]
};

// This adds the data to the map
map.on('load', function (e) {
  // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
  map.addSource("places", {
    "type": "geojson",
    "data": stores
  });
  // Initialize the list
  buildLocationList(stores);

  // geocoder = new MapboxGeocoder({
  //   accessToken: mapboxgl.accessToken,
  //   // bbox: [21.9162, 95.9560, 20.9162, 94.9560]
  //   bbox: [-77.210763, 38.803367, -76.853675, 39.052643]
  // });

  // map.addControl(geocoder, 'top-right');

  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": [] // Notice that initially there are no features
    }
  });

  map.addLayer({
    "id": "point",
    "source": "single-point",
    "type": "circle",
    "paint": {
      "circle-radius": 10,
      "circle-color": "#007cbf",
      "circle-stroke-width": 3,
      "circle-stroke-color": "#fff"
    }
  });

  


  geocoder.on('result', function(ev) {
    // var searchResult = ev.result.geometry;
    var searchResult = {"type":"Point","coordinates":[96.1951, 16.8661]}
    map.getSource('single-point').setData(searchResult);

    console.log(JSON.stringify(searchResult));

    var options = {units: 'miles'};
    stores.features.forEach(function(store){
      Object.defineProperty(store.properties, 'distance', {
        value: turf.distance(searchResult, store.geometry, options),
        writable: true,
        enumerable: true,
        configurable: true
      });
    });

    stores.features.sort(function(a,b){
      if (a.properties.distance > b.properties.distance) {
        return 1;
      }
      if (a.properties.distance < b.properties.distance) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    var listings = document.getElementById('listings');
    while (listings.firstChild) {
      listings.removeChild(listings.firstChild);
    }

    buildLocationList(stores);

    function sortLonLat(storeIdentifier) {
      var lats = [stores.features[storeIdentifier].geometry.coordinates[1], searchResult.coordinates[1]]
      var lons = [stores.features[storeIdentifier].geometry.coordinates[0], searchResult.coordinates[0]]

      var sortedLons = lons.sort(function(a,b){
        if (a > b) { return 1; }
        if (a.distance < b.distance) { return -1; }
        return 0;
      });
      var sortedLats = lats.sort(function(a,b){
        if (a > b) { return 1; }
        if (a.distance < b.distance) { return -1; }
        return 0;
      });
      
      map.fitBounds([
        [sortedLons[0], sortedLats[0]],
        [sortedLons[1], sortedLats[1]]
        ], {
          padding: 100
        });
    };

    sortLonLat(0);
    createPopUp(stores.features[0]);

  });
});

// This is where your interactions with the symbol layer used to be
// Now you have interactions with DOM markers instead
stores.features.forEach(function(marker, i) {
  // Create an img element for the marker
  var el = document.createElement('div');
  el.id = "marker-" + i;
  el.className = 'marker';
  // Add markers to the map at all points
  new mapboxgl.Marker(el, {offset: [0, -23]})
  .setLngLat(marker.geometry.coordinates)
  .addTo(map);

  el.addEventListener('click', function(e){
      // 1. Fly to the point
      flyToStore(marker);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(marker);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');

      e.stopPropagation();
      if (activeItem[0]) {
       activeItem[0].classList.remove('active');
     }

     var listing = document.getElementById('listing-' + i);
     listing.classList.add('active');

   });
});


function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();


  var popup = new mapboxgl.Popup({closeOnClick: false})
  .setLngLat(currentFeature.geometry.coordinates)
  .setHTML('<h5>'+ currentFeature.properties.name + '</h5><div><a href="/shop" class="btn btn-info">Go to Shop</a></div>' )
    // '<h6>' + currentFeature.properties.name + '</h6>')
  .addTo(map);
}


function buildLocationList(data) {
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties;

    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = "listing-" + i;

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.name;

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }

    if (prop.distance) {
      var roundedDistance = Math.round(prop.distance*100)/100;
      details.innerHTML += '<p><strong>' + roundedDistance + ' miles away</strong></p>';
    }


    link.addEventListener('click', function(e){
      // Update the currentFeature to the store associated with the clicked link
      var clickedListing = data.features[this.dataPosition];

      // 1. Fly to the point
      flyToStore(clickedListing);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(clickedListing);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');

      if (activeItem[0]) {
       activeItem[0].classList.remove('active');
     }
     this.parentNode.classList.add('active');

   });
  }
}

if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            lat = position.coords["latitude"];
            lng = position.coords["longitude"];
            console.log('lat = '+lat);
            console.log('lng = '+lng);
            var marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
            map.flyTo({
                center: [lng, lat]
            });

            // var searchResult = ev.result.geometry;
    var searchResult = {"type":"Point","coordinates":[96.1951, 16.8661]}
    map.getSource('single-point').setData(searchResult);

    console.log(JSON.stringify(searchResult));

    var options = {units: 'miles'};
    stores.features.forEach(function(store){
      Object.defineProperty(store.properties, 'distance', {
        value: turf.distance(searchResult, store.geometry, options),
        writable: true,
        enumerable: true,
        configurable: true
      });
    });

    stores.features.sort(function(a,b){
      if (a.properties.distance > b.properties.distance) {
        return 1;
      }
      if (a.properties.distance < b.properties.distance) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    var listings = document.getElementById('listings');
    while (listings.firstChild) {
      listings.removeChild(listings.firstChild);
    }

    buildLocationList(stores);

    function sortLonLat(storeIdentifier) {
      var lats = [stores.features[storeIdentifier].geometry.coordinates[1], searchResult.coordinates[1]]
      var lons = [stores.features[storeIdentifier].geometry.coordinates[0], searchResult.coordinates[0]]

      var sortedLons = lons.sort(function(a,b){
        if (a > b) { return 1; }
        if (a.distance < b.distance) { return -1; }
        return 0;
      });
      var sortedLats = lats.sort(function(a,b){
        if (a > b) { return 1; }
        if (a.distance < b.distance) { return -1; }
        return 0;
      });
      
      map.fitBounds([
        [sortedLons[0], sortedLats[0]],
        [sortedLons[1], sortedLats[1]]
        ], {
          padding: 100
        });
    };

    sortLonLat(0);
    createPopUp(stores.features[0]);
        },
        
        function(error) {
            console.log("Error: ", error);
        },
        {
            enableHighAccuracy: true
        }
        );
    }