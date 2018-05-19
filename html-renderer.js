const HTMLRenderer = {

        showSection: function(sectionToShow) {
            const sections = [".intro", ".playlist", ".day-forecast__results",".extended-forecast"];
            sections.forEach(function(item, index){
                $(item).addClass("hidden");
            });
            $(sectionToShow).removeClass("hidden");
        },

        
        
        showDayForecast: function (data) {
            
            // data ? console.log(data) : this.showErr();
            let result = data;
            let iconCode = result.weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            let HTMLData = `<h3>Today's weather for ${result.name}</h3>
                <img src =${iconURL}>
                <ul>
                    <li> ${result.weather[0].description}</li>
                    <li>${result.main.temp}°F</li>
                </ul>`;
           
            $(".day-forecast__results").prepend(HTMLData);
    },

        showExtendedForecast: function () {
            $(".intro").addClass("hidden");
            $(".day-forecast__results").addClass("hidden");
            $(".playlist").addClass("hidden");
            $(".extended-forecast").removeClass("hidden");
        },

        showErr: function () {
            alert("error");
            return;
        }

};



//   < p > This playlist will set the mood
//   for today < /p> <
//       p > youtube playlist < /p> <
//       p > < a href = "#" > Get another playlist < /a></p >