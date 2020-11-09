

//SEARCH BAR
let searchBtn = $(".searchBtn");
let searchInput = $(".searchInput");

// FORECAST BOX
let currentDataText = $(".currentDate");
let cityNameText = $(".cityName");
let weatherImg = $(".weatherImg");
let searchHistoryEl = $(".historyItem");

// FORECAST ELEMENTS
let tempText = $(".temperature");
let humidityText = $(".humidity");
let speedText = $(".windSpeed");
let uvIndexText = $(".uvIndex");
let cardRow = $(".card-row");



// CREATE DATE FOR FORECAST BOX
var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
var today = mm + '-' + dd + '-' + yyyy;




if (JSON.parse(localStorage.getItem("searchHistory")) === null) {

}else{
    showHistory();
}


//SEARCH BUTTON FUNCTION
searchBtn.on("click", function() {

    getWeather(searchInput.val());
    console.log("Start Searching")

});



//SHOW CITY LIST
$(document).on("click", ".historyEntry", function() {
    console.log("You haved clicked on a saved city.")
    let thisElement = $(this);
    getWeather(thisElement.text());
})



//SHOW LOCAL STORAGE
function showHistory() {
    searchHistoryEl.empty();
    let savedHistory = JSON.parse(localStorage.getItem("searchHistory"));
    for (let i = 0; i < savedHistory.length; i++) {
        let newListItem = $("<li>").attr("class", "historyEntry");
        newListItem.text(savedHistory[i]);
        searchHistoryEl.prepend(newListItem);
    }
}

//LOAD FORECAST DATA FUNCTION
function loadWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    cityNameText.text(cityName)
    currentDataText.text(`(${today})`)
    tempText.text(`Temperature: ${cityTemp} °F`);
    humidityText.text(`Humidity: ${cityHumidity}%`);
    speedText.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndexText.text(`UV Index: ${uvVal}`);
    weatherImg.attr("src", cityWeatherIcon);
}


//APIKEY
let APIKEY = "21ca0c7b8c26cd198ed0e6dae154de2c";



//DATA TO SHOW IN FORECAST BOX
function getWeather(desiredCity) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${APIKEY}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        let cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherData.wind.speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${APIKEY}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvData) {
        if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
            let savedHistory = [];
            // Keeps user from adding the same city to the searchHistory array list more than once
            if (savedHistory.indexOf(cityObj.cityName) === -1) {
                savedHistory.push(cityObj.cityName);
                // store our array of searches and save 
                localStorage.setItem("searchHistory", JSON.stringify(savedHistory));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                loadWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                showHistory(cityObj.cityName);
            }else{
                
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                loadWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                console.log("This city already has been searched.")
            }
        }else{
            let savedHistory = JSON.parse(localStorage.getItem("searchHistory"));
            // Keeps user from adding the same city to the searchHistory array list more than once
            if (savedHistory.indexOf(cityObj.cityName) === -1) {
                savedHistory.push(cityObj.cityName);
                // store our array of searches and save 
                localStorage.setItem("searchHistory", JSON.stringify(savedHistory));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                loadWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                showHistory(cityObj.cityName);
            }else{
                
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                loadWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                console.log("This city already has been searched.")
            }
        }
        
    })
        
    });
    create5dayCard();




    //DATA TO CREATE 5-DAY FORECAST
    function create5dayCard() {
        cardRow.empty();
        let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${APIKEY}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function(fiveDayReponse) {
            for (let i = 0; i != fiveDayReponse.list.length; i+=8 ) {
                let cityObj = {
                    date: fiveDayReponse.list[i].dt_txt,
                    icon: fiveDayReponse.list[i].weather[0].icon,
                    temp: fiveDayReponse.list[i].main.temp,
                    humidity: fiveDayReponse.list[i].main.humidity
                }
                let dateStr = cityObj.date;
                let trimmedDate = dateStr.substring(0, 10); 
                let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
            }
        })
    }   
}




//5-DAY FORECAST CARD  - ELEMENTS
function createForecastCard(date, icon, temp, humidity) {

    // NEW elements to create to make 3-day forecast card
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h3>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}


