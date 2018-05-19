const EventListeners = {
    listenersStarted: false,
    searchQuery: "",

    startListeners: function () {

        if (!this.listenersStarted) {
            this.handleSubmit();
            this.handleHeaderLinkClicked();
            this.handleEXTForecastLinkClicked();
            
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
            
             App.search(this.searchQuery);
             
             queryTarget.val("");
             
             
        });
    },

    handleEXTForecastLinkClicked: function () {
        $(".day-forecast__link").click(function (event) {
            HTMLRenderer.showSection(".extended-forecast");
        });
    }
};

