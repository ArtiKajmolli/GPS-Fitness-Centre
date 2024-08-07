//GPS Fitness Tracker
var map;
var markers = [];
var trackRoute = [];
var watchID;
var count = 0;
var originalLatitude;
var originalLongitude;

function addGoogleMap(){
    map = new google.maps.Map(document.getElementById("map"), {
        center: navigator.geolocation.getCurrentPosition(setCenter),
        zoom: 10,
    });
    map.addListener("click", (event) => {
        addMarker(event.latLng);
    });

    document.getElementById("stopTracking").disabled = true;
}

function setCenter(position){
    var userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    map.setCenter(new google.maps.LatLng(userLocation));
    addMarker(userLocation);
    originalLatitude = position.coords.latitude;
    originalLongitude = position.coords.longitude;
}

function setMarkerIdentifier(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

function hideMarker(){
    setMarkerIdentifier(null);
}

function showMarker(){
    setMarkerIdentifier(map)
}

function startTrackingRun(){//try and make this function update the global long and latitiudes for starting position//
    watchID = navigator.geolocation.watchPosition(createTrackRoute,distanceCalculator);
    document.getElementById("stopTracking").disabled = false;
    document.getElementById("startTracking").disabled = true;
}

function createTrackRoute(position){
    trackRoute.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    map.setCenter(trackRoute[0]);
    
    for(var i = 0; i < trackRoute.length;i++){
        createPolyline(trackRoute)
    }
    count++;

    var dist = distanceCalculator(position.coords.latitude, position.coords.longitude);
    var speedFinal = speedCalculator(position.coords.speed);
        //speed in meters per second
    document.getElementById("output").innerHTML = "speed: "  + speedFinal + " Km/h <br/>" + " Accuracy: " + position.coords.accuracy + "<br/>" + 
                                                  "Distance: " + dist + "<br/>" + "Count: " + count;
}

function speedCalculator(x){
    var speed;
    if(x == "null"){
        speed = 0
    }

    speed = ((x*3600)/1000);
    return speed
}

function distanceCalculator(x,y){
    var radius = 6371; //radius of earth in kilometers

    var startLatitudeRad = (originalLatitude * (Math.PI/180));
    var startLongitudeRad = (originalLongitude * (Math.PI/180));

    var endLatitudeRad = (x* (Math.PI/180));
    var endLongitudeRad = (y* (Math.PI/180));

    var deltaLat = (startLatitudeRad - endLatitudeRad);
    var deltalong = (startLongitudeRad - endLongitudeRad);

    var sinLat = Math.sin(deltaLat/2);
    var sinLng = Math.sin(deltalong/2);

    var a = Math.pow(sinLat,2.0) + (((Math.cos(startLatitudeRad)) * Math.cos(endLatitudeRad)) * Math.pow(sinLng,2.0));
    var totalDistance = radius * 2 * (Math.asin(Math.min(1,(Math.sqrt(a)))));

    return totalDistance.toFixed(2);
}

function stopWatchingPosition(){
    navigator.geolocation.clearWatch(watchID);
    navigator.geolocation.getCurrentPosition(getLastPosition);
    document.getElementById("stopTracking").disabled = true;
    document.getElementById("startTracking").disabled = false;

}

function getLastPosition(position){
    var userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};

    addMarker(userLocation);
}

function addMarker(position){
    var marker = new google.maps.Marker(
        {position: position,
        map: map,
        draggable:true,
        icon: "images/icon13.png",
        });

        markers.push(marker);
}

function createPolyline(trackRoute){
  // const { accuracy, latitude, longitude, altitude, heading, speed} = position.coords;
   var realPL = new google.maps.Polyline({
    path: trackRoute,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
   });

   realPL.setMap(map);
}

function resetTracking(){
    location.reload();

    fitnessTrackerGO();
    
}

