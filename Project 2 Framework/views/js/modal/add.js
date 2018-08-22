// Post request new api to be added to database
$(function () {
    $("#addIt").click(function (e) {
        e.preventDefault();

        var newAPI = {
            uid: $("strong").attr("uid"),
            name: $("#modal-name").val(),
            link: $("#modal-link").val()
        }
        var rating = $("#modal-rating").val();
        if (rating) {
            newAPI.rating = rating;
        }
        
        $.post("/api/add", newAPI).then(function () {
            location.reload();
        });
    });
});