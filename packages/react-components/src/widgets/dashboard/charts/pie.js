function addLegendHeight(chart) {
  // chart.setSize(null, 600);
  var legendSpace = chart.legend.legendHeight -
    chart.legend.padding;
  console.log('legendHeight: ', legendSpace);
  console.log('totatl: ', 400 + legendSpace);
  if (legendSpace) {
    window.setTimeout(function () {
      chart.setSize(null, 800 + legendSpace);
    }, 3000);
  }
}

export function getPieOptions({ serie, onClick, interactive }) {
  const options = {
    chart: {
      height: 400,
      animation: false,
      type: 'pie',
      events: {
        load: function () {
          // addLegendHeight(this);
        }
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: interactive,
        animation: false,
        cursor: interactive ? 'pointer' : 'default',
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        point: interactive ? {
          events: {
            click: function () {
              onClick({ filter: this.filter, name: this.name, count: this.y }, this)
            }
          }
        } : {}
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false
    },
    series: [serie],
    exporting: {
      buttons: {
        contextButton: {
          enabled: false
        }
      }
    },
    legend: {
      floating: false,
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  }
  return options;
}