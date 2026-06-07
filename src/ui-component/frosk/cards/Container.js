import { createChart } from 'lightweight-charts';
import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
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
	Typography,
	Collapse,
	IconButton,
	Box
  } from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MainCard from 'ui-component/cards/MainCard';
import TradesTable from './TradesTable';
import { gridSpacing } from 'store/constant';
import '../../frosk/styles.css';
import config from 'config';

const Context = createContext();

export const Container = (props) => {
	const theme = useTheme();
	const { securityName, initSelectedStrategy, disableStrategySelect} = props;
	const [selectedStrategy, setSelectedStrategy] = useState(initSelectedStrategy);
	const [featuredStrategy, setFeaturedStrategy] = useState();
	const [strategies, setStrategies] = useState();
	const [security, setSecurity] = useState();
	const [expanded, setExpanded] = useState(false);
    const blue = '#2962FF';
	const orange = '#e69138';
	const red = '#be4d25';
	const [chartLayoutOptions, setChartLayoutOptions] = useState({});
	const isIntraday = selectedStrategy && selectedStrategy.toLowerCase().includes('intraday');
	const candleSeries = useRef(null);
	const volumeSeries = useRef(null);
	const shortEmaSeries = useRef(null);
	const longEmaSeries = useRef(null);
	const shortSmaSeries = useRef(null);
	const longSmaSeries = useRef(null);
	const pSarSeries = useRef(null);
	const celSeries = useRef(null);
	const macdSeries = useRef(null);
	const emaMacdSeries = useRef(null);
	const adxSeries = useRef(null);
	const plusDISeries = useRef(null);
	const minusDISeries = useRef(null);
	const longCciSeries = useRef(null);
	const shortCciSeries = useRef(null);
	const closeSeries = useRef(null);
	const ema9Series = useRef(null);
	const ema21Series = useRef(null);
	const rsi7Series = useRef(null);


	console.log('Container securityName',securityName);
	console.log('Container security',security);

	useEffect(() => {
		getStrategies();
		setSelectedStrategy(initSelectedStrategy);
		getFeaturedStrategy();

	}, [initSelectedStrategy]);

	useEffect(() => {
		getSecurity();
		getSecurityData();
		getFeaturedStrategy();
	}, [securityName]);

	useEffect(() => {
		getSecurityData();
		getFeaturedStrategy();
	}, [selectedStrategy]);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};  

	const ExpandMore = styled((props) => {
		const { expand, ...other } = props;
		return <IconButton {...other} />;
	  })(({ theme, expand }) => ({
		transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
		  duration: theme.transitions.duration.shortest,
		}),
	  }));

	const getStrategies = () => {
		const strats = [];
		fetch(config.baseApi+"/strategies")
		  .then((response) => response.json())
		  .then((response) => {
			for (let i = 0; i < response.length; i++) {
			  strats.push(  {
				value: response[i],
				label: response[i]
			  })
			}
			setStrategies(strats);
		  });
	  }

	const getSecurity =  () => {
		fetch(`${config.baseApi}/security?name=${encodeURIComponent(securityName)}`)
		.then((response) => response.json())
		  .then((response) => {
			setSecurity(response);
		  });
	  };


	const toUnixTimestamp = (item) => ({
		...item,
		time: Math.floor(new Date(item.time).getTime() / 1000),
	});

	const mapTime = (t) => isIntraday ? Math.floor(new Date(t).getTime() / 1000) : t;

	const getSecurityData =  () => {
		const endpoint = isIntraday
			? '/intradayPrices'
			: '/prices';
		fetch(`${config.baseApi}${endpoint}?security=${encodeURIComponent(securityName)}`)
		.then((response) => response.json())
		  .then((response) => {
			const data = isIntraday ? response.map(toUnixTimestamp) : response;
			candleSeries.current.setData(data);
			volumeSeries.current.setData(data);
		  });
	  };

	const getFeaturedStrategy =  () => {
		fetch(
			`${config.baseApi}/featuredStrategy?security=${encodeURIComponent(securityName)}&strategy=${encodeURIComponent(selectedStrategy)}`
		  )
		.then((response) => response.json())
		  .then((response) => {
			console.log('response',response)
			setShortEma(response);
			setLongEma(response);
			setParabolicSar(response);
			setCel(response);
			setMacd(response);
			setEmaMacd(response);
			setAdx(response);
			setPlusDI(response);
			setMinusDI(response); 
			setLongCci(response);
			setShortCci(response);
			setClose(response);
			setEma9(response);
			setEma21(response);
			setRsi7(response);

			setMarkers(response);
			setFeaturedStrategy(response);
		  });
	}

	const setShortEma =  (response) => {
		const shortEma = response.indicatorValues
			.filter(o => o.name === 'shortEma' || o.name === 'sma10')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		if (shortEma) console.log('shortEma values',shortEma.length)
		shortEmaSeries.current.setData(shortEma);
	}

	const setLongEma =  (response) => {
		const longEma = response.indicatorValues
			.filter(o => o.name === 'longEma' || o.name === 'sma20')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		if (longEma) console.log('longEma values',longEma.length)
		longEmaSeries.current.setData(longEma);
	}

	const setParabolicSar =  (response) => {
		const pSar = response.indicatorValues
			.filter(o => o.name === 'pSar' || o.name === 'sma50')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (pSar) console.log('pSar values',pSar.length)
		pSarSeries.current.setData(pSar);
	}

	const setCel =  (response) => {
		const cel = response.indicatorValues
			.filter(o => o.name === 'cel' || o.name === 'sma100')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		if (cel) console.log('cel values',cel.length)
		celSeries.current.setData(cel);
	}

	const setMacd =  (response) => {
		const macd = response.indicatorValues
			.filter(o => o.name === 'macd')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (macd) console.log('macd values',macd.length)		
		macdSeries.current.setData(macd);
	}	

	const setEmaMacd =  (response) => {
		const emaMacd = response.indicatorValues
			.filter(o => o.name === 'emaMacd')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (emaMacd) console.log('emaMacd values',emaMacd.length)	
		emaMacdSeries.current.setData(emaMacd);
	}	

	const setAdx =  (response) => {
		const adx = response.indicatorValues
			.filter(o => o.name === 'adx')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (adx) console.log('adx values',adx.length)	
		adxSeries.current.setData(adx);
	}

	const setPlusDI =  (response) => {
		const plusDI = response.indicatorValues
			.filter(o => o.name === 'plusDI')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (plusDI) console.log('plusDI values',plusDI.length)	
		plusDISeries.current.setData(plusDI);
	}

	const setMinusDI =  (response) => {
		const minusDI = response.indicatorValues
			.filter(o => o.name === 'minusDI')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (minusDI) console.log('minusDI values',minusDI.length)	
		minusDISeries.current.setData(minusDI);
	}	

	const setLongCci =  (response) => {
		const longCci = response.indicatorValues
			.filter(o => o.name === 'longCci')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (longCci) console.log('longCci values',longCci.length)	
		longCciSeries.current.setData(longCci);
	}	

	const setShortCci =  (response) => {
		const shortCci = response.indicatorValues
			.filter(o => o.name === 'shortCci')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		//if (shortCci) console.log('shortCci values',shortCci.length)	
		shortCciSeries.current.setData(shortCci);
	}

	const setClose =  (response) => {
		const close = response.indicatorValues
			.filter(o => o.name === 'close')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		closeSeries.current.setData(close);
	}

	const setEma9 =  (response) => {
		const ema9 = response.indicatorValues
			.filter(o => o.name === 'ema9')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		ema9Series.current.setData(ema9);
	}

	const setEma21 =  (response) => {
		const ema21 = response.indicatorValues
			.filter(o => o.name === 'ema21')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		ema21Series.current.setData(ema21);
	}

	const setRsi7 =  (response) => {
		const rsi7 = response.indicatorValues
			.filter(o => o.name === 'rsi7')
			.map(datapoint => ({
				time: mapTime(datapoint.time),
				value: datapoint.value,
				name: datapoint.name
		}));
		rsi7Series.current.setData(rsi7);
	}

	const setMarkers =  (response) => {
		let markers = [];
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
					time: Math.floor(new Date(trades[i].dateReadable).getTime() / 1000),
					position: 'aboveBar',
					color: '#e91e63',
					shape: 'arrowDown',
					text: 'Sell ' + trades[i].price,
				});
			} else if (trades[i].type === 'BUY') {
				markers.push({
					time: Math.floor(new Date(trades[i].dateReadable).getTime() / 1000),
					position: 'belowBar',
					color: '#2196F3',
					shape: 'arrowUp',
					text: 'Buy ' + trades[i].price,
				});
			} else {
				console.error('trades[i].type',trades[i].type)
			}
		}
		markers = markers.sort((a,b) => (a.time - b.time));
		candleSeries.current.setMarkers(markers);
	}

	return (
		<>
			<MainCard>
		 		<Grid container spacing={gridSpacing}>
                        <Grid item lg={12}  md={12} xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                               <Grid item alignSelf={"flex-start"}>
								{ (featuredStrategy && security)  ? (
									<Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
										{security.desc},Profit: {featuredStrategy.totalProfit}% , Beta: {security.beta}, Revenue growth: {security.yoyGrowth}%, PEG Ratio: {security.pegRatio}
    								</Typography>
								) : null}
                                </Grid>								
								<Grid item>
									<Box
										component="button"
										sx={{
											ml: 2,
											px: 2,
											py: 1,
											bgcolor: 'primary.main',
											color: 'white',
											border: 'none',
											borderRadius: 1,
											cursor: 'pointer',
										}}
										onClick={async () => {
											try {
 												await fetch(`${config.baseApi}/runAction?action=LOAD_DATA&security=${encodeURIComponent(security.id)}&strategy=${encodeURIComponent(selectedStrategy)}`)
												// refresh displayed data after backend update
												getSecurityData();
												getFeaturedStrategy();
											} catch (err) {
												console.error('Update request failed', err);
											}
										}}
									>
										Load data
									</Box>
								</Grid>
								<Grid item>
									<Box
										component="button"
										sx={{
											ml: 2,
											px: 2,
											py: 1,
											bgcolor: 'primary.main',
											color: 'white',
											border: 'none',
											borderRadius: 1,
											cursor: 'pointer',
										}}
										onClick={async () => {
											try {
 												await fetch(`${config.baseApi}/runAction?action=RUN_STRATEGY&security=${encodeURIComponent(security.id)}&strategy=${encodeURIComponent(selectedStrategy)}`)
												// refresh displayed data after backend update
												getSecurityData();
												getFeaturedStrategy();
											} catch (err) {
												console.error('Update request failed', err);
											}
										}}
									>
										Run strategy
									</Box>
								</Grid>
                                <Grid item>
                                 <TextField
                                        id="strategies-select"
                                        select
                                        value={selectedStrategy}
                                        onChange={(e) => setSelectedStrategy(e.target.value)}
										disabled={disableStrategySelect}
                                    >
                                        {strategies ?  strategies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        )): null}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
						<Grid item id="legend">
                        </Grid>	
                        <Grid item xs={12}>
							<Chart layout={chartLayoutOptions} securityName={securityName} isIntraday={isIntraday}>
								<Candles
									type={'candles'}
									ref={candleSeries}
									color={blue}
									isIntraday={isIntraday}
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
									type={'cel'}
									ref={celSeries}
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
								<Line
									type={'adx'}
									ref={adxSeries}
									color={red}
								/>
								<Line
									type={'plusDI'}
									ref={plusDISeries}
									color={blue}
								/>
								<Line
									type={'minusDI'}
									ref={minusDISeries}
									color={theme.palette.orange.dark}
								/>
								<Line
									type={'longCci'}
									ref={longCciSeries}
									color={red}
								/>
								<Line
									type={'shortCci'}
									ref={shortCciSeries}
									color={blue}
								/>
								<Line
									type={'close'}
									ref={closeSeries}
									color={theme.palette.grey[500]}
								/>
								<Line
									type={'ema9'}
									ref={ema9Series}
									color={orange}
								/>
								<Line
									type={'ema21'}
									ref={ema21Series}
									color={blue}
								/>
							</Chart>
                        </Grid>
						<Grid item xs={12}>
							<Chart layout={chartLayoutOptions} securityName={securityName} isIntraday={isIntraday} height={200}>
								<Line
									type={'rsi7'}
									ref={rsi7Series}
									color={theme.palette.success.dark}
								/>
							</Chart>
						</Grid>
                        {featuredStrategy ? 
						<Grid item xs={12}>  
                          <Typography variant="h5">{featuredStrategy.numberofTrades} Trades on {featuredStrategy.name} | {featuredStrategy.securityName} </Typography>
                          <ExpandMore
                              expand={expanded}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more">
                            <ExpandMoreIcon />
                          </ExpandMore>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                              {featuredStrategy.trades ? <TradesTable trades={featuredStrategy.trades} isIntraday={isIntraday} />:null }
                            </Collapse>   
                        </Grid>: null}

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
	const { children, container, layout, isIntraday, height = 600, ...rest } = props;
	const { securityName } = props;

	console.log('ChartContainer securityName',securityName);


	const chartApiRef = useRef({
		api() {
			if (!this._api) {
				this._api = createChart(container, {
					...rest,
					layout,
					width: container.clientWidth,
					height,
					timeScale: {
						timeVisible: !!isIntraday,
						secondsVisible: false,
					},
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
		const chart = currentRef.api();
	
		function clickHandler() {
			if (securityName && securityName.endsWith('.ST')) {
				window.open('https://finance.yahoo.com/chart/'+securityName, '_blank');
			} else if (securityName) {
				window.open('https://www.coinbase.com/advanced-trade/'+securityName, '_blank');
			}
		}
		
		chart.subscribeClick(clickHandler);
		
		// Cleanup: unsubscribe the previous handler when securityName changes
		return () => {
			chart.unsubscribeClick(clickHandler);
		};
	}, [securityName]); // Add securityName as dependency

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
			timeScale: {
				timeVisible: !!isIntraday,
				secondsVisible: false,
			},
		});
	}, [isIntraday]);

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
					priceFormat: {
						type: 'close',
						precision: 6,
						minMove: 0.00001,
					}
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

		parent.api().subscribeCrosshairMove(param => {
			let open, high, low, close = '';
			let timeLabel = '';
			if (param.time) {
				const price = param.seriesPrices.get(currentRef.candles());
				open = price.open;
				high = price.high;
				low = price.low;
				close = price.close;
				if (props.isIntraday && typeof param.time === 'number') {
					const d = new Date(param.time * 1000);
					const yyyy = d.getFullYear();
					const mm = String(d.getMonth() + 1).padStart(2, '0');
					const dd = String(d.getDate()).padStart(2, '0');
					const hh = String(d.getHours()).padStart(2, '0');
					const min = String(d.getMinutes()).padStart(2, '0');
					timeLabel = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
				}
			}
			if (document.getElementById("legend") !== null) {
				const timePart = timeLabel ? `Time:<strong>${timeLabel}</strong> ` : '';
				document.getElementById("legend").innerHTML = `${timePart}Open:<strong>${open}</strong> High:<strong>${high}</strong> Low:<strong>${low}</strong> Close:<strong>${close}</strong>`;
			}
		});
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
	let lineStyle = 0; //https://tradingview.github.io/lightweight-charts/docs/api/interfaces/LineStyleOptions
	const contextLine = useRef({
		line() {
			if (!this._line) {
				const { children, type, color, ...rest } = props;
				if (type === 'cel') {
					lineStyle = 2;
				}
				this._line = parent.api().addLineSeries({ 
					color: color,
					lineWidth: 2,
					lineStyle: lineStyle, 
					lastValueVisible: true,
					priceLineVisible: true,
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
				precision: 6,
				minMove: 0.00001,
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


