(function (namespace) {
  var selected_date = '2022-05-05';

  var checkForjQuery = function() {
    return window.jQuery && jQuery.fn && /^1\.[3-9]/.test(jQuery.fn.jquery);
  };

  var loadWidget = function() {
    loadCSS();
    loadDataForDate('2022-05-05');
    loadKalendae();
  };

  var loadCSS = function() {
    var styles = widgetQuery('<link>');
    styles.attr({
      type: 'text/css',
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/gh/OSUfrk09/Website/style2.css'
    });
    widgetQuery("head").append(styles);
  };

  var loadDataForDate = function(date) {
    selected_date = date
      var loadRemoteHtml = function(data) {
        widgetQuery("#resources_calendar_widget").html(data["html"]);
        triggerSearchInput();
        createKal();
      }

    widgetQuery.ajax({
      url: "https://calendar.planningcenteronline.com/widgets/eJxj4ajmsGLLz2T2i2C04kotzi8oAQkUeyrxJ-bkxKeWpeaVFLNZsbmGWLGVZjK__8NnxV5W4qkkWFCalJOZHF-SmZtazGbNEWLFXZBYlJhbXM0AAN1NGR8=7a2c0aba334cf4c2e8f6474a4fbc5f636206b1e4.json",
      data: {'date': date},
      dataType: 'jsonp',
      success: loadRemoteHtml
    });
  };

  var loadKalendae = function() {
    if (typeof Kalendae == 'undefined') {
      widgetQuery.getScript('https://calendar.planningcenteronline.com/assets/vendor/kalendae.standalone.js');
    }
  };

  var createKal = function() {
    if (typeof Kalendae === 'undefined') {
      setTimeout(createKal, 10);
      return
    };
    new Kalendae(widgetQuery('.rc-kal_popover').get(0), {
      selected: Kalendae.moment(selected_date, "YYYY-MM-DD"),
        subscribe: {
          'date-clicked': function (date) {
            loadDataForDate(date.format('YYYY-MM-DD'));
          }
        }
    });
    widgetQuery('.rc-kal_popover').hide();
  };

  var toggleKal = function() {
    widgetQuery('.rc-icon-date-btn').toggleClass('rc-btn-active');
    widgetQuery('.rc-kal_popover').toggle();
  };

  var triggerSearchInput = function() {
    widgetQuery('#filter_body tr').addClass('visible'); // default
    widgetQuery('#filter_body tr.no_results').removeClass('visible').hide(); // default
    widgetQuery("#search_input").keyup(function(event){
      if (event.keyCode == 27 || widgetQuery(this).val() == '') {
        //esc resets as well as empty field
        widgetQuery(this).val('');
        widgetQuery('#filter_body tr').removeClass('visible').show().addClass('visible');
        widgetQuery('#filter_body tr.no_results').removeClass('visible').hide(); // default
      } else {
        filterTable('#filter_body tr',widgetQuery(this).val());
        if (widgetQuery('#filter_body tr.visible').length == 0) {
          widgetQuery('#filter_body tr.no_results').removeClass('visible').show().addClass('visible');
        }
      }
    });
  };

  var filterTable = function(selector,query) {
    query = widgetQuery.trim(query);
    query = query.replace(/ /gi, '|'); // OR
    query = query.replace(/\[/gi,''); // harmful to regexp
    query = query.replace(/\]/gi,''); // ditto
    widgetQuery(selector).each(function() {
      (widgetQuery(this).text().search(new RegExp(query, "i")) < 0) ? widgetQuery(this).hide().removeClass('visible') : widgetQuery(this).show().addClass('visible');
    });
  };

  if ( checkForjQuery() ){
    widgetQuery = jQuery;
    loadWidget();
  } else {
    var script = document.createElement('script'),
      timer = setInterval(function(){
        if ( checkForjQuery() ) {
          clearInterval(timer);
          widgetQuery = jQuery.noConflict(true);
          document.body.removeChild(script);
          loadWidget();
        }
      }, 30);
    script.src = location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
    document.body.insertBefore( script, document.body.firstChild );
  }

  namespace.loadDataForDate = loadDataForDate;
  namespace.toggleKal = toggleKal;
})(window.PCOResourcesWidget = {});
