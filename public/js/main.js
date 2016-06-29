$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  var holderArr = [];

  function drawMarker (type, coords, text) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      textHold: text,
      icon: iconURL,
      position: latLng,
      animation: google.maps.Animation.DROP
    });
    holderArr.push(marker);
    marker.setMap(currentMap);
  }


  // drawMarker('hotel', [40.705137, -74.007624]);
  // drawMarker('restaurant', [40.705137, -74.013940]);
  // drawMarker('activity', [40.716291, -73.995315]);


      for (var i=0; i<hotels.length; i++) {
        $('#hotel-choices').append('<option>' + hotels[i].name + '</option>');
      }
      for (var i=0; i<restaurants.length; i++) {
        $('#restaurant-choices').append('<option>' + restaurants[i].name + '</option>');
      }
      for (var i=0; i<activities.length; i++) {
        $('#activity-choices').append('<option>' + activities[i].name + '</option>');
      }

      function selectFindLocation (database, typeicon, dropDownID,childNum) {
        $(dropDownID).next().on('click', function(event){
          var selectedText = $(dropDownID).find('option:selected').text();
          $('#itinerary>div:nth-child('+childNum+')').append('<div data-id="2" class="itinerary-item"><span class="title">' + selectedText + '</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button>');
          for (var i=0; i<database.length; i++) {
              if (selectedText === database[i].name) {
                drawMarker(typeicon, [database[i].place.location[0], database[i].place.location[1]], selectedText);
                return;
            }
          }
        });
      }
    selectFindLocation(hotels, 'hotel', '#hotel-choices',1);
    selectFindLocation(restaurants, 'restaurant', '#restaurant-choices',2);
    selectFindLocation(activities, 'activity', '#activity-choices',3);

    function remove () {
      $('#itinerary>div').on('click', '.remove', function(event){
        var leftText = $(this).parent().text().slice(0,-2);
        for (var i=0; i<holderArr.length; i++) {
          if(holderArr[i].textHold === leftText) {
            holderArr[i].setMap(null);
          }
        }
        $(this).parent()[0].remove();
      });
    }
    remove();

    function addDay (){
      $('#day-add').on('click', function (event){
        $('#day-add').prepend('<button class="btn btn-circle day-btn current-day">1</button>')
      });
    }


});


