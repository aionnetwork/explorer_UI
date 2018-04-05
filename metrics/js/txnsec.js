$(function() {

  var isWaitingForResponse = false;
  
  function afterSetExtremes(e) {

    if (!isWaitingForResponse) {
      isWaitingForResponse = true;

      var chart = Highcharts.charts[0];
      
      chart.showLoading('Loading data from server...');
    
      var endpoint = 'findTPSByDay';
      var start = moment(Math.round(e.min)).unix();
      var end = moment(Math.round(e.max)).unix();
      var range = end - start;
      console.log('data for range: ['+moment.unix(start).format()+'-'+moment.unix(end).format()+']');

      // less than 6 hours, loads minute data 
      if (range < 6 * 3600) {
        endpoint = 'findTPSByMinute';
        console.log('findTPSByMinute');
        
      // one month range loads hourly data
      } else if (range < 20 * 24 * 3600) {
        console.log('findTPSByHour');
        endpoint = 'findTPSByHour';

      // greater range loads daily data
      } else {
        console.log('findTPSByDay');
        endpoint = 'findTPSByDay';
      }
      
      $.getJSON(BASE_API + '/dashboard/'+endpoint+'?start='+start+'&end='+end, function (data) {
        console.log(data);
        chart.series[0].setData(data.content);
        chart.hideLoading();
        isWaitingForResponse = false;
      });
    }
  }

  // See source code from the JSONP handler at https://github.com/highcharts/highcharts/blob/master/samples/data/from-sql.php
  //$.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function (data) {
  $.getJSON(BASE_API + '/dashboard/findTPSByDay?start='+TS_START+'&end='+TS_END, function (data) {

    // Add a null value for the end date
    data = [].concat(data.content, [[moment().valueOf(), null, null, null, null]]);

    console.log(data);

    // create the chart
    Highcharts.stockChart('graph', {
      chart: {
        type: 'column',
        zoomType: 'x'
      },

      rangeSelector: {
        selected: 1
      },

      navigator: {
        adaptToUpdatedData: true,
        series: {
          data: data
        }
      },

      scrollbar: {
        liveRedraw: false
      },

      title: {
        text: 'Aion Testnet-0 Transaction / Second'
      },

      /*subtitle: {
        text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading'
      },*/

      rangeSelector: {
        buttons: [{
          type: 'hour',
          count: 1,
          text: '1h'
        }, {
          type: 'day',
          count: 1,
          text: '1d'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        inputEnabled: false, // it supports only days
        selected: 4 // all
      },

      xAxis: {
        events: {
          afterSetExtremes: afterSetExtremes
        },
        minRange: 2 * 3600 * 1000 // two hour
      },

      yAxis: {
        floor: 0
      },

      series: [{
        name: 'Txn / Sec',
        data: data,
        dataGrouping: {
          enabled: false
        }
      }]
    });
  });

});



