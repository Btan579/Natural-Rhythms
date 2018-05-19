const OPENWEATHER_CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_FIVEDAY_URL = "https://api.openweathermap.org/data/2.5/forecast";
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlists";


// openweathermap key = bad3b25dd3d41c8a3eaa1f49cc42d949
// youtubeplaylist key = AIzaSyDwFW6hwpaeJu8pwYWtoQ7XFndiXYSXFRE


const App = {
   
    reset: function () {
        EventListeners.startListeners();
        HTMLRenderer.showSection(".intro");
    },

    search: function (query) {
        this.getDataFromAPI(query, HTMLRenderer.showDayForecast);
    },

    getDataFromAPI: function (searchTerm, callback) {
        let location = searchTerm;
        const query = {
           q: location,
           units: "imperial",
            
            appid: "bad3b25dd3d41c8a3eaa1f49cc42d949"
        };
        

    
    isNaN(location) ? query.city = location : query.zip = location;


    $.getJSON(OPENWEATHER_CURRENT_URL, query, callback).fail(HTMLRenderer.showErr);

    HTMLRenderer.showSection(".day-forecast__results");
    }
};

   

$(App.reset());