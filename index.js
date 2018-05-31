// Javascript globals
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/search";
let state = {
    queryResults: {},
    dayIndex: 0,
    playlists: [],
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
            console.log(savedData);
            $(".day-forecast__results").find("*").not(".pEXTforecast").not(".ext-forecast__link").remove();
            let day = savedData.data[state.dayIndex];

            let date = new Date(day.datetime).toDateString();

            let HTMLData = `<h3>Todays weather for ${savedData.city_name}</h3> 
            <h4>${date}</h4>
            <p> ${day.weather.description}</p>
            <img src ="icons/${day.weather.icon}.png"
            alt = "${day.weather.description} icon"><span>${day.temp}°</span>`;
            $(".day-forecast__results").prepend(HTMLData);


            $(".extended-forecast").empty();
            $(".extended-forecast").append(`
            <h3> Extended forecast
            for ${savedData.city_name} </h3>
            <p> Click a day for more info </p>`);

            for (let i = 0; i < savedData.data.length; i++) {
                let extDay = savedData.data[i];
                let thisDay = savedData.data[i].datetime;
                let dateEXT = new Date(thisDay).toDateString();


                $(".extended-forecast").append(`
            <div class="extended-forecast-day">
            <a class="extended-day-link" href="#" data-index=${i}> <h4>${dateEXT}</h4> </a>
            <img src="icons/${extDay.weather.icon}.png"
            alt= "${extDay.weather.description} icon"> 
            ${extDay.temp}°<p>${extDay.weather.description}</p>
            </div>`);
            }

        },



        // showPlaylist: function(playlists){
        //     let html = "";
        //     console.log(playlist.snippet.title);
        //     $(".playlist").removeClass("hidden");
        // },
        //   < p > This playlist will set the mood
        //   for today < /p> <
        //       p > youtube playlist < /p> <
        //       p > < a href = "#" > Get another playlist < /a></p>


        showPlaylist: function (playlists) {
            var html = "";
            $.each(playlists, function (index, playlist) {

                // Append results li to ul
                console.log(playlist.snippet.title);
                console.log(playlist.snippet.thumbnails.high.url);

                html = html + "<li><p>" + playlist.snippet.title +
                    "</p><a target='_blank' href='https://www.youtube.com/watch?v=" + playlist.id.playlistId + "'><img src='" + playlist.snippet.thumbnails.high.url + "'/></a></li>";
            });
            $("#search-results ul").html(html);
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
        console.log(state.queryResults);
    },

    getYoutubePlaylistFromAPI: function (searchTerm, callback) {
        
        const query = {
            part: "snippet",
            key: "AIzaSyBkK8PEuhSfyz05gnUWhwOuE5cqWV5Oa3A",
            q: searchTerm,
            type: "playist",
            maxResults: 5
        };
        console.log(searchTerm);
        $.getJSON(YOUTUBEPLAYLIST_URL, query, callback);
    },

    savePlaylistData: function (data) {
        state.playlists.push(data.items);
        console.log(state);
        
    } 
};
$(App.reset());