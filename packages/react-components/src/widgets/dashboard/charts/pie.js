export function getPieOptions({ serie, clickCallback, interactive }) {
  const options = {
    chart: {
      height: 300,
      animation: false,
      type: 'pie',
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
              clickCallback({filter: this.filter, name: this.name, count: this.y}, this)
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
      itemStyle: {
        width: '200px',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  }
  return options;
}

function getSerie(data, translations) {
  // Map data and keep empty slices. We could remove empty slices, but that would mean that the legend would change on updates
  var d = data.results.map(function (e) {
    return {
      name: e.displayName,
      filter: e.filter,
      y: e.count,
      visible: e.count > 0 // disable empty pie slices - this is to make it easier to read the legend.
    };
  });

  if (data.diff > 0) {
    d.push({
      name: translations.otherOrUknown || 'other or unknown',
      y: data.diff
    });
  }

  var serie = {
    name: translations.occurrences || 'Occurrences',
    data: d
  };
  return serie;
}