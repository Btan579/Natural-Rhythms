// Javascript globals
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/search";


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

    showDayForecast: function (data, index) {
        console.log(data);
        let day = data.data[App.dayIndex];
        let date = new Date(day.datetime).toDateString();


        let HTMLData = `<h3>Todays weather for ${data.city_name}</h3>
            <h4>${date}</h4>
            <p> ${day.weather.description}</p>
            <img src ="icons/${day.weather.icon}.png"
            alt = "${day.weather.description} icon">${day.temp}`;
        $(".day-forecast__results").prepend(HTMLData);

        $(".extended-forecast").append(`
            <h3> Extended forecast
            for ${day.city_name} </h3>
            <p> Click a day for more info </p>`);

        for (let i = 0; i <= data.data.length; i++) {
            let dateEXT = new Date(data.data[i].datetime).toDateString();
            let day = data.data[index];
            $(".extended-forecast").append(`
                    <div class="extended-forecast-day" data-index=${i}>
                    <a class="extended-day-link" href="#"> <h4>${dateEXT}</h4> </a>
                    <img src="icons/${data.data[i].weather.icon}.png" alt="${data.data[i].weather.description} icon">
                    <p>${data.data[i].weather.description}</p>
                    </div>`);
        };
    },

    // showPlaylist: function(playlists){
    //     let html = "";
    //     console.log(playlist.snippet.title);
    //     $(".playlist").removeClass("hidden");
    // },
//   < p > This playlist will set the mood
//   for today < /p> <
//       p > youtube playlist < /p> <
//       p > < a href = "#" > Get another playlist < /a></p >

    showExtendedForecast: function () {
        $(".intro").addClass("hidden");
        $(".day-forecast__results").addClass("hidden");
        $(".extended-forecast").removeClass("hidden");
        $(".playlist").addClass("hidden");
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
            EventListeners.handleEXTForecastLinkClicked(this.searchQuery);
            App.searchWeather(this.searchQuery);
            queryTarget.val("");
        });
    },

    handleEXTForecastLinkClicked: function () {
        $(".ext-forecast__link").on("click", function (event) {
            HTMLRenderer.showExtendedForecast(this.searchQuery);
        });
    },

    handleEXTdaylinkClicked: function () {
        $(".extended-forecast").on("click", ".extended-day-link", function (event) {
            event.preventDefault();
            const parent = $(this).parent();
            const index = parent.data("index");
            console.log(index);
            HTMLRenderer.showDayForecast(App.queryResults, index);
        });
    }
};


//  Application Functions

const App = {
    dayIndex: 0,
    queryResults: {},

    reset: function () {
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

        HTMLRenderer.showSection(".day-forecast__results");
    },

    saveData: function (data) {
        this.queryResults = data;
        console.log(data);
        // dayIndex = data.data[i];
        HTMLRenderer.showDayForecast(data);
    },

    getYoutubePlaylistFromAPI: function (searchTerm, callback) {
        const query = {
            "part": "snippet",
            "key": "AIzaSyBkK8PEuhSfyz05gnUWhwOuE5cqWV5Oa3A",
            "q": searchTerm,
            type: "playist"
        };

        $.getJSON(YOUTUBEPLAYLIST_URL, query, callback);
        HTMLRenderer.showSection(".playlist")
    }
};
$(App.reset());