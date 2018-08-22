$(function () {
    // If already rated by user

    // Add click handler for all stars
    $(".srating").click(function () {
        // Get clicked api from db table
        var dbid = $(this).attr("dbid");
        $.get("/api/" + dbid
        ).then(function (data) {
            // data.rating will be null if api not rated yet
            if (data.rating) {
                var oldAvg = data.rating;
            } else { oldAvg = 0 }

            var rating = $("#vote" + data.id).html();

            // Send data for the update
            $.ajax({
                url: "/api/rate/" + data.id,
                type: "PUT",
                data: {
                    dbid: data.id,
                    uid: $("strong").attr("uid"),
                    oldAvg: oldAvg,
                    rating: rating,
                    numRatings: data.numRatings
                }
            }).then(function () {
                location.reload();
            });

        });

        // Request to update ratings table
        $.post("api/ratings/", {
            uid: $("strong").attr("uid"),
            dbid: dbid,
            rating: $("#vote" + dbid).html()
        });
    });
});