import Chart from "react-apexcharts";
import { React, useEffect, useState } from 'react';
import config from 'config';

import MainCard from 'ui-component/cards/MainCard';

// ---------------------------------------------------------------------
// 1. GAUGE COMPONENT (Total Hedge Score)
// ---------------------------------------------------------------------
function HedgeTotalScore({ score }) {
  const options = {
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        dataLabels: {
          name: { fontSize: "18px" },
          value: { fontSize: "32px" }
        }
      }
    },
    labels: ["Hedge Score"]
  };

  const series = [(score / 8) * 100]; // 0–8 → percentage

  const multiRadialOptions = {
    chart: {
      height: 280,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: "TOTAL"
          }
        }
      }
    },
    labels: ["Volatility", "Commodities", "Equities", "FX"]
  };

  const multiRadialSeries = [67, 84, 97, 61]; // Replace with real data later


  return (
    <><Chart options={multiRadialOptions} series={multiRadialSeries} type="radialBar" height={300} /><Chart options={options} series={series} type="radialBar" height={250} /></>
  );
  
}

// ---------------------------------------------------------------------
// 2. HEATMAP COMPONENT (Which signals are active now)
// ---------------------------------------------------------------------
function HedgeHeatmap({ data }) {
  const series = [
    {
      name: "Signals",
      data: data.map(item => ({
        x: item.name,
        y: item.active ? 1 : 0
      }))
    }
  ];

  const options = {
    chart: { type: "heatmap" },
    dataLabels: { enabled: false },
    colors: ["#4CAF50", "#FF1744"], // OK / Triggered
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#4CAF50", name: "OK" },
            { from: 1, to: 1, color: "#FF1744", name: "Triggered" }
          ]
        }
      }
    }
  };

  return (
    <Chart options={options} series={series} type="heatmap" height={260} />
  );
}

// ---------------------------------------------------------------------
// 3. TIMELINE COMPONENT (history of signals)
// ---------------------------------------------------------------------
function HedgeSignalTimeline({ seriesData }) {
  const options = {
    chart: { type: "area", stacked: true },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    fill: { opacity: 0.7 },
    xaxis: {
      type: "datetime",
      labels: {
        // show date only (day month year)
        format: "dd MMM yyyy"
      }
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 1,
      labels: {
        formatter: (val) => (val === 1 ? "1" : "0")
      }
    },
    tooltip: {
      shared: true,
      // tooltip shows only the date portion
      x: { format: "yyyy-MM-dd" }
    }
  };

  return (
    <Chart options={options} series={seriesData} type="area" height={350} />
  );
}


function HedgeSignalTimeline2({ seriesData }) {
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
      <Chart
        options={options}
        series={series}
        type="scatter"
        height={500}
        width="100%"
      />
 );

}



function RiskNonRiskChart({ seriesData }) {
 const data = [
    {"dayDate":"2022-09-28","riskyCount":0,"nonRiskyCount":1},
    {"dayDate":"2022-09-29","riskyCount":1,"nonRiskyCount":0},
    {"dayDate":"2022-09-30","riskyCount":2,"nonRiskyCount":3},
    {"dayDate":"2022-10-01","riskyCount":1,"nonRiskyCount":2},
    {"dayDate":"2022-10-02","riskyCount":0,"nonRiskyCount":4}
    // Add all your points here, or pass via props
  ];

  // Optional: sort by date (in case data isn't ordered)
  const sortedData = [...data].sort(
    (a, b) => new Date(a.dayDate) - new Date(b.dayDate)
  );

  // Extract dates for x-axis
  const dates = sortedData.map(item => item.dayDate);

// Define series
  const series = [
    {
      name: 'Risky Count',
      data: sortedData.map(item => item.riskyCount),
      color: '#FF4560' // red
    },
    {
      name: 'Non-Risky Count',
      data: sortedData.map(item => item.nonRiskyCount),
      color: '#00E396' // green
    }
  ];


// Chart options
  const options = {
    chart: {
      type: 'line',
      height: 350,
      zoom: {
        enabled: true,
        type: 'x'
      },
      toolbar: {
        show: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      type: 'datetime',
      categories: dates,
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      },
      min: 0,
      decimalsInFloat: 0
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
  };
 
    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height={400}
        width="100%"
      />
  );

}


// ---------------------------------------------------------------------
// MOCK DATA (Replace with your backend later)
// ---------------------------------------------------------------------
const mockSignals = [
  { name: "VIX", active: true },
  { name: "VVIX", active: true },
  { name: "SKEW", active: false },
  { name: "SDEX", active: true },
  { name: "Crude Oil", active: false },
  { name: "Gold", active: true },
  { name: "S&P 500", active: false },
  { name: "NASDAQ vs S&P", active: true }
];

// Example timeline (3 days shown for simplicity)
const mockTimeline = [
  {
    name: "VIX",
    data: [
      ["2025-01-01", 0],
      ["2025-01-02", 1],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "VVIX",
    data: [
      ["2025-01-01", 0],
      ["2025-01-02", 0],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "SKEW",
    data: [
      ["2025-01-01", 0],
      ["2025-01-02", 0],
      ["2025-01-03", 0]
    ]
  },
  {
    name: "SDEX",
    data: [
      ["2025-01-01", 1],
      ["2025-01-02", 1],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "Crude Oil",
    data: [
      ["2025-01-01", 0],
      ["2025-01-02", 1],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "Gold",
    data: [
      ["2025-01-01", 1],
      ["2025-01-02", 1],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "S&P 500",
    data: [
      ["2025-01-01", 0],
      ["2025-01-02", 0],
      ["2025-01-03", 1]
    ]
  },
  {
    name: "NASDAQ vs S&P",
    data: [
      ["2025-01-01", 1],
      ["2025-01-02", 1],
      ["2025-01-03", 1]
    ]
  }
];

// ---------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------
export default function HedgeIndexDashboard() {
  const totalScore = mockSignals.filter(s => s.active).length;

  const [risks, setRisks] = useState([]);

  useEffect(() => {
      fetch(config.baseApi+"/riskCumulative")
          .then(res => res.json())
          .then(
          (result) => {
            console.log('riskCumulative',result);
              setRisks(result);
          },
          (error) => {
              console.error(error);
          }
          )
  }, [])




  return (
      <MainCard>

        <RiskNonRiskChart seriesData={mockTimeline} />

        {/* <HedgeSignalTimeline2 seriesData={mockTimeline} />

        <HedgeTotalScore score={totalScore} />

        <HedgeHeatmap data={mockSignals} />

        <HedgeSignalTimeline seriesData={mockTimeline} /> */}
      </MainCard>
 
  );
}
