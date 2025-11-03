// configs.js
// Consolidate demo chart configurations

import {
  LIMITFUTURE,
  LIMITPAST,
  MINCANDLES,
  MAXCANDLES
} from './src/definitions/chart';
import * as talib from './node_modules/talib-web/lib/index.esm';
import wasm from './src/wasm/talib.wasm.dataURI.js';

import {
  state1,
  state2,
  state3,
  state1_5a,
  state1_5b,
  state4,
  state5,
  decimals,
  btcusdt_15min,
  tradesTestState
} from './states.js';

let rangeStartTS = undefined;
let streamVal = { tfCountDown: true, alerts: [] };

const config1 = {
  id: 'TradeX_Config1',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  timeFrame: '1m',
  range: {
    startTS: rangeStartTS,
    initialCnt: 40,
    limitFuture: LIMITFUTURE,
    limitPast: LIMITPAST,
    minCandles: MINCANDLES,
    maxCandles: MAXCANDLES,
    yAxisBounds: 0.3,
    center: false
  },
  theme: {
    candle: {
      Type: 'candle_down_hollow',
      UpBodyColour: '#FAEB2488',
      UpWickColour: '#FAEB24',
      DnBodyColour: '#F900FE88',
      DnWickColour: '#F900FE'
    },
    volume: { Height: 15, UpColour: '#FAEB2444', DnColour: '#F900FE44' },
    xAxis: { tickMarker: false },
    yAxis: { tickMarker: false },
    chart: {
      Background: '#141414',
      BorderColour: '#141414',
      GridColour: '#303030',
      TextColour: '#c0c0c0'
    },
    primaryPane: {},
    tools: { location: false },
    utils: { location: false },
    time: { navigation: false },
    legend: { controls: true, titleStyle: 'font-size: 1em;' }
  },
  watermark: { display: true, text: 'BTC/USDT' },
  trades: { display: true, displayInfo: true },
  dca: true,
  highLow: true,
  isCrypto: true,
  logs: true,
  infos: true,
  warnings: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: state1,
  callbacks: {
    indicatorSettings: {
      fn: (c) => {
        alert(c.id);
      },
      own: true
    }
  }
};

const config2 = {
  id: 'TradeX_Config2',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  timeFrame: '1m',
  theme: {
    title: { display: true },
    candle: {
      Type: 'candle_solid',
      UpBodyColour: '#00F04088',
      UpWickColour: '#0F4',
      DnBodyColour: '#F0004088',
      DnWickColour: '#F04'
    },
    volume: { Height: 15, UpColour: '#00F04044', DnColour: '#F0004044' },
    chart: {
      Background: '#141414',
      BorderColour: '#444',
      GridColour: '#333',
      TextColour: '#ccc'
    },
    primaryPane: {},
    utils: { location: false },
    legend: { titleStyle: 'font-size: 1em;' }
  },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  highLow: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: state2,
  progress: { loading: {} }
};

const config3 = {
  id: 'TradeX_Config3',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  timeFrame: '1m',
  range: { startTS: rangeStartTS, limitFuture: 10 },
  theme: {
    candle: {
      Type: 'candle_solid',
      UpBodyColour: '#02FFFF88',
      UpWickColour: '#02FFFF',
      DnBodyColour: '#F900FE88',
      DnWickColour: '#F900FE'
    },
    volume: { Height: 15, UpColour: '#02FFFF44', DnColour: '#F900FE44' },
    xAxis: {
      colourTick: '#96a9db',
      colourLabel: '#96a9db',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      slider: '#586ea6',
      handle: '#586ea688'
    },
    yAxis: {
      colourTick: '#96a9db',
      colourLabel: '#96a9db',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7'
    },
    chart: {
      Background: '#2A2B3A',
      BorderColour: '#586ea6',
      BorderThickness: 1,
      GridColour: '#313647',
      TextColour: '#96a9db'
    },
    primaryPane: {},
    secondaryPane: {},
    utils: { location: true },
    tools: { location: true },
    time: { colour: '#96a9db', handleColour: '#586ea6' },
    legend: { colour: '#96a9db' },
    icon: { colour: '#748bc7', hover: '#96a9db' }
  },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  highLow: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: {}
};

const config4 = {
  id: 'TradeX_Config4',
  title: 'FUN/USDT',
  symbol: 'funusdt',
  utils: {},
  tools: {},
  timeFrame: '1s',
  range: { startTS: state4.ohlcv.slice(-1)[0][0] - 15000, initialCnt: 40 },
  theme: {
    candle: {
      Type: 'candle_down_hollow',
      AreaLineColour: '#08C5F5',
      UpBodyColour: '#08C5F588',
      UpWickColour: '#08C5F5',
      DnBodyColour: '#F6243888',
      DnWickColour: '#F62438'
    },
    volume: { Height: 15, UpColour: '#08C5F544', DnColour: '#0805F544' },
    xAxis: { tickMarker: false },
    yAxis: { tickMarker: false, location: 'left' },
    chart: {
      Background: '#141414',
      BorderColour: '#141414',
      GridColour: '#333',
      TextColour: '#ccc'
    },
    primaryPane: {},
    utils: { location: true }
  },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  highLow: true,
  errors: true,
  stream: { tfCountDown: false, alerts: [] },
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: state4
};

