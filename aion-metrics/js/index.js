$(function() {

  $.getJSON(BASE_API + '/dashboard/findNumTransactionsByDay?start='+TS_START+'&end='+TS_END, function (data) {
    
    // debug
    console.log(data);
    
    Highcharts.stockChart('graph', {
      rangeSelector: {
        selected: 1
      },

      chart: {
        type: 'line',
        zoomType: 'x'
      },

      title: {
        text: 'Aion Testnet-0 Transaction / Day'
      },

      series: [{
        name: 'Transaction Count',
        data: data.content,
        tooltip: {
            valueDecimals: 2
        }
      }]
    });
  });

});



