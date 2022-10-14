import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { priceData } from './priceData';
// import { areaData } from './areaData';
import { volumeData } from './volumeData';

import './styles.css';
import config from 'config';

export default function ChartContainer( {securityName, strategy}) {
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const candleSeries = useRef(null);
  const volumeSeries = useRef(null);

  useEffect(() => {

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      // height: chartContainerRef.current.clientHeight,
      height: 600,
      layout: {
        backgroundColor: 'white',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    });

    chart.current.timeScale().fitContent();

    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    volumeSeries.current = chart.current.addHistogramSeries({
      color: '#182233',
      lineWidth: 2,
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

  }, []);

  const markers = [];

  const getSecurityData =  () => {
    fetch(config.baseApi+"/prices?security="+securityName)
      .then((response) => response.json())
      .then((response) => {
        candleSeries.current.setData(response)
        volumeSeries.current.setData(response);
        console.log('first price',response[0].time);
      });
  };

  const getTradesData =  () => {
    fetch(config.baseApi+"/trades?security="+securityName+"&strategy="+strategy)
      .then((response) => response.json())
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].type === 'SELL') {
            markers.push({
              time: response[i].dateReadable,
              position: 'aboveBar',
              color: '#e91e63',
              shape: 'arrowDown',
              text: 'Sell @ ' + Math.floor(response[i].price + 2),
            });
          } else {
            markers.push({
              time: response[i].dateReadable,
              position: 'belowBar',
              color: '#2196F3',
              shape: 'arrowUp',
              text: 'Buy @ ' + Math.floor(response[i].price - 2),
            });
          }
        }
        candleSeries.current.setMarkers(markers);
      });
  }

  useEffect(() => {
    getSecurityData();
    getTradesData();

    chart.current.applyOptions({
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(171, 71, 188, 0.5)',
        text: securityName,
      },
    });

  }, [securityName]);


  useEffect(() => {
    getTradesData();
  }, [strategy]);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <div className="App">
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}