/* Variables */
const APIurl = 'https://api.openweathermap.org/data/2.5/';
const weatherAPIurl = APIurl + 'weather';
const forecastAPIurl =  APIurl + 'forecast';
const ID = '&appid=cc326e22c40b514d2512902cd32e0862';
const APIunits = '&units=imperial';
const preston = '?id=5604473' + ID + APIunits;
const sodasprings = '?id=5607916' + ID + APIunits;
const fishhaven = '?lat=42.0380399&lon=-111.4048681' + ID + APIunits;

/* Concatanated Links */
const prestonForecast = forecastAPIurl + preston;
const prestonWeather = weatherAPIurl + preston;
const sodaspringsForecast = forecastAPIurl + sodasprings;
const sodaspringsWeather = weatherAPIurl + sodasprings;
const fishhavenForecast = forecastAPIurl + fishhaven;
const fishhavenWeather = weatherAPIurl + fishhaven;

/* Choosing which page needs weather */
let weatherURL = "";
let forecastURL = "";
if (document.getElementById("preston")) {
    weatherURL = prestonWeather;
    forecastURL = prestonForecast;
}
else if (document.getElementById("soda-springs")) {
    weatherURL = sodaspringsWeather;
    forecastURL = sodaspringsForecast;
}
else if (document.getElementById("fish-haven")) {
    weatherURL = fishhavenWeather;
    forecastURL = fishhavenForecast;
}

/* Weather Function */
fetch(weatherURL)
    .then((response) => response.json())
    .then((jsObject) => {
        let t = parseFloat(jsObject.main.temp);
        let s = parseFloat(jsObject.wind.speed);
        let output = "N/A";

        const desc = jsObject.weather[0].description; 
        document.getElementById('current').innerHTML = jsObject.weather[0].description;
        document.getElementById('currentTemp').innerHTML = Math.round(t) + "&#8457;";

        if (t <= 50 && s >= 3) {
            let f = (35.74 + (0.6215 * t)) - (35.75 * (Math.pow(s, 0.16))) + (0.4275 * (t * (Math.pow(s, 0.16))));
            output = Math.round(f);
        };

        document.getElementById("windChill").innerHTML = output + "&#8457;";
        document.getElementById('humidity').innerHTML = jsObject.main.humidity;
        document.getElementById('windSpeed').innerHTML = Math.round(s) + " MPH";
    });

/* Forecast Function */
fetch(forecastURL)
    .then((response) => response.json())
    .then((forecastObject) => {
        var forecast = forecastObject.list.filter(x => x.dt_txt.includes('18:00:00'));
        console.table(forecast)
        
        for (let day = 0; day < forecast.length; day++) {
            // Day of Week
            let weatherDay = document.getElementsByClassName('dayofweek');
            for (let i = 0; i < weatherDay.length; i++) {
                let longDate = new Date(forecast[day].dt_txt);
                weatherDay[day].textContent = longDate.toLocaleString("en-us", {
                    weekday: "long"
                });
            }

            // Temperature
            let forecastTemp = document.getElementsByClassName('forecastTemp');
            for (let i = 0; i < forecastTemp.length; i++) {
                forecastTemp[day].innerHTML = forecast[day].main.temp;
            }

            // Icon Image
            let weatherIcon = document.getElementsByClassName("forecastIcon");
            for (let i = 0; i < forecastIcon.length; i++) {
                forecastIcon[day].setAttribute("src", `https://openweathermap.org/img/wn/${forecast[day].weather[0].icon}@2x.png`);
                forecastIcon[day].setAttribute("alt", `Icon representing ${forecast[day].weather[0].description}`);
            }
        }

    });