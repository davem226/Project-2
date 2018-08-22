$(function () {
    // 100 is arbitrary; need method to find number of apis in table
    for (j = 1; j < 100; j++) {
        $("#star" + j).srating({
            change: function (star, value) {
                var id = $(this).attr("dbid");
                $("#your-vote-was" + id).hide();
                $("#vote" + id).text(value);
            }
        });
    }
});
