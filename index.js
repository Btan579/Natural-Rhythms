// Javascript globals
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/search";
let state = {
    queryResults: {},
    dayIndex: 0,
    playlists: [],
    playlistIndex: 0,
};

// API Keys
// weatherBIT key = 0c56da0e06074738826751b7646a5ebf
// youtubeplaylist key = AIzaSyDwFW6hwpaeJu8pwYWtoQ7XFndiXYSXFRE

// HTML Rendering
const HTMLRenderer = {
    showSection: function (sectionToShow) {
        const sections = [".intro", ".playlist", ".day-forecast__results", ".extended-forecast"];
        sections.forEach(function (item, index) {
            $(item).addClass("hidden");
        });
        $(sectionToShow).removeClass("hidden");
    },

    showDayForecast: function (savedData) {
        $(".day-forecast__results").find("*").not(".pEXTforecast").not(".ext-forecast__link").not("br").remove();
        let day = savedData.data[state.dayIndex];
        let date = new Date(day.datetime).toDateString();
        let HTMLData = `<h3>Today's weather for ${savedData.city_name}</h3> 
            <h4>${date}</h4>
            <p>${day.weather.description}</p>
            <img src="icons/${day.weather.icon}.png"
            alt ="${day.weather.description}icon"><br><span>${day.temp}°</span>`;
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
            alt = "${extDay.weather.description} icon"><br>
            ${extDay.temp}°
            </div>
            </div>`);
        }
        App.randomPlaylist();
    },

    showPlaylist: function (playlists) {
        $("#search-results").empty();
        console.log(playlists);
        let currentPlaylist = playlists[state.dayIndex];
        console.log(currentPlaylist);
        $("#search-results").append(`<h3>Heres what you should listen to in ${state.queryResults.city_name}.</h3>`);

        var html = "";
        html = html + "<div class='col-6'><h4>" + currentPlaylist[state.playlistIndex].snippet.title +
            "</h4></div><div class='col-6'><a target='_blank' href='https://www.youtube.com/playlist?list=" + currentPlaylist[state.playlistIndex].id.playlistId + "'><img class='vidThumbnail' src='" + currentPlaylist[state.playlistIndex].snippet.thumbnails.high.url + "'/></a></div>";
        $("#search-results").append(html);
    },

    showErr: function () {
        alert("error");
        return;
    }
};

// Event Listeners

const EventListeners = {
    listenersStarted: false,
    searchQuery: "",

    startListeners: function () {
        if (!this.listenersStarted) {
            this.handleSubmit();
            this.handleHeaderLinkClicked();
            this.handleEXTForecastLinkClicked();
            this.handleEXTdaylinkClicked();
            this.listenersStarted = true;
        }
    },

    handleHeaderLinkClicked: function () {
        $(".header__link").click(function (event) {
            App.reset();
        });
    },

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

    handleEXTForecastLinkClicked: function () {
        $(".ext-forecast__link").on("click", function (event) {
            $(".day-forecast__results").addClass("hidden");
            $(".extended-forecast").removeClass("hidden");
            $(".playlist").addClass("hidden");
        });
    },

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
    reset: function () {
        state = {
            queryResults: {},
            dayIndex: 0,
            playlists: [],
        };
        EventListeners.startListeners();
        HTMLRenderer.showSection(".intro");
    },

    searchWeather: function (query) {
        this.getWeatherDataFromAPI(query, App.saveData);
    },

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

    saveData: function (data) {

        state.queryResults = data;
        for (let i = 0; i < data.data.length; i++) {
            App.getYoutubePlaylistFromAPI(data.data[i].weather.description + " songs", App.savePlaylistData);
        }
        HTMLRenderer.showDayForecast(state.queryResults);
    },

    getYoutubePlaylistFromAPI: function (searchTerm, callback) {
        const query = {
            part: "snippet",
            key: "AIzaSyBkK8PEuhSfyz05gnUWhwOuE5cqWV5Oa3A",
            q: searchTerm,
            type: "playlist",
            maxResults: 5
        };
        $.getJSON(YOUTUBEPLAYLIST_URL, query, callback);
    },

    savePlaylistData: function (data) {
        state.playlists.push(data.items);
        HTMLRenderer.showPlaylist(state.playlists);

    },

    randomPlaylist: function () {
        state.playlistIndex = Math.floor(Math.random() * 5);
    }
};
$(App.reset());