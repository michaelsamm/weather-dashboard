/*
Connect search field to input

City and current date
Current weather conditions
    xxicon of weather
    xxtemperature
    xxhumidity
    xxwind speed
    UV index
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





var apiKey = 'e0a6afee4ced0e5525c4a7c68c4ed596';

$('#search').click(function(event) {
    event.preventDefault();
    var city = $("#city").val();
    console.log(city);

    if (city) {
        getLocationData(city);
        $('#city').val("");
        $('#current-weather').empty();
    }
    else {
        alert("Please enter a city");
    }
})

function getLocationData(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(function(response) {
        return response.json()
    })
    .then(function(cityData) {
        console.log(cityData);
        var today = moment().format("MM/DD/YYYY");
        var cityName = $("<h2>").
            text(cityData[0].name + " - " + today);
        $('#current-weather').append(cityName);
        getCurrentWeather(cityData[0].lat, cityData[0].lon)
        getFutureWeather(cityData[0].lat, cityData[0].lon)
    })
}

function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,daily,minutely&units=imperial")
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        console.log(weatherData);
        console.log(weatherData.current.weather[0].icon)
        var curWeatherIcon = $("<img>")
            .attr('src', 'http://openweathermap.org/img/wn/' + weatherData.current.weather[0].icon + '@2x.png');
        console.log(weatherData.current.temp)
        var curTemp = $('<p>')
            .text("Temp: " + weatherData.current.temp + "\xB0F");
        console.log(weatherData.current.humidity)
        var curHum = $('<p>')
            .text("Humidity: " + weatherData.current.humidity + "%");
        console.log(weatherData.current.wind_speed)
        var curWindSpeed = $('<p>')
            .text("Wind: " + weatherData.current.wind_speed + " MPH");
        console.log(weatherData.current.uvi)
        var ratedUV = $('<span>')
            .text(weatherData.current.uvi);
        // if ()
        var curUVI = $('<p>')
            .text("UV Index: ");
        curUVI.append(ratedUV);


        $("#current-weather").append(curWeatherIcon, curTemp, curHum, curWindSpeed, curUVI);

    })
}

function getFutureWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,minutely&units=imperial")
    .then(function(response) {
        return response.json()
    })
    .then(function(futureData) {
        console.log(futureData);
        for (i = 1; i < 6; i++) {
            var dayCard = $('<div>')
                .addClass('card');
            var dayCardHeader = $('<h5>')
                .addClass('card-header')
                .text(moment().add(i, 'd').format('MM/DD/YYYY'));
            var dayCardBody = $('<div>')
                .addClass('card-body');
            console.log(futureData.daily[i].dt)
            console.log(futureData.daily[i].weather[0].icon)
            var dayWeatherIcon = $('<img>')
                .attr('src', 'http://openweathermap.org/img/wn/' + futureData.daily[i].weather[0].icon + '.png');
            console.log(futureData.daily[i].temp.max)
            var dayTemp = $('<p>')
                .text("Temp: " + futureData.daily[i].temp.max + "\xB0F");
            console.log(futureData.daily[i].humidity)
            var dayHum = $('<p>')
                .text("Humidity: " + futureData.daily[i].humidity + "%");
            console.log(futureData.daily[i].wind_speed)
            var dayWind = $('<p>')
                .text("Wind: " + futureData.daily[i].wind_speed + " MPH")
            
            dayCardBody.append(dayWeatherIcon, dayTemp, dayHum, dayWind);
            dayCard.append(dayCardHeader, dayCardBody);
            $('#forecast').append(dayCard);
        }
        

    })
}
