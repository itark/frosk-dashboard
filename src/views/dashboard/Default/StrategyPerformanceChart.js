import React from 'react';
import Chart from 'react-apexcharts';

const StrategyPerformanceChart = () => {
  // Your dataset
  const data = [
    {"name":"CrudeOil","totalProfit":-67,"sqn":-1.8,"sqnRaw":-1.76},
    {"name":"EMATenTen","totalProfit":-60,"sqn":-2.3,"sqnRaw":-2.279710867398},
    {"name":"EMATenTwenty","totalProfit":25,"sqn":-1.5,"sqnRaw":-1.512791625125},
    {"name":"Engulfing","totalProfit":-3.4,"sqn":-1.5,"sqnRaw":-1.494596211366},
    {"name":"Gold","totalProfit":-200,"sqn":-1.8,"sqnRaw":-1.79},
    {"name":"Harami","totalProfit":-2.3,"sqn":-2.8,"sqnRaw":-2.813459621137},
    {"name":"HedgeIndex","totalProfit":150,"sqn":-1.6,"sqnRaw":-1.588065802592},
    {"name":"HighLander","totalProfit":0.079,"sqn":-0.053,"sqnRaw":-0.05259222333},
    {"name":"MovingMomentum","totalProfit":57,"sqn":-1.7,"sqnRaw":-1.689282153539},
    {"name":"NasdaqVsSP","totalProfit":-24,"sqn":-1.8,"sqnRaw":-1.79},
    {"name":"RSI2","totalProfit":-18,"sqn":-1.4,"sqnRaw":-1.442761714855},
    {"name":"RunawayGAP","totalProfit":-16,"sqn":-1.4,"sqnRaw":-1.370608175474},
    {"name":"SP500","totalProfit":8.8,"sqn":2.0,"sqnRaw":2.04},
    {"name":"ShortTermMomentumLongTermStrength","totalProfit":73,"sqn":-1.4,"sqnRaw":-1.410289132602},
    {"name":"SimpleMovingMomentum","totalProfit":-9.1,"sqn":-1.7,"sqnRaw":-1.736181455633},
    {"name":"VIX","totalProfit":180,"sqn":3.4,"sqnRaw":3.44},
    {"name":"VVIX","totalProfit":-86,"sqn":-2.1,"sqnRaw":-2.14}
  ];

  // Prepare series: one series with all points
  const series = [{
    name: 'Strategies',
    data: data.map(item => ({
      x: item.totalProfit,
      y: item.sqn,
      // Optional: add size or other metadata
      name: item.name
    }))
  }];

  const options = {
    chart: {
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy'
      },
      toolbar: {
        show: true
      }
    },
    xaxis: {
      title: {
        text: 'Total Profit ($)'
      },
      type: 'numeric'
    },
    yaxis: {
      title: {
        text: 'System Quality Number (SQN)'
      }
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const datum = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding: 8px; background: white; border: 1px solid #ddd;">
            <strong>${datum.name}</strong><br/>
            Profit: ${datum.x.toFixed(2)}<br/>
            SQN: ${datum.y.toFixed(2)}
          </div>
        `;
      }
    },
    markers: {
      size: 6,
      hover: {
        size: 9
      }
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: '#ccc',
          strokeDashArray: 4,
          label: {
            text: 'SQN = 0',
            style: { color: '#666' }
          }
        }
      ],
      xaxis: [
        {
          x: 0,
          borderColor: '#ccc',
          strokeDashArray: 4,
          label: {
            text: 'Break-even',
            style: { color: '#666' }
          }
        }
      ]
    }
  };

  return (
    <div>
      <h3>Strategy Performance: Profit vs SQN</h3>
      <Chart
        options={options}
        series={series}
        type="scatter"
        height={500}
        width="100%"
      />
    </div>
  );
};

export default StrategyPerformanceChart;