// RPM calculator //
function personalrec(){
    //https://gunsmithfitness.com/blogs/news/how-much-should-you-bench-press
    //https://gunsmithfitness.com/blogs/news/how-much-should-i-be-able-to-deadlift

    //https://www.noobgains.com/how-much-should-i-squat-for-my-weight/
    //https://whitecoattrainer.com/blog/how-strong-are-you


    var a = parseInt(document.getElementById("weight").value);
    var b = parseInt(document.getElementById("reps").value);
    var c = parseInt(document.getElementById("bodyweight").value);
    var exercise = document.getElementById("dropdown").value;

    /* eply formula that is too heavy var z = parseInt(a * (1 + (0.0333 * b))).toFixed(2); */
    var maxLift = (a / (1.0278 - (0.0278*b))).toFixed(0);

    
    var y = (maxLift / c).toFixed(2);
    

    //document.getElementById("text").innerHTML = exercise +": " + a + " lbs X " + b + " reps = " +  z + "Ib 1RM (" + y + "X BW)"+ "  view <br>";

  //  document.getElementById("userLift").innerHTML = "Your Lift: " +  a + " lbs X " + b + " reps" + "<br>" + "Your 1RM = " + z + " Ib";

    if(exercise=="Bench Press"){
    if(y<0.5){   
        document.getElementById("exercise").innerHTML = exercise + " Standards";
        document.getElementById("imageStar").style.display = "inline";
        document.getElementById("imageStar").setAttribute("src","images/star_rating/just started.jpg")
        document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Just Started";
    }
    else{
        if(y<=0.7){
            document.getElementById("exercise").innerHTML = exercise + " Standards";
            document.getElementById("imageStar").style.display = "inline";
            document.getElementById("imageStar").setAttribute("src","images/star_rating/beginner.jpg");
            document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Beginner";
        }
        else{
            if(y<=1){
                document.getElementById("exercise").innerHTML = exercise + " Standards";
                document.getElementById("imageStar").style.display = "inline";
                document.getElementById("imageStar").setAttribute("src","images/star_rating/Novice.jpg");
                document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" + "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Novice";
            }
            else{
                if(y<=1.5){
                    document.getElementById("exercise").innerHTML = exercise + " Standards";
                    document.getElementById("imageStar").style.display = "inline";
                    document.getElementById("imageStar").setAttribute("src","images/star_rating/Intermediate.jpg");
                    document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" + "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Intermediate";
                }
                else{
                    if(y<=1.9){
                        document.getElementById("exercise").innerHTML = exercise + " Standards";
                        document.getElementById("imageStar").style.display = "inline";
                        document.getElementById("imageStar").setAttribute("src","images/star_rating/Elite.jpg");
                        document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" + "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Elite";
                    }
                    else{
                        if(y>=1.9){
                            document.getElementById("exercise").innerHTML = exercise + " Standards";
                            document.getElementById("imageStar").style.display = "inline";
                            document.getElementById("imageStar").setAttribute("src","images/star_rating/World Class.jpg");
                            document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: World Class";
                        }
                    }
                }
            }
        }
    }
}
    if(exercise=="Squat"){
        document.getElementById("exercise").innerHTML = exercise + " Standards";
        if(y<=0.6){
            document.getElementById("imageStar").style.display = "inline";
            document.getElementById("imageStar").setAttribute("src","images/star_rating/just started.jpg")
            document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" + "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Just Started";
        }
        else{
            if(y<=1.1){
                document.getElementById("exercise").innerHTML = exercise + " Standards";
                document.getElementById("imageStar").style.display = "inline";
                document.getElementById("imageStar").setAttribute("src","images/star_rating/beginner.jpg");
                document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Beginner";
            }
            else{
                if(y<=1.5){
                    document.getElementById("exercise").innerHTML = exercise + " Standards";
                    document.getElementById("imageStar").style.display = "inline";
                    document.getElementById("imageStar").setAttribute("src","images/star_rating/Novice.jpg");
                    document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Novice";
                }
                else{
                    if(y<=2){
                        document.getElementById("exercise").innerHTML = exercise + " Standards";
                        document.getElementById("imageStar").style.display = "inline";
                        document.getElementById("imageStar").setAttribute("src","images/star_rating/Intermediate.jpg");
                        document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Intermediate";
                    }
                    else{
                        if(y<=2.6){
                            document.getElementById("exercise").innerHTML = exercise + " Standards";
                            document.getElementById("imageStar").style.display = "inline";
                            document.getElementById("imageStar").setAttribute("src","images/star_rating/Elite.jpg");
                            document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +   "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Elite";
                        }
                        else{
                            if(y>2.6){
                                document.getElementById("exercise").innerHTML = exercise + " Standards";
                                document.getElementById("imageStar").style.display = "inline";
                                document.getElementById("imageStar").setAttribute("src","images/star_rating/World Class.jpg");
                                document.getElementById("ratioBW").innerHTML = exercise + " 1 Rep Max: " + maxLift + "<br>" +   "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: World Class";
                            }
                        }
                    }
                }
            }
        }
    }
    if(exercise=="Deadlift"){
        document.getElementById("exercise").innerHTML = exercise + " Standards";
        if(y<0.65){
            document.getElementById("imageStar").style.display = "inline";
            document.getElementById("imageStar").setAttribute("src","images/star_rating/just started.jpg")
            document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Just Started";
        }
        else{
            if(y<1){
            document.getElementById("exercise").innerHTML = exercise + " Standards";
            document.getElementById("imageStar").style.display = "inline";
            document.getElementById("imageStar").setAttribute("src","images/star_rating/beginner.jpg");
            document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Beginner";
            }
            else{
                if(y<1.2){
                    document.getElementById("exercise").innerHTML = exercise + " Standards";
                    document.getElementById("imageStar").style.display = "inline";
                    document.getElementById("imageStar").setAttribute("src","images/star_rating/Novice.jpg");
                    document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Novice";
                }
                else{
                    if(y<1.65){
                        document.getElementById("exercise").innerHTML = exercise + " Standards";
                        document.getElementById("imageStar").style.display = "inline";
                        document.getElementById("imageStar").setAttribute("src","images/star_rating/Intermediate.jpg");
                        document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Intermediate";
                    }
                    else{
                        if(y<2){
                            document.getElementById("exercise").innerHTML = exercise + " Standards";
                            document.getElementById("imageStar").style.display = "inline";
                            document.getElementById("imageStar").setAttribute("src","images/star_rating/Elite.jpg");
                            document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" +  "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: Elite";
                        }
                        else{
                            if(y>2){
                                document.getElementById("exercise").innerHTML = exercise + " Standards";
                                document.getElementById("imageStar").style.display = "inline";
                                document.getElementById("imageStar").setAttribute("src","images/star_rating/World Class.jpg");
                                document.getElementById("ratioBW").innerHTML =  exercise + " 1 Rep Max: " + maxLift + "<br>" + "Your 1RM is " + y + "X your Body weight" + "<br>" + "Strength Level: World Class";
                            }
                        }
                    }
                }
            }
        }
    }
}

