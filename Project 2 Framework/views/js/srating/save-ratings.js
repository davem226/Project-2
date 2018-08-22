$(function () {
    // Get all ratings from logged-in user
    var uid = $("strong").attr("uid");

    $.get("/api/ratings/" + uid).then(function (data) {
        // For each rating by this user
        for (i in data) {
            var rating = data[i].rating;
            var apiID = data[i].apiID;

            // "Save" rating in stars
            $("#star" + apiID).children("a").each(function (counter) {
                if (counter < rating) {
                    $(this).attr("class", "fa-star fa");
                    counter++;
                }
            });
        }
    });

});