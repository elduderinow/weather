

const getWeather = async (cityName,cnt, callback) => {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=aebc83f1cbbd44b3abb1d008ffe4de33`);
    const weer = await data.json();

    let lat = weer.coord.lat;
    let lon = weer.coord.lon;

    const forcData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=aebc83f1cbbd44b3abb1d008ffe4de33`);
    const forcast = await forcData.json();

    let combine = {...weer,...forcast};
    callback(combine);
};

document.getElementById("run").addEventListener('click', function () {
  let cityVal =  document.getElementById("city-input").value;
  let  days = 5;
  let country = document.getElementById("country-input").value;
    console.log(getCountryCodeOrName(country));



    getWeather(cityVal,days, (weathAPI) => {
        console.log(weathAPI);
        convertDate(weathAPI);

    });

});


function convertDate(weathAPI) {

    let unix_timestamp = weathAPI.dt;
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
// Hours part from the timestamp
    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    console.log(formattedTime);
}