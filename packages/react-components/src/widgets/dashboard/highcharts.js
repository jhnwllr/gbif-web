import Highcharts from 'highcharts'

Highcharts.theme = {
  colors: [
    '#71b171',
    '#505160',
    '#e6d72a',
    '#68829E',
    '#98dbc6',
    '#f18d9e',
    '#aebd38',
    '#324851',
    '#5bc8ac',
    '#86ac41',
    '#7da3a1'
  ],
  chart: {
    // backgroundColor: {
    //    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
    //    stops: [
    //        [0, '#2a2a2b'],
    //        [1, '#3e3e40']
    //    ]
    // },
    style: {
      fontFamily: 'Roboto, sans-serif'
    },
    plotBorderColor: '#606063'
  },
  title: {
    style: {
      color: '#666',
      fill: '#666',
      textTransform: 'uppercase',
      fontSize: '12px'
    }
  },
  subtitle: {
    style: {
      color: '#666',
      fontSize: '12px'
    }
  },
  // xAxis: {
  //    gridLineColor: '#707073',
  //    labels: {
  //        style: {
  //            color: '#E0E0E3'
  //        }
  //    },
  //    lineColor: '#707073',
  //    minorGridLineColor: '#505053',
  //    tickColor: '#707073',
  //    title: {
  //        style: {
  //            color: '#A0A0A3'
  //
  //        }
  //    }
  // },
  // yAxis: {
  //    gridLineColor: '#707073',
  //    labels: {
  //        style: {
  //            color: '#E0E0E3'
  //        }
  //    },
  //    lineColor: '#707073',
  //    minorGridLineColor: '#505053',
  //    tickColor: '#707073',
  //    tickWidth: 1,
  //    title: {
  //        style: {
  //            color: '#A0A0A3'
  //        }
  //    }
  // },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: '#F0F0F0'
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#666'
      },
      marker: {
        lineColor: '#333'
      }
    },
    boxplot: {
      fillColor: '#505053'
    },
    candlestick: {
      lineColor: 'white'
    },
    errorbar: {
      color: 'white'
    }
  },
  legend: {
    itemStyle: {
      color: '#606063',
      fontWeight: 'normal'
    },
    itemHoverStyle: {
      color: '#8d8f92'
    },
    itemHiddenStyle: {
      color: '#bec5d0'
    }
  },
  credits: {
    style: {
      color: '#666'
    }
  },
  labels: {
    style: {
      color: '#707073'
    }
  },

  drilldown: {
    activeAxisLabelStyle: {
      color: '#F0F0F3'
    },
    activeDataLabelStyle: {
      color: '#F0F0F3'
    }
  },

  navigation: {
    buttonOptions: {
      symbolStroke: '#666',
      theme: {
        // fill: '#f00'
        // fill: '#505053'
      }
    }
  },

  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC'
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        }
      }
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },

  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    },
    xAxis: {
      gridLineColor: '#505053'
    }
  },

  scrollbar: {
    barBackgroundColor: '#808083',
    barBorderColor: '#808083',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: '#606063',
    buttonBorderColor: '#606063',
    rifleColor: '#FFF',
    trackBackgroundColor: '#404043',
    trackBorderColor: '#404043'
  },

  // special colors for some of the
  legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
  background2: '#505053',
  dataLabelsColor: '#666',
  textColor: '#C0C0C0',
  contrastTextColor: '#F0F0F3',
  maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

export default Highcharts;