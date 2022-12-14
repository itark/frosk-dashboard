import { createChart } from 'lightweight-charts';
import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

import { useTheme } from '@mui/material/styles';
import {
	TextField,
	MenuItem,
	Grid,
	Typography
  } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import '../../frosk/styles.css';
import config from 'config';

const Context = createContext();

export const Container = (props) => {
	const theme = useTheme();
	const { securityName, strategies, initStrategy, featuredStrategy} = props;
	const [strategy, setStrategy] = useState(initStrategy);
    const blue = '#2962FF';
	const orange = '#e69138';
	const [chartLayoutOptions, setChartLayoutOptions] = useState({});
	const markers = [];
	const candleSeries = useRef(null);
	const volumeSeries = useRef(null);
	const shortEmaSeries = useRef(null);
	const longEmaSeries = useRef(null);
	const shortSmaSeries = useRef(null);
	const longSmaSeries = useRef(null);
	const pSarSeries = useRef(null);
	const macdSeries = useRef(null);
	const emaMacdSeries = useRef(null);
	const strategyEnabled = initStrategy === undefined ? false : true;

	useEffect(() => {
		getSecurityData();
		if (strategy) {
			getFeaturedStrategy();
		}
	}, [securityName]);

	useEffect(() => {
		if (strategy) {
			getFeaturedStrategy();
		}
		getFeaturedStrategy();
	}, [strategy]);

	const getSecurityData =  () => {
		fetch(config.baseApi+"/prices?security="+securityName)
		  .then((response) => response.json())
		  .then((response) => {
			candleSeries.current.setData(response);
			volumeSeries.current.setData(response);
		  });
	  };

	const getFeaturedStrategy =  () => {
		fetch(config.baseApi+"/featuredStrategy?security="+securityName+"&strategy="+strategy)
		  .then((response) => response.json())
		  .then((response) => {
			setShortEma(response);
			setLongEma(response);
			setParabolicSar(response);
			setMacd(response);
			setEmaMacd(response);

			setMarkers(response);
		  });
	}

	const setShortEma =  (response) => {
		const shortEma = response.indicatorValues
			.filter(o => o.name === 'shortEma')
			.map(datapoint => ({
				time: datapoint.time,
				value: datapoint.value,
				name: datapoint.name
		}));
		shortEmaSeries.current.setData(shortEma);
	}

	const setLongEma =  (response) => {
		const longEma = response.indicatorValues
			.filter(o => o.name === 'longEma')
			.map(datapoint => ({
				time: datapoint.time,
				value: datapoint.value,
				name: datapoint.name
		}));
		longEmaSeries.current.setData(longEma);
	}

	const setParabolicSar =  (response) => {
		const pSar = response.indicatorValues
			.filter(o => o.name === 'pSar')
			.map(datapoint => ({
				time: datapoint.time,
				value: datapoint.value,
				name: datapoint.name
		}));
		pSarSeries.current.setData(pSar);
	}

	const setMacd =  (response) => {
		const macd = response.indicatorValues
			.filter(o => o.name === 'macd')
			.map(datapoint => ({
				time: datapoint.time,
				value: datapoint.value,
				name: datapoint.name
		}));
		macdSeries.current.setData(macd);
	}	

	const setEmaMacd =  (response) => {
		const emaMacd = response.indicatorValues
			.filter(o => o.name === 'emaMacd')
			.map(datapoint => ({
				time: datapoint.time,
				value: datapoint.value,
				name: datapoint.name
		}));
		emaMacdSeries.current.setData(emaMacd);
	}	

	const setMarkers =  (response) => {
		let trades = [];
		if (response.trades) {
			trades = response.trades
			.map(datapoint => ({
				dateReadable: datapoint.dateReadable,
				price: datapoint.price,
				type: datapoint.type,
			}));
		}
		for (let i = 0; i < trades.length; i++) {
			if (trades[i].type === 'SELL') {
				markers.push({
					time: trades[i].dateReadable,
					position: 'aboveBar',
					color: '#e91e63',
					shape: 'arrowDown',
					text: 'Sell ' + Math.floor(trades[i].price),
				});
			} else if (trades[i].type === 'BUY') {
				markers.push({
					time: trades[i].dateReadable,
					position: 'belowBar',
					color: '#2196F3',
					shape: 'arrowUp',
					text: 'Buy ' + Math.floor(trades[i].price),
				});
			} else {
				console.error('trades[i].type',trades[i].type)
			}
		}
		candleSeries.current.setMarkers(markers);
	}

	return (
		<>
			<MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                {featuredStrategy ? <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Profit</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">{featuredStrategy.totalProfit}%</Typography>
                                        </Grid>
                                    </Grid> : null}
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="strategies-select"
                                        select
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
										disabled={strategyEnabled}
                                    >
                                        {strategies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
							<Chart layout={chartLayoutOptions} securityName={securityName}>
								<Candles
									type={'candles'}
									ref={candleSeries}
									color={blue}
								/>
								<Volumes
									type={'histogram'}
									ref={volumeSeries}
									color={blue}
								/>	
								<Line
									type={'shortEma'}
									ref={shortEmaSeries}
									color={orange}
								/>
								<Line
									type={'longEma'}
									ref={longEmaSeries}
									color={blue}
								/>
								<Line
									type={'shortSma'}
									ref={shortSmaSeries}
									color={orange}
								/>
								<Line
									type={'longSma'}
									ref={longSmaSeries}
									color={blue}
								/>
								<Line
									type={'pSar'}
									ref={pSarSeries}
									color={orange}
								/>		
								<Line
									type={'macd'}
									ref={macdSeries}
									color={theme.palette.success.dark}
								/>	
								<Line
									type={'emaMacd'}
									ref={emaMacdSeries}
									color={theme.palette.orange.dark}
								/>									
							</Chart>
                        </Grid>
                    </Grid>
                </MainCard>
		</>
	);
};

export function Chart(props) {
	const [container, setContainer] = useState(false);
	const handleRef = useCallback(ref => setContainer(ref), []);
	return (
		<div ref={handleRef}>
			{container && <ChartContainer {...props} container={container} />}
		</div>
	);
}

export const ChartContainer = forwardRef((props, ref) => {
	const { children, container, layout, ...rest } = props;
	const { securityName} = props;
	const chartApiRef = useRef({
		api() {
			if (!this._api) {
				this._api = createChart(container, {
					...rest,
					layout,
					width: container.clientWidth,
					height: 600,
				});
				this._api.timeScale().fitContent();
			}
			return this._api;
		},
		free() {
			if (this._api) {
				this._api.remove();
			}
		},
	});

	useLayoutEffect(() => {
		const currentRef = chartApiRef.current;
		const chart = currentRef.api();

		const handleResize = () => {
			chart.applyOptions({
				...rest,
				width: container.clientWidth,
				height: container.clientHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			chart.remove();
		};
	}, []);

	useLayoutEffect(() => {
		const currentRef = chartApiRef.current;
		currentRef.api();
	}, []);

	useLayoutEffect(() => {
		const currentRef = chartApiRef.current;
		currentRef.api().applyOptions(rest);
	}, []);

	useImperativeHandle(ref, () => chartApiRef.current.api(), []);

	useEffect(() => {
		const currentRef = chartApiRef.current;
		currentRef.api().applyOptions({ layout });
	}, [layout]);

	useEffect(() => {
		const currentRef = chartApiRef.current;
	
		currentRef.api().applyOptions({
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


	return (
		<Context.Provider value={chartApiRef.current}>
			{props.children}
		</Context.Provider>
	);
});
ChartContainer.displayName = 'ChartContainer';


export const Candles = forwardRef((props, ref) => {
	const parent = useContext(Context);
	const context = useRef({
		candles() {
			if (!this._candles) {
				const { children, type, ...rest } = props;
				this._candles = parent.api().addCandlestickSeries({
					upColor: '#4bffb5',
					downColor: '#ff4976',
					borderDownColor: '#ff4976',
					borderUpColor: '#4bffb5',
					wickDownColor: '#838ca1',
					wickUpColor: '#838ca1',
					});
			}
			return this._candles;
		},
		free() {
			if (this._candles) {
				parent.free();
			}
		},
	});

	useLayoutEffect(() => {
		const currentRef = context.current;
		currentRef.candles();
		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		const currentRef = context.current;
		const { children, ...rest } = props;
		currentRef.candles().applyOptions(rest);
	});

	useImperativeHandle(ref, 
		() => (context.current.candles()),
	[]);

	return (
		<Context.Provider value={context.current}>
			{props.children}
		</Context.Provider>
	);
});
Candles.displayName = 'Candles';


export const Line = forwardRef((props, ref) => {
	const parent = useContext(Context);
	const contextLine = useRef({
		line() {
			if (!this._line) {
				const { children, type, color, ...rest } = props;
				this._line = parent.api().addLineSeries({
					color: color,
					lineWidth: 1,
					lastValueVisible: false,
					priceLineVisible: false,
					type: 'solid'
				});
			}
			return this._line;
		},
		free() {
			if (this._line) {
				parent.free();
			}
		},
	});

	useLayoutEffect(() => {
		const currentRef = contextLine.current;
		currentRef.line();
		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		const currentRef = contextLine.current;
		const { children, ...rest } = props;
		currentRef.line().applyOptions({
			priceFormat: {
				type: 'value',
				precision: 2,
				minMove: 0.01,
			},
		});
	});

	useImperativeHandle(ref, 
		() => ( contextLine.current.line()),
	[]);

	return (
		<Context.Provider value={contextLine.current}>
			{props.children}
		</Context.Provider>
	);
});
Line.displayName = 'Line';


export const Volumes = forwardRef((props, ref) => {
	const parent = useContext(Context);
	const context = useRef({
		volumes() {
			if (!this._volumes) {
				const { children, type, ...rest } = props;
				this._volumes = parent.api().addHistogramSeries({
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
			}
			return this._volumes;
		},
		free() {
			if (this._volumes) {
				parent.free();
			}
		},
	});

	useLayoutEffect(() => {
		const currentRef = context.current;
		currentRef.volumes();
		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		const currentRef = context.current;
		const { children, ...rest } = props;
		currentRef.volumes().applyOptions(rest);
	});

	useImperativeHandle(ref, () => context.current.volumes(), []);

	return (
		<Context.Provider value={context.current}>
			{props.children}
		</Context.Provider>
	);
});
Volumes.displayName = 'Volumes';


export const Area = forwardRef((props, ref) => {
	const parent = useContext(Context);
	const context = useRef({
		area() {
			if (!this._area) {
				const { children, type, ...rest } = props;
				this._area = parent.api().addAreaSeries({
					lastValueVisible: false, // hide the last value marker for this series
					crosshairMarkerVisible: false, // hide the crosshair marker for this series
					lineColor: 'transparent', // hide the line
					topColor: 'rgba(56, 33, 110,0.6)',
					bottomColor: 'rgba(56, 33, 110, 0.1)',
				});
			}
			return this._area;
		},
		free() {
			if (this._area) {
				parent.free();
			}
		},
	});

	useLayoutEffect(() => {
		const currentRef = context.current;
		currentRef.area();

		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		const currentRef = context.current;
		const { children, ...rest } = props;
		currentRef.area().applyOptions(rest);
	});

	useImperativeHandle(ref, () => context.current.area(), []);

	return (
		<Context.Provider value={context.current}>
			{props.children}
		</Context.Provider>
	);
});
Area.displayName = 'Area';


