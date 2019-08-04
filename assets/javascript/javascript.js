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
            "Stargate"
        ],
        persistMovies: JSON.parse(localStorage.getItem("favorites")),

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
            $("#buttons").append(newButtonElem);
        },
        buttonArray: function (arr) {
            $("#buttons").empty();
            $(arr).each(function (index, value) {
                gifs.createButton(value);
            })

        },
        getGifs: $("#buttons").on("click", "button", function () {
            var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=3ImgVPYGAgw75lJTDGZ8FNGYVAnFqwCY";
            var movie = $(this).attr("data-movie");
            var quantity = $("#numGIF").val();
            movie = movie.replace(/\s/g, "+");
            queryURL = queryURL + "&q=" + movie;
            if (quantity) {
                queryURL = queryURL + "&limit=" + quantity;
            } else {
                queryURL = queryURL + "&limit=10"
            }

            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (response) {
                var results = response.data;
                console.log($("#movieGifsHere").children().length)
                if ($("#movieGifsHere").children().length > 0) {
                    $("#movieGifsHere").prepend("<hr class=\"w-100\">");
                }
                for (index in results) {
                    var newDivElem = $("<div>");
                    var newSubDivElem = $("<div>");
                    var favoritesButtonElem = $("<button>");
                    var newPElem = $("<p class=\"rating mb-0\">");
                    var newImgElem = $("<img>");
                    $(favoritesButtonElem).attr({
                        "class": "addFavorite btn btn-sm btn-warning mb-1"
                    });
                    $(favoritesButtonElem).css("float", "right");
                    $(favoritesButtonElem).html("<img src=\"assets/images/star.png\" width=\"24px\">");
                    $(newPElem).html("<span class=\"font-weight-bold\">Rating:</span> " + results[index].rating);
                    $(newPElem).css({
                        "display": "inline",
                        "float": "left"
                    });
                    $(newImgElem).attr({
                        "src": results[index].images.fixed_height_still.url,
                        "data-state": "still",
                        "data-still": results[index].images.fixed_height_still.url,
                        "data-animate": results[index].images.fixed_height.url,
                        "data-rating": results[index].rating,
                        "class": "rounded gif"
                    });
                    $(newDivElem).attr({
                        "class": "my-3 mx-auto mx-xl-3 gifContainer",
                    });
                    $(newSubDivElem).append(newPElem);
                    $(newSubDivElem).append(favoritesButtonElem);
                    $(newDivElem).append(newSubDivElem);
                    $(newDivElem).append(newImgElem);
                    $("#movieGifsHere").prepend(newDivElem);
                    gifs.counter++;
                }

            })
        }),
        animateGif: $("#movieGifsHere").on("click", "img", function () {
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
        }),
        addToFavorites: $("#movieGifsHere").on("click", ".addFavorite", function () {
            var store = {};
            var move = $(this).parents().eq(1)
            store["dataAnimate"] = $(move).children("img").attr("data-animate");
            store["dataStill"] = $(move).children("img").attr("data-still");
            store["rating"] = $(move).children("img").attr("data-rating");
            gifs.persistMovies.push(store);
            localStorage.setItem("favorites", JSON.stringify(gifs.persistMovies));
            $(move).remove();
            gifs.renderFavorites();
        }),
        renderFavorites: function () {
            var clearButton = $("#clearFavorites");
            $("#favorites").empty();
            if (!Array.isArray(gifs.persistMovies)) {
                gifs.persistMovies = [];
            }
            for (i in gifs.persistMovies) {
                var outerDivElem = $("<div style=\"display: inline-block\" class=\"gifContainer\">");
                var innerDivElem = $("<div>");
                var pElem = $("<p class=\"rating mb-0\" style=\"display: inline; float: left\">");
                var buttonElem = $("<button class=\"addFavorite btn btn-sm mb-1 btn-danger\" style=\"float: right\">");
                var buttonImgElem = $("<img src=\"assets/images/broken-heart.png\" width=\"24px\">")
                var imgElem = $("<img class=\"rounded gif\">");
                var spanElem = $("<span class=\"font-weight-bold\">")
                if ($("#favorites").children().length === 0) {
                    $(outerDivElem).addClass("mx-auto");
                } else {
                    $(outerDivElem).addClass("mx-auto mb-xl-3");
                }
                $(spanElem).text("Rating: ");
                $(outerDivElem).attr("data-storeID", i);
                $(imgElem).attr({
                    "data-still": gifs.persistMovies[i].dataStill,
                    "data-animate": gifs.persistMovies[i].dataAnimate,
                    "data-state": "still",
                    "src": gifs.persistMovies[i].dataStill
                })
                $(pElem).append(spanElem);
                $(pElem).append(gifs.persistMovies[i].rating)
                $(buttonElem).append(buttonImgElem);
                $(innerDivElem).append(pElem);
                $(innerDivElem).append(buttonElem);
                $(outerDivElem).append(innerDivElem);
                $(outerDivElem).append(imgElem);
                $("#favorites").prepend(outerDivElem);
            }
            if ($("#favorites").children().length === 0) {
                $(clearButton).css("display", "none");
            } else {
                $(clearButton).css("display", "inline-block");
            }
        },
        removeFromFavorites: $("#favorites").on("click", ".addFavorite", function () {

            $(this).html("<img src=\"assets/images/star.png\" width=\"24px\">");
            $(this).removeClass("btn-danger").addClass("btn-warning");
            var move = $(this).parents().eq(1);
            var removeID = $(move).attr("storeID");
            $(move).removeClass("mb-xl-3").addClass("mx-xl-3 my-3");
            $("#movieGifsHere").prepend(move);
            gifs.persistMovies.splice(removeID, 1);
            localStorage.setItem("favorites", JSON.stringify(gifs.persistMovies));
            gifs.renderFavorites();
        }),
        clearFavorites: $("#clearFavorites").on("click", function () {
            localStorage.clear();
            gifs.persistMovies = [];
            $("#favorites .gifContainer").each(function (index, value) {
                var move = $(this);
                $(move).children().children("button").removeClass("btn-danger").addClass("btn-warning");
                $(move).children().children().children("img").attr("src", "assets/images/star.png");
                $(move).removeClass("mb-xl-3").addClass("mx-xl-3 my-3");
                $(move).detach();
                $("#movieGifsHere").prepend(move);
                gifs.renderFavorites();
            })
        })
    }
    $("#submit").on("click", function () {
        gifs.movies.push($("#movieInput").val().trim());
        $("#movieInput").val("");
        gifs.buttonArray(gifs.movies);
    });

    gifs.buttonArray(gifs.movies);
    gifs.renderFavorites();
})