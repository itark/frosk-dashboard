// ===========================|| DASHBOARD - BAJAJ AREA CHART ||=========================== //

const topData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'top-chart',
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
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: [{
        data: [{
            x: "Dummy1",
            y: 44
          }, {
            x: "Dummy2",
            y: -55
          }]
      }],
    noData: {
        text: 'Loading...'
    }

};

export default topData;
