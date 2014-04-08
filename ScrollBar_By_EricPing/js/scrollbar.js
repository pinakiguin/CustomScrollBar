/*

Developed By Eric Ping
Follw me on http://sudo.tw

*/
$.fn.HeightChange = function (callback) {
    $(this).each(function () {
        var content = this;
        var oldHeight = $(content).height();
        checkHeight();

        function checkHeight() {
            setTimeout(function () {
                var newHeight = $(content).height();
                if (newHeight != oldHeight) {
                    oldHeight = newHeight;
                    callback();
                }
                checkHeight();
            }, 100);
        }
    })
}
$.fn.scrollBar = function () {
    var screenHeight = window.screen.height;
    $(this).prepend('<div class="scroll"><div class="bar"></div></div>');
    $(this).each(function () {
        var box = this;
        var content = $(box).find(".content");
        $($(this).find(".scroll")).each(function () {
            var scroll = this;
            var bar = $(this).find(".bar");
            init();
            $(content).HeightChange(init);
            $(bar).draggable({
                containment: "parent",
                axis: "y",
                drag: function (event, ui) {
                    moveContent();
                }
            });
            $(box).bind("mousewheel DOMMouseScroll", function (event) {
                event.preventDefault();
                var moveDelta = -screenHeight / getDelta(event);
                moveContent(moveDelta);
            });

            $(scroll).click(function (event) {
                var clickTop = event.offsetY;
                if (clickTop > $(scroll).height() - $(bar).height()) {
                    clickTop = $(scroll).height() - $(bar).height();
                }
                var currentTop = clickTop;
                var currentPercent = -(currentTop / $(scroll).height());
                $(bar).animate({
                    top: clickTop + "px"
                }, 100, function () {
                    //do something?				    
                });
                $(content).animate({
                    top: (currentPercent * $(content).height()) + "px"
                }, 100, function () {
                	//do something?
                })
            })

            $(scroll).hide();
            $(box).hover(
                function () {
                    $(scroll).fadeIn();
                }, function () {
                    $(scroll).fadeOut();
                }
            );

            function init() {
                var barPercent = $(box).height() / $(content).height();
                if (barPercent > 1) $(bar).height() = 1;
                barPercent *= 100;
                $(bar).height(barPercent + "%");
            }

            function getDelta(e) {
                if (e.wheelDelta) {
                    return e.wheelDelta;
                }

                if (e.originalEvent.detail) {
                    //for firefox
                    return e.originalEvent.detail * -40;
                }

                if (e.originalEvent && e.originalEvent.wheelDelta) {
                    //for chrome IE 11
                    return e.originalEvent.wheelDelta;
                }
            }

            function moveContent(moveDelta) {
                if (moveDelta != null) {
                    var currentTop = $(bar).position().top;
                    if (moveDelta < 0 && currentTop + moveDelta < 0) {
                        currentTop = 0;
                        moveDelta = 0;
                    } else if (moveDelta > 0 && currentTop + moveDelta >= $(scroll).height() - $(bar).height()) {
                        currentTop = $(scroll).height() - $(bar).height();
                        moveDelta = 0;
                    }
                    $(bar).css("top", currentTop + moveDelta + "px");
                }
                var currentTop = $(bar).position().top;
                var currentPercent = -(currentTop / $(scroll).height());
                $(content).css("top", currentPercent * $(content).height() + "px");
            }
        })
    })

}