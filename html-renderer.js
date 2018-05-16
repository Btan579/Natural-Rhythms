const HTMLRenderer = {

        showSection: function(sectionToShow) {
            const sections = [".intro", ".day-forecast", ".extended-forecast"];
            sections.forEach(function(item, index){
                $(item).addClass("hidden");
            });
            $(sectionToShow).removeClass("hidden");
        },

        
        
        showDayForecast: function (data) {
            console.log(this);
            data ? console.log(data) : this.showErr();
            let result = data.data[0];


            $(".day-forecast__results__result").remove();
            $(".day-forecast__results").prepend(`
            <div class="day-forecast__results__result">
                <p> This playlist will set the mood for today</p>
                <p> youtube playlist</p>
                <p><a href="#"> Get another playlist</a></p>
                <h3>Today's weather for ${result.name}</h3>
                <img src="icon/${result.weather.icon}">
                <ul>
                    <li>${result.weather.description}</li>
                    <li>${result.main.temp}°F</li>
                </ul>
        
        `);
    },

        showExtendedForecast: function () {
            $(".intro").addClass("hidden");
            $(".day-forecast").addClass("hidden");
            $(".extended-forecast").removeClass("hidden");
        },

        showErr: function () {
            alert("error");
            return;
        }

};