//BMI calculator
function BMICalculator(){
    var Imperical = 703;
    var a = parseInt(document.getElementById("feet").value);
    var b = parseInt(document.getElementById("inches").value);
    var c = parseInt(document.getElementById("weightBMI").value);
    var unit = document.getElementById("dropdownBMI").value;

    if(unit=="kilograms"){
        c = c * 2.205;
    }

    var d = (c/(Math.pow(((a*12) + b),2.0)));
    var BMIindex = (d * Imperical).toFixed(1);

    if(BMIindex < 18.5){
        document.getElementById("outputBMI").innerHTML = "Your BMI is " + BMIindex + "<br>" + "You are under weight!";
    }
    else{
        if(BMIindex <= 24.9){
            document.getElementById("outputBMI").innerHTML = "Your BMI is " + BMIindex + "<br>" + "You are a Normal weight!";
        }
        else{
            if(BMIindex<29.9){
                document.getElementById("outputBMI").innerHTML = "Your BMI is " + BMIindex + "<br>" + "You are over-weight!";
            }
            else{
                document.getElementById("outputBMI").innerHTML = "Your BMI is " + BMIindex + "<br>" + "You are Obese!";
            }
        }
    }
}

//Navigation and buttons
function fitnessTrackerGO(){
    document.getElementById("content").style.display = "none";
    document.getElementById("fitnessTracker").style.display ="inline";
    document.getElementById("page").innerHTML = "GPS Fitness Tracker";
}

function fitnessTrackerBack(){
    document.getElementById("content").style.display = "block";
    document.getElementById("fitnessTracker").style.display ="none";
    document.getElementById("page").innerHTML = "Home";
}


function RPMCalcGo(){
    document.getElementById("content").style.display = "none";
    document.getElementById("RPMcalculator").style.display ="inline";
    document.getElementById("page").innerHTML = "RPM calculator";
}

function RPMCalcBack(){
    document.getElementById("content").style.display = "block";
    document.getElementById("RPMcalculator").style.display ="none";
    document.getElementById("page").innerHTML = "Home";
}

function BMICalculatorGo(){
    document.getElementById("content").style.display = "none";
    document.getElementById("BMICalculator").style.display ="inline";
    document.getElementById("page").innerHTML = "BMI calculator";
}

function BMICalculatorBack(){
    document.getElementById("content").style.display = "block";
    document.getElementById("BMICalculator").style.display ="none";
    document.getElementById("page").innerHTML = "Home";
}

