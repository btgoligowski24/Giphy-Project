$(document).ready(function () {

    var gifs = {
        movies: [
            "Wedding Crashers",
            "Blazing Saddles",
            "Office Space",
            "Black Sheep",
            "Tommy Boy",
            "The Boondock Saints",
            "Good Will Hunting",
            "Guardians of the Galaxy",
            "Monty Python and the Holy Grail",
            "The Princess Bride",
            "Shawshank Redemption",
            "Super Troopers",
            "The Matrix",
            "Step Brothers",
        ],

        // This doesn't work, I'd be curious to know if you could generate the url outside the AJAX call to and pass it into it, but I keep getting CORS errors.
    //    queryURL: function() {
    //        var url = "https://api.giphy.com/v1/gifs/search?api_key=3ImgVPYGAgw75lJTDGZ8FNGYVAnFqwCY&limit=10&q=Wedding+Crashers";
    //        return url
    //},
        createButton: function (str) {
            var newButtonElem = $("<button>");
            $(newButtonElem).attr({
                "type": "button",
                "class": "btn btn-sm btn-dark m-1",
                "data-movie": str
            });
            $(newButtonElem).text(str);
            $(newButtonElem).on("click", gifs.getGifs);
            $("#buttons").append(newButtonElem);
        },
        buttonArray: function (arr) {
            $("#buttons").empty();
            $(arr).each(function (index, value) {
                gifs.createButton(value);
            })

        },
        animateGif: function () {
            if ($(this).attr("data-state") === "still") {
                $(this).attr({
                    "src": $(this).attr("data-animate"),
                    "data-state": "animate"
                })
            } else {
                $(this).attr({
                    "src": $(this).attr("data-still"),
                    "data-state": "still"
                })
            }
        },
        getGifs: function () {
            var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=3ImgVPYGAgw75lJTDGZ8FNGYVAnFqwCY&limit=10";
            var movie = $(this).attr("data-movie");
            movie = movie.replace(/\s/g, "+");
            queryURL = queryURL + "&q=" + movie;
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (response) {
                $("#movieGifsHere").empty();
                var results = response.data;
                for (index in results) {
                    var newDivElem = $("<div>");
                    var newPElem = $("<p>");
                    var newImgElem = $("<img>");
                    $(newPElem).html("<span class=\"font-weight-bold\">Rating:</span> " + results[index].rating);
                    $(newPElem).attr("class", "mb-1");
                    $(newImgElem).attr({
                        "src": results[index].images.fixed_height_still.url,
                        "data-state": "still",
                        "data-still": results[index].images.fixed_height_still.url,
                        "data-animate": results[index].images.fixed_height.url,
                        "class": "rounded gif"
                    });
                    $(newDivElem).css("display", "inline-block");
                    $(newDivElem).attr("class", "m-3");
                    $(newImgElem).on("click", gifs.animateGif);
                    $(newDivElem).append(newPElem);
                    $(newDivElem).append(newImgElem);
                    $("#movieGifsHere").append(newDivElem);
                }
            })
        }

    }

    $("#submit").on("click", function() {
        gifs.movies.push($("#movieInput").val().trim());
        gifs.buttonArray(gifs.movies);
    });

    gifs.buttonArray(gifs.movies);
})


// "*****&q=wedding crashers*********&offset=0********&rating=R*********&lang=en"