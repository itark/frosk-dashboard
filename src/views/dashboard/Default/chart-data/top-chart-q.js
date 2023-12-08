// ===========================|| DASHBOARD - BAJAJ AREA CHART ||=========================== //

const topDataQ = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'top-chart-q',
            stacked: false,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        },
        yaxis: {
            title: {
               text: 'Percent',
            },
          },
        legend: {
            show: true,
            fontSize: '14px',
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: true
        },
        grid: {
            show: true
        }
    },
    series: [{
        data: [{
            x: "DummyX",
            y: 44
          }, {
            x: "DummyY",
            y: -55
          }]
      }],
    noData: {
        text: 'Loading...'
    }

};

export default topDataQ;
