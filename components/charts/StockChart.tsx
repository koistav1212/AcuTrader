import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time, CandlestickSeries, LineSeries } from 'lightweight-charts';

interface ChartProps {
    symbol: string;
}

const StockChart: React.FC<ChartProps> = ({ symbol }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const candlestickSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);
    
    // Indicator Series Refs
    const smaSeries = useRef<ISeriesApi<"Line"> | null>(null);
    const ema12Series = useRef<ISeriesApi<"Line"> | null>(null);
    const bbUpperSeries = useRef<ISeriesApi<"Line"> | null>(null);
    const bbLowerSeries = useRef<ISeriesApi<"Line"> | null>(null);

    const [data, setData] = useState<any[]>([]);
    const [period, setPeriod] = useState<string>('1d'); // 1d, 1wk, 1mo
    const [loading, setLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/market/historical/${symbol}?period=${period}`);
                const json = await res.json();
                
                // Handle both direct array and keyed object response
                let rawData: any[] = [];
                if (Array.isArray(json)) {
                    rawData = json;
                } else if (json[period] && Array.isArray(json[period])) {
                    rawData = json[period];
                }

                if (rawData.length > 0) {
                     // Sorting just in case
                    const sorted = rawData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setData(sorted);
                } else {
                    setData([]);
                }
            
            } catch (err) {
                console.error("Failed to fetch chart data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [symbol, period]);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9CA3AF',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.1)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            }
        }) as IChartApi;

        chartInstance.current = chart;

        // Add Series using v5 addSeries API
        candlestickSeries.current = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        smaSeries.current = chart.addSeries(LineSeries, { color: '#2962FF',  lineWidth: 1, title: 'SMA 20' });
        ema12Series.current = chart.addSeries(LineSeries, { color: '#E91E63', lineWidth: 1, title: 'EMA 12' });
        bbUpperSeries.current = chart.addSeries(LineSeries, { color: 'rgba(4, 111, 232, 0.3)', lineWidth: 1, title: 'BB Upper' });
        bbLowerSeries.current = chart.addSeries(LineSeries, { color: 'rgba(4, 111, 232, 0.3)', lineWidth: 1, title: 'BB Lower' });

        const handleResize = () => {
             if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
             }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update Data
    useEffect(() => {
        if (!chartInstance.current || data.length === 0) return;

        // Prepare Series Data
        const candles = data.map(d => ({
            time: d.date as string, // lightweight-charts handles 'YYYY-MM-DD' string
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close
        }));

        candlestickSeries.current?.setData(candles);

        // Indicators
        const smaData = data
            .filter(d => d.indicators?.sma?.period20)
            .map(d => ({ time: d.date, value: d.indicators.sma.period20 }));
        smaSeries.current?.setData(smaData);

        const ema12Data = data
             .filter(d => d.indicators?.ema?.period12)
             .map(d => ({ time: d.date, value: d.indicators.ema.period12 }));
        ema12Series.current?.setData(ema12Data);
        
        const bbUpperData = data
             .filter(d => d.indicators?.bollinger?.upper)
             .map(d => ({ time: d.date, value: d.indicators.bollinger.upper }));
        bbUpperSeries.current?.setData(bbUpperData);
        
        const bbLowerData = data
             .filter(d => d.indicators?.bollinger?.lower)
             .map(d => ({ time: d.date, value: d.indicators.bollinger.lower }));
        bbLowerSeries.current?.setData(bbLowerData);

        chartInstance.current.timeScale().fitContent();

    }, [data]);

    return (
        <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                 <h3 className="text-lg font-semibold text-[var(--text)]">Price Chart</h3>
                 <div className="flex gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
                      {['1d', '1wk', '1mo'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                period === p 
                                ? 'bg-[var(--card)] text-[var(--accent)] shadow-sm' 
                                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                            }`}
                          >
                            {p === '1d' ? 'Daily' : p === '1wk' ? 'Weekly' : 'Monthly'}
                          </button>
                      ))}
                 </div>
            </div>
            
             <div className="relative w-full h-[400px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--card)]/50 z-10 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
                    </div>
                )}
                <div ref={chartContainerRef} className="w-full h-full" />
             </div>
             
             {/* Legend/Info */}
             <div className="flex flex-wrap gap-4 mt-4 text-xs text-[var(--text-secondary)] justify-center">
                 <div className="flex items-center gap-1">
                     <div className="w-3 h-3 bg-[#26a69a]"></div>
                     <span>Bullish</span>
                 </div>
                 <div className="flex items-center gap-1">
                     <div className="w-3 h-3 bg-[#ef5350]"></div>
                     <span>Bearish</span>
                 </div>
                   <div className="flex items-center gap-1">
                     <div className="w-3 h-0.5 bg-[#2962FF]"></div>
                     <span>SMA 20</span>
                 </div>
                 <div className="flex items-center gap-1">
                     <div className="w-3 h-0.5 bg-[#E91E63]"></div>
                     <span>EMA 12</span>
                 </div>
             </div>
        </div>
    );
};

export default StockChart;
