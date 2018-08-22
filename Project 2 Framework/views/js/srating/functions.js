var vote = [].vote;

(function ($, window) {
  var Stars;
  window.Stars = Stars = (function () {
    Stars.prototype.defaults = {
      rating: void 0,
      max: 5,
      readOnly: false,
      emptyClass: "fa fa-star-o",
      fullClass: "fa fa-star",
      change: function (star, value) { }
    };

    function Stars(rate, options) {
      this.options = $.extend({}, this.defaults, options);
      this.rate = rate;
      this.createStars();
      this.syncRating();
      if (this.options.readOnly) {
        return;
      }
      // ---------------------------------------
      // Mouse over would erase the saved stars
      // ---------------------------------------
      // this.rate.on("mouseover.srating", "a", (function (vstar) {
      //   return function (star) {
      //     return vstar.syncRating(vstar.getStars().index(star.currentTarget) + 1);
      //   };
      // })(this));
      // this.rate.on("mouseout.srating", (function (vstar) {
      //   return function () {
      //     return vstar.syncRating();
      //   };
      // })(this));
      this.rate.on("click.srating", "a", (function (vstar) {
        return function (star) {
          star.preventDefault();
          return vstar.setRating(vstar.getStars().index(star.currentTarget) + 1);
        };
      })(this));
      this.rate.on("srating:change", this.options.change);
    }


    Stars.prototype.getStars = function () {
      return this.rate.find("a");
    };

    Stars.prototype.createStars = function () {
      var j, ref, results;
      results = [];
      for (j = 1, ref = this.options.max; 1 <= ref ? j <= ref : j >= ref; 1 <= ref ? j++ : j--) {
        results.push(this.rate.append("<a href='#' />"));
      }
      return results;
    };

    Stars.prototype.setRating = function (rating) {
      if (this.options.rating === rating) {
        rating = void 0;
      }
      this.options.rating = rating;
      this.syncRating();
      return this.rate.trigger("srating:change", rating);
    };

    Stars.prototype.getRating = function () {
      return this.options.rating;
    };

    Stars.prototype.syncRating = function (rating) {
      var $stars, i, j, ref, results;
      rating || (rating = this.options.rating);
      $stars = this.getStars();
      results = [];
      for (i = j = 1, ref = this.options.max; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        results.push($stars.eq(i - 1).removeClass(rating >= i ? this.options.emptyClass : this.options.fullClass).addClass(rating >= i ? this.options.fullClass : this.options.emptyClass));
      }
      return results;
    };

    return Stars;

  })();
  return $.fn.extend({
    srating: function () {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? vote.call(arguments, 1) : [];
      return this.each(function () {
        var data;
        data = $(this).data("srating");
        if (!data) {
          $(this).data("srating", (data = new Stars($(this), option)));
        }
        if (typeof option === "string") {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);
