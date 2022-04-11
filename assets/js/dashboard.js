/*
xxConnect search field to input

xxCity and current date
xxCurrent weather conditions
    xxicon of weather
    xxtemperature
    xxhumidity
    xxwind speed
    xxUV index
        color indicates whether conditions are favorable/moderate/severe
xxFuture weather conditions
    xx5-day forecast
        xxdate
        xxicon for weather 
        xxtemp
        xxwind speed
        xxhumidity
Add to search history when entered
Click from search history searches it again

*/




// key for openweathermap
var apiKey = 'e0a6afee4ced0e5525c4a7c68c4ed596';
var cityLog = [];

// Listener for the city search
$('#search').click(function(event) {
    event.preventDefault();
    // Set city to the value from the input field
    var city = $("#city").val();

    // Verify city has a value and show an error if it doesn't
    if (city) {
        // Get location data
        getLocationData(city);
        // Add location to local memory and add a reference button
        saveLocation(city);
        // Update search history
        cityHistory();
        // Clear input field and clear the data display divs
        $('#city').val("");
    }
    else {
        alert("Please enter a city");
    }
})

// Use the input city and fetch data from openweathermap
function getLocationData(city) {
    $('#current-weather').empty();
    $('#forecast').empty();
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(function(response) {
        return response.json()
    })
    .then(function(cityData) {
        // Set the current date in 04/22/2022 format
        var today = moment().format("MM/DD/YYYY");
        // Create an h2 element for the city name
        var cityName = $("<h2>").
            text(cityData[0].name + " - " + today);
        // Add the city name to the current weather div
        $('#current-weather').append(cityName);
        // execute function to populate the current weather data using the city lat and lon
        getCurrentWeather(cityData[0].lat, cityData[0].lon)
        // executer function to populate forecast weather data cards using the city lat and lon
        getFutureWeather(cityData[0].lat, cityData[0].lon)
    })
}

// Take the city lat and lon and fetch weather data for the current day
function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,daily,minutely&units=imperial")
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        // Create the icon for the weather
        var curWeatherIcon = $("<img>")
            .attr('src', 'http://openweathermap.org/img/wn/' + weatherData.current.weather[0].icon + '@2x.png');
        // Create a text line for the temperature
        var curTemp = $('<p>')
            .text("Temp: " + weatherData.current.temp + "\xB0F");
        // Create a text line for the humidity
        var curHum = $('<p>')
            .text("Humidity: " + weatherData.current.humidity + "%");
        // Create a text line for the wind speed
        var curWindSpeed = $('<p>')
            .text("Wind: " + weatherData.current.wind_speed + " MPH");
        // Define the UV value, create a span for the value that will change color based on the UV value, and create the text line for the UV index
        var uvi = weatherData.current.uvi;
        var ratedUV = $('<span>')
            .text(uvi);
        if (0 <= uvi && 2 >= uvi) {
            ratedUV.addClass("bg-success")
        }
        else if (2 < uvi && 8 > uvi) {
            ratedUV.addClass("bg-warning")
        }
        else if (8 <= uvi) {
            ratedUV.addClass("bg-danger")
        }
        var curUVI = $('<p>')
            .text("UV Index: ");
        // Add the colored UV value to the text line for UV index
        curUVI.append(ratedUV);

        // Add all of the weather data to the current weather div
        $("#current-weather").append(curWeatherIcon, curTemp, curHum, curWindSpeed, curUVI);
    })
}

// Take the city lat and lon and fetch the forecast data for the next 5 days
function getFutureWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,minutely&units=imperial")
    .then(function(response) {
        return response.json()
    })
    .then(function(futureData) {
        // Loop through the array of dates; start at 1 since 0 is the current date; end before 6 to limit to 5 days
        for (i = 1; i < 6; i++) {
            // Create a card for each day
            var dayCard = $('<div>')
                .addClass('card');
            // Set a header to the card with the date
            var dayCardHeader = $('<h5>')
                .addClass('card-header')
                .text(moment().add(i, 'd').format('MM/DD/YYYY'));
            // Create a div for the body of the card
            var dayCardBody = $('<div>')
                .addClass('card-body');
            // Create an icon for the weather
            var dayWeatherIcon = $('<img>')
                .attr('src', 'http://openweathermap.org/img/wn/' + futureData.daily[i].weather[0].icon + '.png');
            // Create a text line for the temp
            var dayTemp = $('<p>')
                .text("Temp: " + futureData.daily[i].temp.max + "\xB0F");
            // Create a text line for the humidity
            var dayHum = $('<p>')
                .text("Humidity: " + futureData.daily[i].humidity + "%");
            // Create a text line for the wind speed
            var dayWind = $('<p>')
                .text("Wind: " + futureData.daily[i].wind_speed + " MPH")
            
            // Add the weather data to the card body
            dayCardBody.append(dayWeatherIcon, dayTemp, dayHum, dayWind);
            // Add the card header and card body to the card
            dayCard.append(dayCardHeader, dayCardBody);
            // Add the card to the forecast row
            $('#forecast').append(dayCard);
        }
    })
}

// 
function saveLocation(city) {
    var cityEntry = $('#city').val();
    console.log(cityEntry);
    cityLog.push(cityEntry);
    console.log(cityLog);

    localStorage.setItem('city', JSON.stringify(cityLog));
}

function cityHistory() {
    var tempCities = JSON.parse(localStorage.getItem('city'))
    console.log(tempCities);

    if (!tempCities) {
        return;
    }

    cityLog = tempCities;
    $('#search-history').empty();
    for (i=0; i < cityLog.length; i++) {
        console.log(cityLog[i]);
        var cityItem = $('<button>')
            .text(cityLog[i])
            .attr('type', 'button')
            .on('click', function(event) {
                event.preventDefault();
                getLocationData($(this).text());
            })
        $('#search-history').prepend(cityItem);
    }
}


cityHistory();