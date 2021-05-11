let error = document.getElementById("error");
let CountryInput = document.getElementById("countries");
let cityName = document.getElementById("cityname");
let cityDate = document.getElementById("date");
let cityDeg = document.getElementById("degrees");
let cityCond = document.getElementById("condition");
let cityMinMax = document.getElementById("minmax");

// Get all the APIS w the async func & combine them with the spread operator.
const getWeather = async (cityName, countryCode, callback) => {
    // TRY catch to listen for errors if the user input a city and country that's not correct.
    try {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=aebc83f1cbbd44b3abb1d008ffe4de33`);
        const weer = await data.json();

        // get the lat & lang info from the first api fetch to parse to the 7 day forecast, which needs a lat & long instead of city name.
        let lat = weer.coord.lat;
        let lon = weer.coord.lon;
        let city = weer.name;

        const forcData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=aebc83f1cbbd44b3abb1d008ffe4de33`);
        const forcast = await forcData.json();

        // Get the city name and parse through to unsplash to get a random city image.
        const photoData = await fetch(`https://api.unsplash.com/search/photos?query=${city}-nature&client_id=Lgfa96r1w4FjuxvOUFRM-Ya4wz-BQQArBLMN6YwDlaU`);
        const photo = await photoData.json();

        // pick a random country based on the html input options to display it as a random first image.
        let landen = Array.from(document.getElementsByTagName("option"));
        let cntrArr = [];
        landen.forEach((elem) => {
            cntrArr.push(elem.innerHTML);
        })
        let random = Math.floor(Math.random() * cntrArr.length);
        let SinglCountries = cntrArr[random];

        const randombgdata = await fetch(`https://api.unsplash.com/search/photos?query=${SinglCountries}&client_id=Lgfa96r1w4FjuxvOUFRM-Ya4wz-BQQArBLMN6YwDlaU`);
        const rndbg = await randombgdata.json();

        //putting all the objects together with the spread operator and push the country results in the combine object with another name so it doest get overwritten.
        let combine = {...weer, ...forcast, ...photo};
        combine.results2 = rndbg.results;

        callback(combine);
        CountryInput.style.color = "black";
        error.style.color = "rgba(255,0,0,0.0)";

    } catch (e) {
        CountryInput.style.color = "red";
        error.style.color = "rgba(255,0,0,1)";
    }

};

//Random image on page load.
let cityVal = document.getElementById("city-input").value;
let countryCode = document.getElementById("countries").value;

getWeather(cityVal, countryCode, (weathAPI) => {
    let backG = document.getElementById("background");
    console.log(weathAPI);
    backG.style.backgroundImage = `url("${weathAPI.results2[0].urls.regular}")`;
});

//On click button, get all the data and display it.
document.getElementById("run").addEventListener('click', function () {
    let cityVal = document.getElementById("city-input").value;
    let countryCode = document.getElementById("countries").value;


    getWeather(cityVal, countryCode, (weathAPI) => {
        convertDate(weathAPI);
        changeUI(weathAPI);
        changeWeather(weathAPI);
        changeForecast(weathAPI);
    });

});

//func to create table and put in the correct forecast per day.
function changeForecast(weathAPI) {
    //Creating the table + 7x tr + 3x td
    let target = document.getElementById("target");
    let table = document.createElement('table');
    for (let i = 0; i < 7; i++) {
        let tr = document.createElement('tr');

        for (let i = 0; i < 3; i++) {
            let td = document.createElement('td');
            table.appendChild(tr).appendChild(td);
        }

    }
    target.appendChild(table);

    //after the table exist. fill it in with the forecast.
    let tableArr = Array.from(document.querySelectorAll("table tr"));
    let daily = weathAPI.daily.slice(1, 8);
    daily.forEach((elem, index) => {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let date = new Date(elem.dt * 1000);
        let day = days[date.getDay()];
        let min = Math.round(elem.temp.min);
        let max = Math.round(elem.temp.max);
        let condition = elem.weather[0].main;
        tableArr[index].firstChild.innerHTML = day;
        tableArr[index].childNodes[1].innerHTML = condition;
        tableArr[index].childNodes[2].innerHTML = `${min}°c / ${max}°c`;

    });


}

//Make the DOM elements move up and some appear when clicked the search button.
function changeUI(weathAPI) {
    //get DOM element
    let backG = document.getElementById("background");
    //Make rand nr from 1-9
    let randNr = Math.floor(Math.random() * 9);
    //use that rand nr to pull a random image in an array from unsplash api.
    let unsplashBG = weathAPI.results[randNr].urls.regular;
    //pull description from photo from unsplash.
    let picDesc = weathAPI.results[randNr].description;
    //change the bg.
    backG.style.backgroundImage = `url('${unsplashBG}')`;

    //Some styling to make it smooth.
    document.getElementById("background").style.height = "140vh";
    document.getElementById("form").style.marginTop = "2vh";
    document.getElementById("blackout").style.opacity = "0.5";
    document.getElementById("blackout").style.height = "140vh";
    document.getElementById("weather").style.display = "block";
}

//func to display the weather for the requested city.
function changeWeather(weathAPI) {
    let Cname = weathAPI.name;
    cityName.innerHTML = `<h1>${Cname}</h1>`;
    cityDeg.innerHTML = Math.round(weathAPI.current.temp) + "°";
    cityCond.innerHTML = weathAPI.current.weather[0].main;
    cityMinMax.innerHTML = Math.round(weathAPI.daily[0].temp.min) + "° / " + Math.round(weathAPI.daily[0].temp.max) + "°";
}


//The dayes wer ein UNIX timestamp, func to convert it.
function convertDate(weathAPI) {

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let unix_timestamp = weathAPI.dt;
    let date = new Date(unix_timestamp * 1000);
    let year = date.getFullYear();
    let day = days[date.getDay()];
    let dayMonth = date.getDate();
    let month = months[date.getMonth()];
    let formattedTime = `${day} ${dayMonth} ${month}, ${year}`;
    cityDate.innerHTML = formattedTime;
}
