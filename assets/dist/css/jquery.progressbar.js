(function($) {
  $.fn.progressbar = function (options) {

    var opts = $.extend({ }, options);

    return this.each(function() {
      var $this = $(this);

      var $ul = $('<ul>').attr('class', 'progressbar');

      var currentIdx = -1

      $.each(opts.steps, function(index, value) {
        var $li = $('<li>').text(value.replace('@', '').replace('~', '').replace('1','').replace('2','').replace('3',''));
        $li.css('width', (100 / opts.steps.length) + '%');

        if(value.indexOf('@') > -1) {
          $li.addClass('current');
          currentIdx = index;
        }

        if(value.indexOf('~') > -1) {
          $li.addClass('fail');
        }

        if(value.indexOf('1') > -1) {
          $li.addClass('orange');
        }
        if(value.indexOf('2') > -1) {
          $li.addClass('bleu');
        }
        if(value.indexOf('3') > -1) {
          $li.addClass('vert');
        }

        $ul.append($li);
      });

      for(var i = 0; i < currentIdx; i++) {
        $($ul.find('li')[i]).addClass('done');
      }

      $this.append($ul);
    });
  };
})(jQuery);