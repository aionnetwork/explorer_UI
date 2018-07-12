$(function() {
  
  $.getJSON(BASE_API + '/dashboard/findNumTransactionsByHour?start='+TS_START+'&end='+TS_END, function (data) {

    // debug
    console.log(data);

    // Create a timer
    var start = +new Date();

    // Create the chart
    Highcharts.stockChart('graph', {
      chart: {
        type: 'column',
        events: {
          load: function () {
            this.setTitle(null, {
              text: 'Built chart in ' + (new Date() - start) + 'ms'
            });
          }
        },
        zoomType: 'x'
      },

      rangeSelector: {

        buttons: [{
          type: 'day',
          count: 3,
          text: '3d'
        }, {
          type: 'week',
          count: 1,
          text: '1w'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 6,
          text: '6m'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        selected: 3
      },

      title: {
        text: 'Aion Testnet-0 Transaction / Hour'
      },

      subtitle: {
        text: 'Built chart in ...' // dummy text to reserve space for dynamic subtitle
      },

      series: [{
        name: 'Transaction Count',
        data: data.content[0].data,
        pointStart: data.content[0].pointStart,
        pointInterval: data.content[0].pointInterval,
        tooltip: {
            valueSuffix: ''
        }
      }]

    });
  });

});



