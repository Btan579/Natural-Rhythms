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

    showDayForecast: function (savedData, data) {
            console.log(savedData);
        let day = savedData.data[App.dayIndex];
        
        let date = new Date(day.datetime).toDateString();
        
        let HTMLData = `<h3>Todays weather for ${savedData.city_name}</h3> 
            <h4>${date}</h4>
            <p> ${day.weather.description}</p>
            <img src ="icons/${day.weather.icon}.png"
            alt = "${day.weather.description} icon">${day.temp}°`;
        $(".day-forecast__results").prepend(HTMLData);
        
        console.log(day);
        console.log(savedData.city_name);
        console.log(date);
        console.log(day.weather.description);
        console.log(day.weather.icon);
        console.log(day.temp);


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
            
            
            App.searchWeather(this.searchQuery);
            EventListeners.handleEXTForecastLinkClicked(this.searchQuery);
            
            queryTarget.val("");
            
           

        });
    },

    handleEXTForecastLinkClicked: function () {
        $(".ext-forecast__link").on("click", function (event) {
            HTMLRenderer.showExtendedForecast();
        });
    },

    handleEXTdaylinkClicked: function (query) {
        $(".extended-forecast").on("click", ".extended-day-link", function () {
            event.preventDefault();
            const parent = $(this).parent();
            const index = $(this).data("index");
            
            console.log(index);
            App.dayIndex = parseInt($(this).attr("data-index"));
            
            $(".day-forecast__results").removeClass("hidden");
            $(".extended-forecast").addClass("hidden");
            $(".playlist").removeClass("hidden");
            
            
            
            
            
            
            
        });
    }
};


//  Application Functions

const App = {
    queryResults: {},
    dayIndex: 0,
        

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
        HTMLRenderer.showSection(".playlist");
    }
};
$(App.reset());