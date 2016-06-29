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


  //Creating array of object for models approach
  var masterObj = {
    '1' : {
      'hotel-choices' : [],
      'restaurant-choices' : [],
      'activity-choices' : []
    }
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
          // find and add to obj
          var currentDayValue = $('.current-day').text();
          //what if the object does not exist
          if (!masterObj[currentDayValue]) {
            masterObj[currentDayValue] = {
              'hotel-choices' : [],
              'restaurant-choices' : [],
              'activity-choices' : []
            }
          }


          var sectionID = $(this).prev()[0].id;
          var selectedText = $(dropDownID).find('option:selected').text();

          masterObj[currentDayValue][sectionID].push(selectedText);
          // console.log(masterObj);



          // add to itinerary
          $('#itinerary>div:nth-child('+childNum+')').append('<div data-id="2" class="itinerary-item"><span class="title">' + selectedText + '</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button>');


          //add to map
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
      // Get current day to point us to object
      $('#itinerary>div').on('click', '.remove', function(event){
        console.log('clicked!');
        var currentDayValue = $('.current-day').text();
        var sectionID = $(this).parents()[1].id;
        var leftText = $(this).parent().text().slice(0,-2);

        for(var i = 0; i < masterObj[currentDayValue][sectionID].length; i++){
          if (masterObj[currentDayValue][sectionID][i] === leftText) {
            masterObj[currentDayValue][sectionID].splice(i, 1);
          }
        }
        for (var i=0; i<holderArr.length; i++) {
          if(holderArr[i].textHold === leftText) {
            holderArr[i].setMap(null);
          }
        }
        $(this).parent()[0].remove();
        console.log(masterObj);
      });
    }
    remove();

    function addDay (){
      $('#day-add').on('click', function (event){
        var dayNum = Number($(this).prev().text()) + 1;
        $('<button class="btn btn-circle day-btn">'+ dayNum + '</button>').css('margin-left', '5px').insertBefore('#day-add');
      });
    }
    addDay();

    function switchDays() {
      $('.day-buttons').on('click', '.btn-circle', function(event){
        if (this.id === 'day-add') {
          return;
        }
        $('.current-day').removeClass('current-day');
        $(this).addClass('current-day');
        for (var i=0; i<holderArr.length; i++) {
            holderArr[i].setMap(null);
        }
        $('#itinerary').html('<div id="hotel-choices"> <h4>My Hotel</h4> <ul class="list-group"> <div class="itinerary-item"> <!-- <span class="title">Andaz Wall Street</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button> --> </div> </ul> </div> <div id="restaurant-choices"> <h4>My Restaurants</h4> <ul class="list-group"> <div class="itinerary-item"> </div> </ul> </div> <div id="activity-choices"> <h4>My Activities</h4> <ul class="list-group"> <div class="itinerary-item"> </div> </ul> </div>');


        var currentDayValue = $('.current-day').text();

        for (var i=0; i<masterObj[currentDayValue]['hotel-choices'].length; i++) {
          var text = masterObj[currentDayValue]['hotel-choices'][i];
          // console.log(masterObj)
          $('#itinerary>div:nth-child(1)').append('<div data-id="2" class="itinerary-item"><span class="title">'+ text +'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button>');
         for (var j=0; j<hotels.length; j++) {
              if (text === hotels[j].name) {
                drawMarker('hotel', [hotels[j].place.location[0], hotels[j].place.location[1]], text);
            }
          }
        }


        for (var i=0; i<masterObj[currentDayValue]['restaurant-choices'].length; i++) {
          var text = masterObj[currentDayValue]['restaurant-choices'][i];
          $('#itinerary>div:nth-child(2)').append('<div data-id="2" class="itinerary-item"><span class="title">'+ text +'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button>');
          for (var j=0; j<restaurants.length; j++) {
              if (text === restaurants[j].name) {
                drawMarker('hotel', [restaurants[j].place.location[0], restaurants[j].place.location[1]], text);
            }
          }
        }

        for (var i=0; i<masterObj[currentDayValue]['activity-choices'].length; i++) {
          var text = masterObj[currentDayValue]['activity-choices'][i];
          $('#itinerary>div:nth-child(3)').append('<div data-id="2" class="itinerary-item"><span class="title">'+ text +'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button>');
          for (var j=0; j<activities.length; j++) {
              if (text === activities[j].name) {
                drawMarker('hotel', [activities[j].place.location[0], activities[j].place.location[1]], text);
            }
          }
        }
        remove();
      });
    }
    switchDays();

});


