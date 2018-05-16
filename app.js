const OPENWEATHER_CURRENT_URL = "api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_FIVEDAY_URL = "api.openweathermap.org/data/2.5/forecast/daily"
const YOUTUBEPLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlists";

// openweathermap key = 68175e2f52520b2ac4d30af934a37467
// youtubeplaylist key = AIzaSyDwFW6hwpaeJu8pwYWtoQ7XFndiXYSXFRE


const App = {
    reset: function () {
            EventListeners.startListeners(); 
            HTMLRenderer.showIntro(); 
    },

    search: function(query) {
        this.getDataFromAPI(query, HTMLRenderer.showDayForecast):
    },

    getDataFromAPI: function(searchTerm, callback) {
        let location = searchTerm;
        const  query = {
            key: "68175e2f52520b2ac4d30af934a37467",
            city: location
         };
         $.getJSON(OPENWEATHERMAP_URL, query, callback).fail(HTMLRenderer.showErr);
    }        
    };
   


const EventListeners = {listenersStarted: false,
    searchQuery: "",
    
    startListeners: function () {
        
        if (!this.listenersStarted) {
            this.handleSubmit(); 
            this.handleHeaderLinkClicked(); 
            this.handleDayForecastLinkClicked(); 
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
             // App.search(searchQuery);
            HTMLRenderer.showDayForecast(); 
            queryTarget.val(""); 
        }); 
    },
    
    handleDayForecastLinkClicked: function() {
        $(".day-forecast__link").click(function (event) {
            HTMLRenderer.showExtendedForecast(); 
        }); 
    } 
}; 

const HTMLRenderer = {showIntro: function () {
        $(".intro").removeClass("hidden"); 
        $(".day-forecast").addClass("hidden"); 
        $(".extended-forecast").addClass("hidden"); 
    },
    
    showDayForecast: function(data) {
        $(".intro").addClass("hidden"); 
        $(".day-forecast").removeClass("hidden"); 
        $(".extended-forecast").addClass("hidden"); 

        console.log(data);
    },
    
    showExtendedForecast: function () {
            $(".intro").addClass("hidden"); 
            $(".day-forecast").addClass("hidden"); 
            $(".extended-forecast").removeClass("hidden"); 

            alert("showing extened forecast");
        } ,

        showErr: function(){
            alert("error");
        }
}; 
$(App.reset())