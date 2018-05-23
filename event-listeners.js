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

    handleHeaderLinkClicked: function(){
        $(".header__link").click(function(event){
            App.reset();
        });
    },

    handleSubmit: function(){
        $(".intro__form").submit(function(event){
            event.preventDefault();
            const queryTarget = $(this).find(".intro__query");
            this.searchQuery = queryTarget.val();
            EventListeners.handleEXTForecastLinkClicked(this.searchQuery);
            App.searchWeather(this.searchQuery);
            queryTarget.val("");
        });
    },

    handleEXTForecastLinkClicked: function(){
        $(".ext-forecast__link").on("click", function(event){
        HTMLRenderer.showExtendedForecast(this.searchQuery);
        });
    },

    handleEXTdaylinkClicked: function(){
        $(".extended-forecast").on("click", ".extended-day-link", function(event){
            event.preventDefault();
            const parent = $(this).parent();
            const index = parent.data("index");
            console.log(index);
            HTMLRenderer.showDayForecast(App.queryResults, index);
        });
    }
};

