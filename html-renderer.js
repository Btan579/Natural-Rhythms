const HTMLRenderer = {

        showSection: function (sectionToShow) {
            const sections = [".intro", ".playlist", ".day-forecast__results", ".extended-forecast"];
            sections.forEach(function (item, index) {
                $(item).addClass("hidden");
            });
            $(sectionToShow).removeClass("hidden");
        },

        showDayForecast: function (data, index) {
            
            let day = data.data[App.dayIndex];
            let date = new Date(day.datetime).toDateString();
            let result = data;
                
            let HTMLData = `<h3>Todays weather for ${result.city_name}</h3>
            <h4>${date}</h4>
            <p> ${day.weather.description}</p>
            <img src ="icons/${day.weather.icon}.png"
            alt = "${day.weather.description} icon">${day.temp}`;
            $(".day-forecast__results").prepend(HTMLData);
             
            $(".extended-forecast").append(`
            <h3> Extended forecast
            for ${result.city_name} </h3>
            <p> Click a day
            for more info </p>`);
              
            for (let i = 0; i <= data.data.length; i++){
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



        //   < p > This playlist will set the mood
        //   for today < /p> <
        //       p > youtube playlist < /p> <
        //       p > < a href = "#" > Get another playlist < /a></p >