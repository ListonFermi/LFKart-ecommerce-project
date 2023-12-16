// Hide Max List Items - v1.34 - Minified
(function ($) {
    $.fn.extend({
        hideMaxListItems: function (options) {
            var defaults = {
                max: 3,
                speed: 1000,
                moreText: "READ MORE",
                lessText: "READ LESS",
                moreHTML: '<p class="maxlist-more"><a href="#"></a></p>'
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var op = options;
                var totalListItems = $(this).children("li").length;
                var speedPerLI;
                if (totalListItems > 0 && op.speed > 0) {
                    speedPerLI = Math.round(op.speed / totalListItems);
                    if (speedPerLI < 1) {
                        speedPerLI = 1
                    }
                } else {
                    speedPerLI = 0
                }
                if ((totalListItems > 0) && (totalListItems > op.max)) {
                    $(this).children("li").each(function (index) {
                        if ((index + 1) > op.max) {
                            $(this).hide(0);
                            $(this).addClass("maxlist-hidden")
                        }
                    });
                    var howManyMore = totalListItems - op.max;
                    var newMoreText = op.moreText;
                    var newLessText = op.lessText;
                    if (howManyMore > 0) {
                        newMoreText = newMoreText.replace("[COUNT]", howManyMore);
                        newLessText = newLessText.replace("[COUNT]", howManyMore)
                    }
                    $(this).after(op.moreHTML);
                    $(this).next(".maxlist-more").children("a").text(newMoreText);
                    $(this).next(".maxlist-more").children("a").click(function (e) {
                        var listElements = $(this).parent().prev("ul, ol").children("li");
                        listElements = listElements.slice(op.max);
                        if ($(this).text() == newMoreText) {
                            $(this).text(newLessText);
                            var i = 0;
                            (function () {
                                $(listElements[i++] || []).slideToggle(speedPerLI, arguments.callee)
                            })()
                        } else {
                            $(this).text(newMoreText);
                            var i = listElements.length - 1;
                            (function () {
                                $(listElements[i--] || []).slideToggle(speedPerLI, arguments.callee)
                            })()
                        }
                        e.preventDefault()
                    })
                }
            })
        }
    })
})(jQuery);
