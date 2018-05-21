const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/search";


// weatherBIT key = 0c56da0e06074738826751b7646a5ebf
// youtubeplaylist key = AIzaSyDwFW6hwpaeJu8pwYWtoQ7XFndiXYSXFRE


const App = {
        dayIndex: 0,
        queryResults:{},

    reset: function() {
        EventListeners.startListeners();
        HTMLRenderer.showSection(".intro");
    },

    searchWeather: function(query){
        this.getWeatherDataFromAPI(query, App.saveData);
    },

    getWeatherDataFromAPI: function(searchTerm, callback){
               
        const query ={
            key: "0c56da0e06074738826751b7646a5ebf",
            units: "I",
            days: 6
        };

        if (isNaN(searchTerm)){
            query.city = searchTerm;
        } 
        
        else {
            query.postal_code = searchTerm;
            query.country = "US";
        }

        $.getJSON(WEATHERBIT_URL, query, callback).fail(HTMLRenderer.showErr);
                
        HTMLRenderer.showSection(".day-forecast__results");
    },
    
    saveData: function(data){
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
        HTMLRenderer.showSection(".playlist")
    }
};
$(App.reset());