const config5 = {
  id: 'TradeX_Config5_Midnight',
  title: 'ETH/USDT',
  symbol: 'ethusdt',
  utils: {},
  tools: {},
  timeFrame: '1m',
  range: { startTS: rangeStartTS },
  theme: {
    candle: {
      Type: 'area',
      AreaLineColour: '#4c5fe7',
      AreaFillColour: ['#4c5fe780', '#4c5fe700'],
      UpBodyColour: '#4c5fe7',
      UpWickColour: '#4c5fe7',
      DnBodyColour: '#4c5fe7',
      DnWickColour: '#4c5fe7'
    },
    volume: { Height: 15, UpColour: '#4bc67c', DnColour: '#2e384f' },
    xAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      slider: '#586ea6',
      handle: '#586ea688',
      tickMarker: false
    },
    yAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      tickMarker: false,
      location: 'left'
    },
    chart: {
      Background: '#0f1213',
      BorderColour: '#00000000',
      BorderThickness: 1,
      GridColour: '#191e26',
      TextColour: '#6a6f80'
    },
    primaryPane: {},
    secondaryPane: {},
    time: {},
    legend: { colour: '#96a9db' },
    icon: { colour: '#748bc7', hover: '#96a9db' },
    tools: { location: false },
    utils: { location: false }
  },
  watermark: { text: 'ETH/USDT', textColour: '#13171e' },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  highLow: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: {}
};

const config6 = {
  id: 'TradeX_Config6_Midnight',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  timeFrame: '1h',
  range: { startTS: state1_5b.ohlcv[0][0] },
  theme: {
    candle: {
      Type: 'candle_solid',
      AreaLineColour: '#4c5fe7',
      AreaFillColour: ['#4c5fe780', '#4c5fe700'],
      UpBodyColour: '#4c5fe7',
      UpWickColour: '#4c5fe7',
      DnBodyColour: '#2e384f88',
      DnWickColour: '#2e384f'
    },
    volume: { Height: 15, UpColour: '#4bc67c', DnColour: '#2e384f' },
    xAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      slider: '#586ea6',
      handle: '#586ea688',
      tickMarker: false
    },
    yAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      tickMarker: false,
      location: 'left'
    },
    chart: {
      Background: '#0f1213',
      BorderColour: '#00000000',
      BorderThickness: 1,
      GridColour: '#191e26',
      TextColour: '#6a6f80'
    },
    primaryPane: {},
    secondaryPane: {},
    time: {},
    legend: { colour: '#96a9db' },
    icon: { colour: '#748bc7', hover: '#96a9db' },
    tools: { location: false },
    utils: { location: false }
  },
  watermark: { text: 'BTC/USDT', textColour: '#13171e' },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  highLow: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: state1_5b
};

const config7 = {
  id: 'TradeX_Config7',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  timeFrame: '15m',
  range: {
    startTS: rangeStartTS,
    initialCnt: 30,
    limitFuture: LIMITFUTURE,
    limitPast: LIMITPAST,
    minCandles: MINCANDLES,
    maxCandles: MAXCANDLES,
    yAxisBounds: 0.3,
    center: true
  },
  theme: {
    candle: {
      Type: 'candle_down_hollow',
      UpBodyColour: '#FAEB2488',
      UpWickColour: '#FAEB24',
      DnBodyColour: '#F900FE88',
      DnWickColour: '#F900FE'
    },
    volume: { Height: 15, UpColour: '#FAEB2444', DnColour: '#F900FE44' },
    xAxis: { tickMarker: false },
    yAxis: { tickMarker: false },
    chart: {
      Background: '#141414',
      BorderColour: '#141414',
      GridColour: '#303030',
      TextColour: '#c0c0c0'
    },
    primaryPane: {},
    tools: { location: false },
    utils: { location: false },
    time: { navigation: false },
    legend: { controls: true, titleStyle: 'font-size: 1em;' }
  },
  watermark: { text: 'BTC/USDT' },
  highLow: true,
  isCrypto: true,
  logs: true,
  infos: true,
  warnings: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: state3,
  callbacks: {
    indicatorSettings: {
      fn: (c) => {
        alert(c.id);
      },
      own: true
    }
  }
};

