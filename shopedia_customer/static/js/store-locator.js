$( document ).ready(function() {

  $.ajax({
    url: '/get-shop-list',
    success: function (data) {
      console.log(data)

      if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        };
      }

      mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

      var stores = data


      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [96.149722, 16.780833],
        zoom: 13
      });

      map.on('load', function (e) {


        map.addSource("places", {
          "type": "geojson",
          "data": stores
        });
        buildLocationList(stores);

        map.addSource('single-point', {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [] 
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
          console.log('geocoderrrrr');
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
            return 0;
          });

          var listings = document.getElementById('listings');
          while (listings.firstChild) {
            listings.removeChild(listings.firstChild);
          }

          buildLocationList(stores);

          function sortLonLat(storeIdentifier) {
            var lats = [stores[storeIdentifier].fields.location.lat]
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


      stores.shops.forEach(function(marker, i) {
        console.log('markerrrr')
        console.log(JSON.parse(marker.fields.location)[0]);
        var el = document.createElement('div');
        el.id = "marker-" + i;
        el.className = 'marker';
        new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat([JSON.parse(marker.fields.location)[1], JSON.parse(marker.fields.location)[0]])
        .addTo(map);

        el.addEventListener('click', function(e){
          flyToStore(marker);

          createPopUp(marker);

          var activeItem = document.getElementsByClassName('active');

          e.stopPropagation();
          if (activeItem[0]) {
           activeItem[0].classList.remove('active');
         }

         var listing = document.getElementById('listing-' + i);
         listing.classList.add('active');

       });
      });


      function flyToStore(shops) {
        map.flyTo({
          center: [JSON.parse(shops.fields.location)[1], JSON.parse(shops.fields.location)[0]],
          zoom: 15
        });
      }

      function createPopUp(shops) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();


        var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat([JSON.parse(shops.fields.location)[1], JSON.parse(shops.fields.location)[0]])
        .setHTML('<h5>'+ shops.fields.shop_name + '</h5><div><a href="/shop/'+shops.fields.shop_id+'" class="btn btn-info">Go to Shop</a></div>' )
        .addTo(map);
      }


      function buildLocationList(data) {
       console.log('build location list')
       console.log(data)
       for (i = 0; i < data.shops.length; i++) {
        var currentFeature = data.shops[i];
        var prop = currentFeature.fields;

        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.id = "listing-" + i;

        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = prop.shop_name;

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
          var clickedListing = data.shops[this.dataPosition];
          flyToStore(clickedListing);

          createPopUp(clickedListing);

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

        var searchResult = {"type":"Point","coordinates":[lng, lat]}
        map.getSource('single-point').setData(searchResult);

        var options = {units: 'miles'};
        stores.shops.forEach(function(store){
          Object.defineProperty(store.fields, 'distance', {
            value: turf.distance(searchResult, [JSON.parse(store.fields.location)[1], JSON.parse(store.fields.location)[0]], options),
            writable: true,
            enumerable: true,
            configurable: true
          });
        });

        stores.shops.sort(function(a,b){
          if (a.fields.distance > b.fields.distance) {
            return 1;
          }
          if (a.fields.distance < b.fields.distance) {
            return -1;
          }
          return 0;
        });

        var listings = document.getElementById('listings');
        while (listings.firstChild) {
          listings.removeChild(listings.firstChild);
        }

        buildLocationList(stores);

        function sortLonLat(storeIdentifier) {
          var lats = [JSON.parse(stores.shops[storeIdentifier].fields.location)[0], searchResult.coordinates[1]]
          var lons = [JSON.parse(stores.shops[storeIdentifier].fields.location)[1], searchResult.coordinates[0]]
          // var lats = [stores.features[storeIdentifier].geometry.coordinates[1], searchResult.coordinates[1]]
          // var lons = [stores.features[storeIdentifier].geometry.coordinates[0], searchResult.coordinates[0]]

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
        createPopUp(stores.shops[0]);
      },

      function(error) {
        console.log("Error: ", error);
      },
      {
        enableHighAccuracy: true
      }
      );
    }
  },
});

});
