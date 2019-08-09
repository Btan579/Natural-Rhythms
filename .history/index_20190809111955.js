// Javascript globals
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/search";
//  State's varaible help  manage saved  API data and index's for both  API data sets.
let state = {
    queryResults: {},
    dayIndex: 0,
    playlists: [],
    playlistIndex: 0,
};

// API Keys
// weatherBIT key = 0c56da0e06074738826751b7646a5ebf
// youtubeplaylist key = AIzaSyDTwQeBX6nmrLTMs98WLsQc5er6djjcDgk

// HTML Rendering 
const HTMLRenderer = {
    // showSection manages each of the sections of html to show and hide when the app is reset.
    showSection: function (sectionToShow) {
        const sections = [".intro", ".playlist", ".day-forecast__results", ".extended-forecast"];
        sections.forEach(function (item, index) {
            $(item).addClass("hidden");
        });
        $(sectionToShow).removeClass("hidden");
    },
    //  showDayForecast takes the saved queryResults object based on the city/zip searched and displays the forecast for the day.
    // Generates each of the daily forecasts using for the extended forcast.
    // 
    showDayForecast: function (savedData) {
        $(".day-forecast__results").find("*").not(".pEXTforecast").not(".ext-forecast__link").not("br").remove();
        let day = savedData.data[state.dayIndex];
        let date = new Date(day.datetime).toDateString();
        let HTMLData = `<h3>Today's weather for ${savedData.city_name}</h3> 
            <h4>${date}</h4>
            <p>${day.weather.description}</p>
            <img src="icons/${day.weather.icon}.png"
            alt ="${day.weather.description}icon"><br class="display-temp"><span>${day.temp}°</span>`;
        $(".day-forecast__results").prepend(HTMLData);

        $(".extended-forecast").empty();
        $(".extended-forecast").append(`
            <h3> Extended forecast for ${savedData.city_name}</h3>
            <p>Click a day for more info</p>`);

        for (let i = 0; i < savedData.data.length; i++) {
            let extDay = savedData.data[i];
            let thisDay = savedData.data[i].datetime;
            let dateEXT = new Date(thisDay).toDateString();

            $(".extended-forecast").append(`
            <div class = "row">
            <div class ="extended-forecast-day">
            <a class="extended-day-link" href="#" data-index=${i}><h4>${dateEXT}</h4></a>
            <p>${extDay.weather.description}</p>
            <img src="icons/${extDay.weather.icon}.png"
            alt = "${extDay.weather.description} icon"><br class="ext-temp">
            ${extDay.temp}°
            </div>
            </div>`);
        }
        App.randomPlaylist();
    },
    //  showPlaylist takes the saved playlist array and displays a single playlist depending on the dayIndex.
    showPlaylist: function (playlists) {
        console.log(playlists);
        $("#search-results").empty();
        let currentPlaylist = playlists[state.dayIndex];
        $("#search-results").append(`<h3>Heres what you should listen to in ${state.queryResults.city_name}.</h3>`);

        var html = "";
        html = html + "<div class='col-6'><h4>" + currentPlaylist[state.playlistIndex].snippet.title +
            "</h4></div><div class='col-6'><a target='_blank' href='https://www.youtube.com/playlist?list=" + currentPlaylist[state.playlistIndex].id.playlistId + "'><img class='vidThumbnail' src='" + currentPlaylist[state.playlistIndex].snippet.thumbnails.high.url + "'/></a></div>";
        $("#search-results").append(html);
    },
    // Displays and error alert  if API request fails.
    showErr: function () {
        alert("error");
        return;
    }
};

// Event Listeners

