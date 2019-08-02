function test() {
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=3ImgVPYGAgw75lJTDGZ8FNGYVAnFqwCY&q=wedding crashers&limit=25&offset=0&rating=R&lang=en",
        method: "GET"
    }).then(function(response) {
        var results = response.data;
    }) 
}