const config8 = {
  id: 'TradeX_Config8',
  title: 'IMPT/USDT',
  symbol: 'imptusdt',
  utils: {},
  tools: {},
  timeFrame: '1d',
  range: {
    startTS: rangeStartTS,
    initialCnt: 30,
    limitFuture: LIMITFUTURE,
    limitPast: LIMITPAST,
    minCandles: MINCANDLES,
    maxCandles: MAXCANDLES,
    yAxisBounds: 0.3,
    center: true
  },
  theme: {
    candle: {
      Type: 'candle_down_hollow',
      UpBodyColour: '#FAEB2488',
      UpWickColour: '#FAEB24',
      DnBodyColour: '#F900FE88',
      DnWickColour: '#F900FE'
    },
    volume: { Height: 15, UpColour: '#FAEB2444', DnColour: '#F900FE44' },
    xAxis: { tickMarker: false },
    yAxis: { tickMarker: false },
    chart: {
      Background: '#141414',
      BorderColour: '#141414',
      GridColour: '#303030',
      TextColour: '#c0c0c0'
    },
    primaryPane: {},
    tools: { location: false },
    utils: { location: false },
    time: { navigation: false },
    legend: { controls: true }
  },
  watermark: { text: 'IMPT/USDT' },
  highLow: true,
  isCrypto: true,
  logs: true,
  infos: true,
  warnings: true,
  errors: true,
  stream: streamVal,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: decimals,
  callbacks: {
    indicatorSettings: {
      fn: (c) => {
        alert(c.id);
      },
      own: true
    }
  }
};

const dre = {
  id: 'TradeX_Config9',
  title: 'BTC/USDT',
  symbol: 'btcusdt',
  utils: {},
  tools: {},
  range: { initialCnt: 30, limitPast: 96 / 12, limitFuture: 96 },
  theme: {
    candle: {
      Type: 'candle_solid',
      AreaLineColour: '#4c5fe7',
      AreaFillColour: ['#4c5fe780', '#4c5fe700'],
      UpBodyColour: '#4c5fe7',
      UpWickColour: '#4c5fe7',
      DnBodyColour: '#2e384f88',
      DnWickColour: '#2e384f'
    },
    volume: { Height: 15, UpColour: '#4bc67c', DnColour: '#2e384f' },
    xAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      slider: '#586ea6',
      handle: '#586ea688',
      tickMarker: false
    },
    yAxis: {
      colourTick: '#6a6f80',
      colourLabel: '#6a6f80',
      colourCursor: '#2A2B3A',
      colourCursorBG: '#aac0f7',
      tickMarker: false,
      location: 'right'
    },
    chart: {
      Background: '#0f1213',
      BorderColour: '#00000000',
      BorderThickness: 1,
      GridColour: '#191e26',
      TextColour: '#6a6f80'
    },
    onChart: {},
    offChart: {},
    time: { navigation: false, colour: '#96a9db', handleColour: '#586ea6' },
    legend: { colour: '#96a9db', controls: true },
    icon: { colour: '#748bc7', hover: '#96a9db' },
    tools: { location: false },
    utils: { location: false }
  },
  deepValidate: false,
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  errors: true,
  maxCandleUpdate: 250,
  talib,
  wasm,
  state: {
    ohlcv: btcusdt_15min,
    primary: [
      {
        name: 'Trades',
        type: 'trades',
        settings: { 'z-index': 5, legend: false },
        data: {
          1695906000000: [
            {
              timestamp: 1695906000000,
              id: '012336352',
              side: 'buy',
              price: 27032,
              amount: 0.25,
              filled: 0.25,
              average: 27032,
              total: 27032,
              tag: 'Bot ABC - BTC/USDT'
            }
          ],
          1695945600000: [
            {
              timestamp: 1695945600000,
              id: '012335353',
              side: 'sell',
              price: 27032,
              amount: 0.25,
              filled: 0.25,
              average: 27032,
              total: 27032,
              tag: 'Bot ABC - BTC/USDT'
            }
          ],
          1696327200000: [
            {
              timestamp: 1696327200000,
              id: '012335354',
              side: 'sell',
              price: 27550.6,
              amount: 0.25,
              filled: 0.25,
              average: 27550.6,
              total: 27550.6,
              tag: 'Bot ABC - BTC/USDT'
            }
          ]
        }
      }
    ]
  }
};

const configs = [
  {
    config: config1,
    stream: null,
    description: 'Basic Chart - Standard Config'
  },
  {
    config: config2,
    stream: null,
    description: 'BTC/USDT - Basic Chart with Custom Theme'
  },
  {
    config: config3,
    stream: null,
    description: 'Blue Theme - Custom Color Scheme'
  },
  {
    config: config4,
    stream: null,
    description: 'FUN/USDT - Test State with Minimal Data'
  },
  { config: config5, stream: null, description: 'ETH/USDT - Area Chart Style' },
  {
    config: config6,
    stream: null,
    description: 'BTC/USDT 1H - Hourly Timeframe'
  },
  { config: config7, stream: null, description: 'BTC/USDT 15M - Custom Range' },
  {
    config: config8,
    stream: null,
    description: 'IMPT/USDT 1D - Daily Timeframe'
  },
  { config: dre, stream: null, description: 'Advanced Trades Display' }
  
];

export {
  streamVal,
  rangeStartTS,
  config1,
  config2,
  config3,
  config4,
  config5,
  config6,
  config7,
  config8,
  dre,
  configs
};