const EventListeners = {
    listenersStarted: false,
    searchQuery: "",
    // startListeners controls the event listeners to start listening once the App tells startListeners to start.
    startListeners: function () {
        if (!this.listenersStarted) {
            this.handleSubmit();
            this.handleHeaderLinkClicked();
            this.handleEXTForecastLinkClicked();
            this.handleEXTdaylinkClicked();
            this.listenersStarted = true;
        }
    },
    //  handleHeaderLinkClicked resets the App when the header is clicked
    handleHeaderLinkClicked: function () {
        $(".header__link").click(function (event) {
            App.reset();
        });
    },
    // handleSubmit takes the city or zipcode that is entered and passes it to searchWeather to be used as the query for the API data request..
    // hides the intro and displays the Day forcast and the suggested playlist.
    handleSubmit: function () {
        $(".intro__form").submit(function (event) {
            event.preventDefault();
            const queryTarget = $(this).find(".intro__query");
            this.searchQuery = queryTarget.val();
            App.searchWeather(this.searchQuery);
            EventListeners.handleEXTForecastLinkClicked(this.searchQuery);
            $(".playlist").removeClass("hidden");
            $(".day-forecast__results").removeClass("hidden");
            $(".intro").addClass("hidden");
            queryTarget.val("");
        });
    },
    // handleEXTForecastLinkClicked lisened for the extended forecast link to be clicked and hides the day forecast, playlist.
    // Shows the extended forecast.
    handleEXTForecastLinkClicked: function () {
        $(".ext-forecast__link").on("click", function (event) {
            $(".day-forecast__results").addClass("hidden");
            $(".extended-forecast").removeClass("hidden");
            $(".playlist").addClass("hidden");
        });
    },
    // handleEXTdaylinkClicked  hides the extended forecast, changes the day forecast to the selected day and shows the new playlist.
    handleEXTdaylinkClicked: function () {
        $(".extended-forecast").on("click", ".extended-day-link", function () {
            event.preventDefault();
            const parent = $(this).parent();
            const index = $(this).data("index");
            state.dayIndex = parseInt(index);
            HTMLRenderer.showPlaylist(state.playlists);
            HTMLRenderer.showDayForecast(state.queryResults);
            $(".day-forecast__results").removeClass("hidden");
            $(".extended-forecast").addClass("hidden");
            $(".playlist").removeClass("hidden");
        });
    }
};


//  Application Functions

const App = {
    // reset's all the state variables to empty or 0 to take in new API data. 
    // Starts event listeners and shows the intro
    reset: function () {
        state = {
            queryResults: {},
            dayIndex: 0,
            playlists: [],
        };
        EventListeners.startListeners();
        HTMLRenderer.showSection(".intro");
    },
    // Accepts the value from the user inputted city or zipcode and passes query to getWeatherDataFromAPI and callback to saveData.

    searchWeather: function (query) {
        this.getWeatherDataFromAPI(query, App.saveData);
    },
    //   Request's 6 day forecast from Weatherbit API based on city or zip code.
    
    getWeatherDataFromAPI: function (searchTerm, callback) {
        const query = {
            key: "0c56da0e06074738826751b7646a5ebf",
            units: "I",
            days: 6
        };

        if (isNaN(searchTerm)) {
            query.city = searchTerm;
        } else {
            query.postal_code = searchTerm;
            query.country = "US";
        }
        $.getJSON(WEATHERBIT_URL, query, callback).fail(HTMLRenderer.showErr);
    },
    // Saves JSON data from Weatherbit API  in state.queryResults.
    // Loops over weather description from weather API data and passes to savePlaylistData.
    // Passes weather data to showDayForecast to be displayed.
    // Passes weather description concated with songs  to getYoutubePlaylistFromAPI to be used as part of the searchTerm.
    saveData: function (data) {

        state.queryResults = data;
        for (let i = 0; i < data.data.length; i++) {
            App.getYoutubePlaylistFromAPI(data.data[i].weather.description + " songs", App.savePlaylistData);
        }
        HTMLRenderer.showDayForecast(state.queryResults);
    },
    // getYoutubePlaylistFromAPI makes a API data request to youtube for playlists.
    getYoutubePlaylistFromAPI: function (searchTerm, callback) {
       
        const query = {
            part: "snippet",
            key: "AIzaSyDTwQeBX6nmrLTMs98WLsQc5er6djjcDgk",
            q: searchTerm,
            type: "playlist",
            maxResults: 5
        };
        $.getJSON(YOUTUBEPLAYLIST_URL, query, callback);
        
    },
    // Saves the YouTube playlist API data in state.playlists and pushes the saved data to be displayed in showPlaylist.
    savePlaylistData: function (data) {
        // console.log(data.items);
        state.playlists.push(data.items);
        HTMLRenderer.showPlaylist(state.playlists);

    },
    // Generates a random playlist to be displayed using the index of the saved playlists data array.
    randomPlaylist: function () {
        state.playlistIndex = Math.floor(Math.random() * 5);
    }
};
$(App.reset());