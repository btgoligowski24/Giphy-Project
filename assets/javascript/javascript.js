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
        persistMovies: [],

        // This doesn't work, I'd be curious to know if you could generate the url outside the AJAX call to and pass it into it, but I keep getting CORS errors.
        //    queryURL: function() {
        //        var url = "https://api.giphy.com/v1/gifs/search?api_key=3ImgVPYGAgw75lJTDGZ8FNGYVAnFqwCY&limit=10&q=Wedding+Crashers";
        //        return url
        //},
        counter: 0,
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
                console.log("this: ", this);
                var results = response.data;
                console.log(results);
                if ($("#movieGifsHere").children().length > 0) {
                    $("#movieGifsHere").prepend("<hr>");
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
                        "class": "rounded gif"
                    });
                    $(newDivElem).css("display", "inline-block");
                    $(newDivElem).attr({
                        "class": "my-3 mx-auto mx-xl-3",
                        "id": gifs.counter
                    });
                    $(newImgElem).on("click", gifs.animateGif);
                    $(newSubDivElem).append(newPElem);
                    $(newSubDivElem).append(favoritesButtonElem);
                    $(newDivElem).append(newSubDivElem);
                    $(newDivElem).append(newImgElem);
                    $("#movieGifsHere").prepend(newDivElem);
                    gifs.counter++;
                }
                $(".addFavorite").on("click", gifs.addToFavorites);
            })
        },
        addToFavorites: function () {
            $(this).html("<img src=\"assets/images/broken-heart.png\" width=\"24px\">");
            $(this).removeClass("btn-warning").addClass("btn-danger");
            var move = $(this).parents().eq(1)
            if ($("#favorites").children().length === 0) {
                $(move).removeClass("my-3").removeClass("mx-xl-3");
            } else {
                $(move).removeClass("mx-xl-3").removeClass("my-3").addClass("mb-xl-3");
            }
            $(this).off("click");
            $(this).on("click", gifs.removeFromFavorites);
            $("#favorites").prepend(move);
        },
        removeFromFavorites: function () {
            $(this).html("<img src=\"assets/images/star.png\" width=\"24px\">");
            $(this).removeClass("btn-danger").addClass("btn-warning");
            var move = $(this).parents().eq(1);
            $(move).removeClass("mb-xl-3").addClass("m-xl-3 my-3");
            $(this).off("click");
            $(this).on("click", gifs.addToFavorites);
            if ($("#" + ($(this).parents().eq(1).attr("id") - 1)).parent().attr("id") === "favorites") {
                $("#movieGifsHere").prepend(move);
            } else {
                $(move).insertBefore($("#" + ($(this).parents().eq(1).attr("id") - 1)));
            }
            if ($("#favorites").children($(":last-child")).hasClass("mb-xl-3")) {
                $("#favorites").children($(":last-child")).removeClass("mb-xl-3")
            }
        }
    }

    $("#submit").on("click", function () {
        gifs.movies.push($("#movieInput").val().trim());
        $("#movieInput").val("");
        gifs.buttonArray(gifs.movies);
    });

    gifs.buttonArray(gifs.movies);
})