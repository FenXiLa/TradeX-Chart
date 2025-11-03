/**
 * TradeX-chart Demo Application
 * 
 * This file demonstrates the capabilities of TradeX-chart, a professional
 * trading chart library. It includes:
 * 
 * Features Showcased:
 * - Multiple chart configurations with different themes
 * - Custom indicators (TEST, DBLMA, TRDFLO)
 * - Real-time data streaming (Binance WebSocket)
 * - Different chart types (candles, area)
 * - Various timeframes (1m, 15m, 1h, 1d)
 * - Drawing tools and annotations
 * - Trade markers and overlays
 * - State management and configuration switching
 * - Fullscreen functionality
 * 
 * Usage:
 * - Click "Add Chart" to create new chart instances
 * - Each chart cycles through different configurations
 * - Use "Full Screen" to enter fullscreen mode
 * - Charts support real-time updates via WebSocket
 */

/**
 * Performance and Error Diagnostics
 * 
 * Comprehensive logging system to diagnose page loading issues.
 * Tracks timing, errors, memory usage, and chart initialization states.
 */

const DIAGNOSTICS = {
  enabled: true,
  startTime: performance.now(),
  checkpoints: [],
  errors: [],
  warnings: [],
  memory: [],
  
  log(message, type = 'info') {
    if (!this.enabled) return
    
    const timestamp = ((performance.now() - this.startTime) / 1000).toFixed(3) + 's'
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`
    
    switch(type) {
      case 'error':
        console.error(logEntry)
        this.errors.push({ time: timestamp, message })
        break
      case 'warn':
        console.warn(logEntry)
        this.warnings.push({ time: timestamp, message })
        break
      case 'checkpoint':
        console.log(`✅ ${logEntry}`)
        this.checkpoints.push({ time: timestamp, message })
        break
      default:
        console.log(logEntry)
    }
  },
  
  checkpoint(name) {
    this.log(`Checkpoint: ${name}`, 'checkpoint')
  },
  
  error(message, error = null) {
    this.log(message, 'error')
    if (error) {
      console.error('Error details:', error)
      this.errors.push({ 
        time: ((performance.now() - this.startTime) / 1000).toFixed(3) + 's',
        message,
        stack: error.stack,
        name: error.name
      })
    }
  },
  
  warn(message) {
    this.log(message, 'warn')
  },
  
  memoryCheck() {
    if (performance.memory) {
      const mem = {
        used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      }
      this.memory.push({
        time: ((performance.now() - this.startTime) / 1000).toFixed(3) + 's',
        ...mem
      })
      this.log(`Memory: ${mem.used} / ${mem.total} (limit: ${mem.limit})`)
    }
  },
  
  summary() {
    console.group('🔍 Diagnostics Summary')
    console.log(`Total time: ${((performance.now() - this.startTime) / 1000).toFixed(3)}s`)
    console.log(`Checkpoints: ${this.checkpoints.length}`)
    console.log(`Errors: ${this.errors.length}`)
    console.log(`Warnings: ${this.warnings.length}`)
    
    if (this.errors.length > 0) {
      console.group('❌ Errors:')
      this.errors.forEach(e => console.error(e))
      console.groupEnd()
    }
    
    if (this.warnings.length > 0) {
      console.group('⚠️ Warnings:')
      this.warnings.forEach(w => console.warn(w))
      console.groupEnd()
    }
    
    if (this.memory.length > 0) {
      console.group('💾 Memory Usage:')
      this.memory.forEach(m => console.log(`${m.time}: ${m.used} / ${m.total}`))
      console.groupEnd()
    }
    
    console.groupEnd()
  }
}

// Initialize diagnostics
DIAGNOSTICS.checkpoint('Diagnostics system initialized')
DIAGNOSTICS.memoryCheck()

import { Chart, DOM } from './src'
import { LIMITFUTURE, LIMITPAST, MINCANDLES, MAXCANDLES, YAXIS_BOUNDS } from "./src/definitions/chart"
import * as talib from './node_modules/talib-web/lib/index.esm'
// const wasm = "node_modules/talib-web/lib/talib.wasm"
import wasm from './src/wasm/talib.wasm.dataURI.js'
// const talib = null
// const wasm = null

// let state = undefined

/**
 * States and Configurations
 * 
 * All states are now imported from states.js
 * All configurations are now imported from configs.js
 * 
 * State files:
 * - state1: 1 Hour Timeframe Data (./data/1hour.js)
 * - state2: 1 Minute Timeframe Data (./data/data_btc_1m.js)
 * - state3: 15 Minute Timeframe Data (./data/ohlcv_15m_BTC.js)
 * - state4, state5, state9: Test states with minimal data
 * - state1_5a, state1_5b: Split states derived from state1
 * - decimals: Daily IMPT/USDT data
 * - btcusdt_15min: BTC/USDT 15-minute data
 * - tradesTestState: State with trade markers
 * 
 * Configuration files:
 * - config1..config8: Various chart configurations with different themes
 * - dre: Advanced trades display configuration
 * - configs: Array of all available configurations for demo
 */

// Import states from states.js
import { state1, state2, state3, state1_5a, state1_5b, state4, state5, state9, decimals, btcusdt_15min, tradesTestState } from './states.js'

// Import configs from configs.js
import { rangeStartTS, streamVal, config1, config2, config3, config4, config5, config6, config7, config8, dre, configs } from './configs.js'

// Import custom indicators and utilities
import TEST from './demos/custom/custom-indicator.js'
import DblMA from './demos/custom/custom-dbl-ma.js'
import DblMA2 from './demos/custom/custom-dbl-ma2.js'
import CustomOverlay from './demos/custom/custom-overlay.js'
// import chartDCA from './chart-dca'
import TradeFlow from './demos/custom/trade-flow.js'

import bearHawk from './data/bear-hawk.js'
import { text } from './src/definitions/icons.js'
import { loadStates, statesDropDown } from './demos/js/loadStates.js'
import { loadTimeFrame } from './demos/js/loadTimeFrame.js'
import { addIndicatorDropdown } from './demos/js/addIndicator.js'

import { livePrice_Binance, onRangeLimit2 } from './demos/dataSource/binance.js'

// Stream configuration
let interval = 500
let streamInit = false

/**
 * Configuration 1: Basic BTC/USDT Chart with Custom Theme
 * 
 * A comprehensive chart configuration demonstrating basic TradeX-chart features.
 * 
 * Key Features:
 * - Custom candle colors: Yellow/green theme (Up: #FAEB24, Down: #F900FE)
 * - Watermark: Displays "BTC/USDT" on chart
 * - High/Low markers: Shows price extremes
 * - Trade display: Shows executed trades on the chart
 * - Stream support: Configured for real-time price updates
 * - Indicator callbacks: Custom handling for indicator settings
 * - Tools & Utils: Disabled UI elements for cleaner look
 * - Time navigation: Disabled to focus on price action
 * 
 * Theme:
 * - Candle type: "candle_down_hollow" (hollow candles for down, solid for up)
 * - Background: Dark (#141414)
 * - Grid: Subtle gray (#303030)
 * 
 * Data:
 * - Uses state1 (1-hour timeframe data)
 * - Initial display: 40 candles
 * - Supports range limits for scrolling
 * 
 * Timeframe: 1 minute (configurable)
 * Symbol: BTC/USDT
 */
/* configs moved to configs.js */
/* original config1..config8, dre definitions removed */

// Export configs to window for global access
window.config1 = config1
window.config2 = config2
window.config3 = config3
window.config4 = config4
window.config5 = config5
window.config6 = config6
window.config7 = config7
window.config8 = config8
window.dre = dre

/**
 * Chart Configurations Array
 * 
 * All configurations are now imported from configs.js
 */

const main = DOM.findBySelector('main')
const add = document.querySelector("#add")
add.onclick = addChart


/**
 * Add Chart Function
 * 
 * Creates and initializes a new TradeX-chart instance with a configuration
 * from the configs array. Charts are cycled through when adding multiple charts.
 * 
 * Features:
 * - Dynamic chart creation
 * - Configuration cycling
 * - Stream support (if configured)
 * - Chart registry in window object
 */
function addChart() {
  const chartStartTime = performance.now()
  const chartNum = (window.chartCount || 0) + 1
  window.chartCount = chartNum
  
  try {
    DIAGNOSTICS.log(`Starting to create chart ${chartNum}`)
    
    // Check if main element exists
    if (!main) {
      DIAGNOSTICS.error(`Cannot create chart ${chartNum}: main element not found`)
      return
    }
    
    let chart = document.createElement("tradex-chart")
    if (!chart) {
      DIAGNOSTICS.error(`Failed to create tradex-chart element for chart ${chartNum}`)
      return
    }
    
    let section = document.createElement("section")
    
    // Set crosshair cursor for better chart interaction
    section.setAttribute('style', 'cursor: crosshair')
    section.appendChild(chart)
    main.appendChild(section)

    // Get configuration from array (cycles through all configs)
    const configIndex = (chartNum - 1) % configs.length
    const {config, stream, description} = configs[configIndex]
    
    if (!config) {
      DIAGNOSTICS.error(`Config not found at index ${configIndex} for chart ${chartNum}`)
      return
    }
    
    DIAGNOSTICS.log(`Chart ${chartNum} using config index ${configIndex}: ${description || 'no description'}`)
    
    // Check if config has state data defined
    // Handle different config formats:
    // 1. config.state.ohlcv - normal format (like config1, config2, config7, config8)
    // 2. config itself is a state object (like tradesTestState - it has state property)
    // 3. config.state is empty object {} (like config3, config5 - expected to be empty)
    let configHasState = false
    
    // First check: does config have a state property with ohlcv data?
    if (config.state) {
      if (config.state.ohlcv && Array.isArray(config.state.ohlcv) && config.state.ohlcv.length > 0) {
        configHasState = true
        DIAGNOSTICS.log(`Chart ${chartNum} has state.ohlcv with ${config.state.ohlcv.length} items`)
      }
      // Check if state has primary/secondary arrays with data (like tradesTestState)
      else if (config.state.primary && Array.isArray(config.state.primary) && config.state.primary.length > 0) {
        configHasState = true
        DIAGNOSTICS.log(`Chart ${chartNum} has state.primary with ${config.state.primary.length} items`)
      }
      // Check for any meaningful nested data
      else if (typeof config.state === 'object') {
        const stateKeys = Object.keys(config.state)
        // Empty object {} means no data expected
        if (stateKeys.length === 0) {
          configHasState = false
          DIAGNOSTICS.log(`Chart ${chartNum} has empty state object (expected)`)
        }
        // Check if any value contains data
        else {
          const hasData = Object.values(config.state).some(value => {
            if (Array.isArray(value)) return value.length > 0
            if (typeof value === 'object' && value !== null) {
              // Check nested objects for arrays or other data
              return Object.values(value).some(v => 
                (Array.isArray(v) && v.length > 0) || 
                (typeof v === 'object' && v !== null && Object.keys(v).length > 0)
              )
            }
            return false
          })
          configHasState = hasData
          if (hasData) {
            DIAGNOSTICS.log(`Chart ${chartNum} has nested data in state`)
          }
        }
      }
    }
    
    DIAGNOSTICS.log(`Chart ${chartNum} configHasState: ${configHasState}, description: ${description || 'N/A'}`)
    
    // Initialize chart with configuration
    try {
      chart.start(config)
      const initTime = ((performance.now() - chartStartTime) / 1000).toFixed(3)
      DIAGNOSTICS.log(`Chart ${chartNum} initialized in ${initTime}s`)
      
      // Wait for chart to process initial data before refresh
      // Longer delay for charts that should have data to ensure it's loaded
      const refreshDelay = configHasState ? 500 : 100
      
      setTimeout(() => {
        try {
          chart.refresh()
          
          // Verify chart has data (only check if config should have state data)
          if (configHasState) {
            // Use recursive check with multiple attempts for charts that should have data
            // Increase attempts and delay for better reliability
            const checkChartData = (attempts = 15, delay = 400) => {
              if (attempts <= 0) {
                // Final comprehensive check - try all possible data locations
                let chartHasData = false
                let dataCount = 0
                let dataLocation = 'none'
                
                // Check chart.state.ohlcv
                if (chart.state && chart.state.ohlcv && Array.isArray(chart.state.ohlcv) && chart.state.ohlcv.length > 0) {
                  chartHasData = true
                  dataCount = chart.state.ohlcv.length
                  dataLocation = 'chart.state.ohlcv'
                }
                // Check chart.range.value() function
                else if (chart.range && typeof chart.range.value === 'function') {
                  try {
                    const rangeValue = chart.range.value()
                    if (Array.isArray(rangeValue) && rangeValue.length > 0) {
                      chartHasData = true
                      dataCount = rangeValue.length
                      dataLocation = 'chart.range.value()'
                    }
                  } catch (err) {
                    // range.value() might not be ready yet
                  }
                }
                // Check chart.ohlcv directly
                else if (chart.ohlcv && Array.isArray(chart.ohlcv) && chart.ohlcv.length > 0) {
                  chartHasData = true
                  dataCount = chart.ohlcv.length
                  dataLocation = 'chart.ohlcv'
                }
                // Check if chart has any rendered content (last resort)
                else if (chart.shadowRoot || chart.querySelector) {
                  // Chart might have rendered but data structure is different
                  // This is less reliable but indicates chart is active
                  const hasRenderedContent = chart.shadowRoot?.querySelector('canvas') || 
                                             chart.querySelector('canvas') ||
                                             chart.shadowRoot?.querySelector('svg') ||
                                             chart.querySelector('svg')
                  if (hasRenderedContent) {
                    // Chart is rendered, assume data is there but in a different structure
                    chartHasData = true
                    dataLocation = 'rendered content detected'
                  }
                }
                
                if (chartHasData) {
                  DIAGNOSTICS.log(`Chart ${chartNum} has data: ${dataCount} points at ${dataLocation}`)
                } else {
                  // Only warn if we're confident the config should have data
                  DIAGNOSTICS.warn(`Chart ${chartNum} may have data loading issues. Config: ${description || 'unknown'}`)
                  // Log detailed debugging info
                  DIAGNOSTICS.log(`Chart ${chartNum} diagnostic info:`, {
                    hasState: !!config.state,
                    stateKeys: config.state ? Object.keys(config.state) : [],
                    hasOhlcv: !!(config.state && config.state.ohlcv),
                    ohlcvLength: config.state && config.state.ohlcv ? config.state.ohlcv.length : 0,
                    chartHasState: !!(chart.state),
                    chartStateKeys: chart.state ? Object.keys(chart.state) : [],
                    chartHasRange: !!(chart.range),
                    chartHasOhlcv: !!(chart.ohlcv)
                  })
                }
                return
              }
              
              setTimeout(() => {
                // Check multiple possible data locations
                const hasData = (
                  (chart.state && chart.state.ohlcv && Array.isArray(chart.state.ohlcv) && chart.state.ohlcv.length > 0) ||
                  (chart.ohlcv && Array.isArray(chart.ohlcv) && chart.ohlcv.length > 0) ||
                  (chart.range && chart.range.value && typeof chart.range.value === 'function' && 
                   (() => {
                     try {
                       const val = chart.range.value()
                       return Array.isArray(val) && val.length > 0
                     } catch (e) {
                       return false
                     }
                   })())
                )
                
                if (hasData) {
                  const dataCount = (chart.state && chart.state.ohlcv ? chart.state.ohlcv.length : 0) ||
                                   (chart.ohlcv ? chart.ohlcv.length : 0) ||
                                   (chart.range && chart.range.value && typeof chart.range.value === 'function' ? 
                                    (() => {
                                      try {
                                        return chart.range.value().length || 0
                                      } catch (e) {
                                        return 0
                                      }
                                    })() : 0)
                  DIAGNOSTICS.log(`Chart ${chartNum} has ${dataCount} data points`)
                } else {
                  // Retry checking
                  checkChartData(attempts - 1, delay)
                }
              }, delay)
            }
            
            // Start checking after a longer delay to ensure chart has processed data
            setTimeout(() => checkChartData(), 500)
          } else {
            // For empty state configs, this is expected
            DIAGNOSTICS.log(`Chart ${chartNum} initialized with empty state (expected for this config: ${description || 'unknown'})`)
          }
        } catch (err) {
          DIAGNOSTICS.error(`Failed to refresh chart ${chartNum}`, err)
        }
      }, refreshDelay)
    } catch (err) {
      DIAGNOSTICS.error(`Failed to start chart ${chartNum}`, err)
      return
    }
    
    // Register chart in global scope for access
    window["chart" + (chartNum - 1)] = chart
    
    // Log chart info for debugging
    if (description) {
      DIAGNOSTICS.log(`Chart ${chartNum} created: ${description}`)
    }

    // Initialize stream if configured
    if (typeof stream === "function") {
      try {
        stream(chart)
      } catch (err) {
        DIAGNOSTICS.error(`Failed to initialize stream for chart ${chartNum}`, err)
      }
    }
    
    const totalTime = ((performance.now() - chartStartTime) / 1000).toFixed(3)
    DIAGNOSTICS.checkpoint(`Chart ${chartNum} created successfully in ${totalTime}s`)
    
    // Memory check every 3 charts
    if (chartNum % 3 === 0) {
      DIAGNOSTICS.memoryCheck()
    }
  } catch (err) {
    DIAGNOSTICS.error(`Critical error creating chart ${chartNum}`, err)
  }
}

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

class Stream {

  chart
  tick = {t: null, p: null, q: null}
  candle = []
  time
  tf
  tfms

  constructor(chart, interval, tickerCb, klineCb) {

    this.chart = chart
    this.interval = interval
    this.time = (chart.stream.lastTick) ? chart.stream.lastTick.t : chart.range.value()[0]
    this.tf = chart.config.timeFrame
    this.tfms = chart.time.timeFrameMS // TIMEUNITSVALUESSHORT[tf]
    this.candle = chart.range.value()
    this.tickerCb = (typeof tickerCb === "function") ? tickerCb : false
    this.klineCb = (typeof klineCb === "function") ? klineCb : false

    let r = this.chart.range
    this.max = r.valueDiff / (this.tfms / this.interval) || 1

    setInterval(this.ticker.bind(this), interval)
  }

  get volumeInc() {
    let r = this.chart.range
    let max = r.volumeDiff || 1
    return getRandomInt(0, max) / (this.tfms / this.interval)
  }

  get priceInc() {
    let factor2 = getRandomInt(0, 10) % 2
    let sign = (Math.floor(factor2) === 1) ? 1 : -1

    return getRandomInt(0, this.max) * sign
  }

  ticker() {

    this.tick.t = this.tick.t || this.candle[0] || Date.now()
    this.tick.p = this.tick.p || this.candle[4] || 1
    this.tick.q = this.tick.q || this.candle[5] || 1

    let price = this.tick.p + this.priceInc
        price = (price < 0) ? Math.abs(this.priceInc) : price
    let time = this.tick.t + this.interval
    this.tick = {t: time, p: price, q: this.volumeInc}

    if (this.tickerCb) this.tickerCb(this.tick)
    if (this.klineCb) this.kline()
  }

  kline() {
    let t = this.candle[0]
    let c = [...this.candle]
    let p = this.tick.p

    if (this.tick.t - t >= this.tfms ) {
      t = this.tick.t - (this.tick.t % this.tfms)
      c = [t, p, p, p, p, this.volumeInc]
      c 
    }
    else {
      c[2] = (c[2] < p ) ? p : c[2]
      c[3] = (c[3] > p ) ? p : c[3]
      c[4] = p
      c[5] += this.tick.q
    }
    this.candle = c
    this.klineCb({t: t, o: c[1], h: c[2], l: c[3], c: c[4], v: c[5]})
  }
}


function once (chart) {
  const tick = {
    t: Date.now(), // timestamp of current candle in milliseconds
    o: 28000,  // open price
    h: 28100,  // high price
    l: 28060,
    c: 28080,  // close price
    v: 3 // volume
  }
  chart.stream.onTick(tick)  
  tick.t = Date.now()
  tick.c = 28083
  chart.stream.onTick(tick)  
}

function h($,p,c) {console.log(`alert`,$,p[4],c[4])} 

function alertTest ($, p, c) {
  if ($ > p[4] && $ < c[4]) return true
  else return false
}

/**
 * Initialize Demo Charts
 * 
 * Create initial charts to showcase TradeX-chart capabilities.
 * Each chart demonstrates different features:
 * 
 * Chart 0: Basic chart with standard configuration
 * Chart 1: Chart with trade markers and advanced features
 */

DIAGNOSTICS.checkpoint('Starting chart initialization')
DIAGNOSTICS.memoryCheck()

// Initialize charts with error handling
try {
  addChart() // Chart 0 - First chart (used for fullscreen)
  
  // Wait a bit before adding more charts to avoid overwhelming the browser
  const addMoreCharts = () => {
    try {
      addChart() // Chart 1 - Second chart
      
      // Batch add remaining charts with delays to prevent performance issues
      setTimeout(() => {
        try {
          addChart() // Chart 2
          addChart() // Chart 3
          addChart() // Chart 4
          DIAGNOSTICS.checkpoint('First batch of charts created')
          DIAGNOSTICS.memoryCheck()
        } catch (err) {
          DIAGNOSTICS.error('Error creating charts 2-4', err)
        }
        
        setTimeout(() => {
          try {
            addChart() // Chart 5
            addChart() // Chart 6
            addChart() // Chart 7
            DIAGNOSTICS.checkpoint('Second batch of charts created')
            DIAGNOSTICS.memoryCheck()
          } catch (err) {
            DIAGNOSTICS.error('Error creating charts 5-7', err)
          }
          
          setTimeout(() => {
            try {
              addChart() // Chart 8
              addChart() // Chart 9
              DIAGNOSTICS.checkpoint('All charts created')
              DIAGNOSTICS.memoryCheck()
              
              // Wait for charts to fully initialize before proceeding
              setTimeout(() => {
                DIAGNOSTICS.checkpoint('Chart initialization phase complete')
                DIAGNOSTICS.memoryCheck()
              }, 500)
            } catch (err) {
              DIAGNOSTICS.error('Error creating charts 8-9', err)
            }
          }, 300)
        }, 300)
      }, 300)
    } catch (err) {
      DIAGNOSTICS.error('Error in addMoreCharts', err)
    }
  }
  
  // Wait for first chart to initialize before adding more
  setTimeout(addMoreCharts, 100)
  
} catch (err) {
  DIAGNOSTICS.error('Critical error during chart initialization', err)
}

/**
 * Fullscreen Functionality
 * 
 * Enables fullscreen mode for the first chart (chart0).
 * Uses the native Fullscreen API with error handling.
 */
document.getElementById("fullscreen")?.addEventListener("click", (e) => {
  const chart0 = window.chart0
  if (chart0 && typeof chart0.requestFullscreen === 'function') {
    chart0.requestFullscreen().catch(err => {
      console.error("Error attempting to enable fullscreen:", err)
    })
  } else {
    console.warn("Chart0 is not available or fullscreen API is not supported")
  }
})

/**
 * Custom Indicators Registration
 * 
 * Register custom indicators that can be added to charts.
 * These indicators extend the built-in indicator library.
 * 
 * Available Custom Indicators:
 * - TEST: Custom test indicator
 * - DBLMA: Double Moving Average indicator
 * - TRDFLO: Trade Flow indicator
 */

/**
 * Check if chart data is ready
 */
function isChartDataReady(chart) {
  if (!chart) return false
  if (!chart.state) return false
  if (!chart.state.ohlcv || !Array.isArray(chart.state.ohlcv)) return false
  if (chart.state.ohlcv.length === 0) return false
  return true
}

/**
 * Wait for chart to be fully ready with data loaded
 */
function waitForChartReady(chart, callback, maxAttempts = 50, attempt = 0) {
  if (attempt >= maxAttempts) {
    DIAGNOSTICS.error(`Chart ready check timeout after ${maxAttempts} attempts`)
    return false
  }

  if (isChartDataReady(chart)) {
    callback()
    return true
  }

  setTimeout(() => {
    waitForChartReady(chart, callback, maxAttempts, attempt + 1)
  }, 100)
  
  return false
}

// Wait for chart0 to be fully initialized before adding indicators
const setupChart0Features = () => {
  if (!window.chart0) {
    DIAGNOSTICS.warn('chart0 not available yet, retrying in 200ms...')
    setTimeout(setupChart0Features, 200)
    return
  }
  
  const chart0 = window.chart0
  
  // Wait for chart data to be ready before adding indicators
  waitForChartReady(chart0, () => {
    try {
      DIAGNOSTICS.checkpoint('Chart0 data is ready, setting up indicators')
      
      // Check if talib is available
      if (!talib) {
        DIAGNOSTICS.warn('TALIB library not available, some indicators may not work')
      }
      
      if (typeof chart0.setIndicators !== 'function') {
        DIAGNOSTICS.error('chart0.setIndicators is not a function')
        return
      }
      
      // Register custom indicators first
      chart0.setIndicators({
        TEST: {id: "TEST", name: "Custom Indicator", event: "addIndicator", ind: TEST},
        DBLMA: {id: "DBLMA", name: "Double Moving Average", event: "addIndicator", ind: DblMA },
        TRDFLO: {id: "TRDFLO", name: "Trade Flow", event: "addIndicator", ind: TradeFlow },
      })
      DIAGNOSTICS.checkpoint('Custom indicators registered')

      // Adaptive height: observe secondary pane changes and adjust container height
      const setupAdaptiveHeight = (chart) => {
        const computeSecondaryCount = () => {
          try {
            // Priority: internal panes API
            if (chart?.panes?.secondary && Array.isArray(chart.panes.secondary)) {
              return chart.panes.secondary.length
            }
            // Shadow DOM legends or panes
            if (chart?.shadowRoot) {
              const legends = chart.shadowRoot.querySelectorAll('.legend.secondary').length
              const dataType = chart.shadowRoot.querySelectorAll('[data-type="secondary"]').length
              const panes = chart.shadowRoot.querySelectorAll('[data-pane="secondary"]').length
              return Math.max(legends, dataType, panes)
            }
            // Fallback to state
            if (chart?.state?.secondary && Array.isArray(chart.state.secondary)) {
              return chart.state.secondary.length
            }
          } catch (_) { /* ignore */ }
          return 0
        }

        const recalc = () => {
          const sec = computeSecondaryCount()
          const baseHeight = 360
          const perSecondary = 180
          const target = baseHeight + Math.max(0, sec) * perSecondary
          const sectionEl = chart.closest('section') || chart.parentElement
          if (sectionEl) sectionEl.style.minHeight = `${target}px`
          chart.style.height = '100%'
          if (typeof chart.refresh === 'function') {
            // light refresh
            setTimeout(() => chart.refresh(), 50)
          }
          DIAGNOSTICS.log(`Adaptive height applied. secondary=${sec}, height=${target}px`)
        }

        // Initial compute
        recalc()

        // Observe shadow DOM for secondary changes
        try {
          if (chart?.shadowRoot) {
            let rafPending = false
            const observer = new MutationObserver(() => {
              if (rafPending) return
              rafPending = true
              requestAnimationFrame(() => {
                rafPending = false
                recalc()
              })
            })
            observer.observe(chart.shadowRoot, { childList: true, subtree: true })
            // expose for debug
            chart.__heightObserver = observer
          }
        } catch (e) {
          // ignore observer errors
        }
      }

      setupAdaptiveHeight(chart0)
      
      // Add indicators with error handling and delay between additions
      const addIndicatorSafely = (indicator, name, options, delay = 0) => {
        setTimeout(() => {
          try {
            if (!isChartDataReady(chart0)) {
              DIAGNOSTICS.warn(`Chart data not ready for indicator ${indicator}, skipping`)
              return
            }
            
            if (typeof chart0.addIndicator === 'function') {
              chart0.addIndicator(indicator, name, options)
              DIAGNOSTICS.log(`Added indicator: ${indicator}${name ? ' (' + name + ')' : ''}`)
              
              // Asynchronously adjust chart height based on secondary indicators, then refresh
              const adjustChartHeightForIndicators = (chart) => {
                try {
                  // 1) Determine secondary pane count using multiple strategies
                  let secondaryCount = 0
                  // a) internal API if available
                  if (!secondaryCount && chart?.panes?.secondary && Array.isArray(chart.panes.secondary)) {
                    secondaryCount = chart.panes.secondary.length
                  }
                  // b) shadow DOM legends
                  if (!secondaryCount && chart?.shadowRoot) {
                    secondaryCount = chart.shadowRoot.querySelectorAll('.legend.secondary').length ||
                                     chart.shadowRoot.querySelectorAll('[data-type="secondary"]').length || 0
                  }
                  // c) state fallback
                  if (!secondaryCount && chart?.state?.secondary && Array.isArray(chart.state.secondary)) {
                    secondaryCount = chart.state.secondary.length
                  }

                  const baseHeight = 360 // px
                  const perSecondary = 180 // px per secondary pane
                  const targetHeight = baseHeight + Math.max(0, secondaryCount) * perSecondary

                  // 2) Apply height to container section, keep chart 100%
                  const sectionEl = chart.closest('section') || chart.parentElement
                  if (sectionEl) {
                    sectionEl.style.height = `${targetHeight}px`
                  }
                  chart.style.height = '100%'
                } catch (e) {
                  // Non-fatal
                }
              }

              // Schedule height adjustments and lightweight refresh with retries
              const scheduleAdjust = (delays = [120, 300, 800]) => {
                delays.forEach((d, idx) => {
                  setTimeout(() => {
                    adjustChartHeightForIndicators(chart0)
                    if (typeof chart0.refresh === 'function' && idx === 0) chart0.refresh()
                  }, d)
                })
              }
              scheduleAdjust()
            } else {
              DIAGNOSTICS.error(`chart0.addIndicator is not a function`)
            }
          } catch (err) {
            DIAGNOSTICS.error(`Failed to add indicator ${indicator}`, err)
          }
        }, delay)
      }
      
      // Add indicators with delays to avoid race conditions
      // Simple indicators first
      addIndicatorSafely("VOL", undefined, undefined, 100)
      addIndicatorSafely("MA", undefined, undefined, 200)
      
      // Custom indicators with more delay
      addIndicatorSafely("TEST", "Test1", {data: [], settings: {test: true}}, 400)
      addIndicatorSafely("TRDFLO", "TradeFlow1", {data: [], settings: {test: true}}, 600)
      addIndicatorSafely("DBLMA", "DblMA", {data: [], settings: {}}, 800)
      addIndicatorSafely("DMI", "DMI1", {data: []}, 1000)
      
      DIAGNOSTICS.checkpoint('All indicators queued for addition')
      
      // Add event listeners with error handling
      try {
        if (typeof chart0.on === 'function') {
          chart0.on("range_limitPast", (e) => {
            try {
              onRangeLimit(e, "past")
            } catch (err) {
              DIAGNOSTICS.error('Error in range_limitPast handler', err)
            }
          })
          chart0.on("range_limitFuture", (e) => {
            try {
              onRangeLimit(e, "future")
            } catch (err) {
              DIAGNOSTICS.error('Error in range_limitFuture handler', err)
            }
          })
          DIAGNOSTICS.checkpoint('Range limit event listeners added')
        } else {
          DIAGNOSTICS.error('chart0.on is not a function')
        }
      } catch (err) {
        DIAGNOSTICS.error('Failed to add range limit event listeners', err)
      }
      
      // Note: Real-time data source setup is now optional and controlled by user
      // It will be initialized when user clicks the "Toggle Real-time" button
      DIAGNOSTICS.log('Real-time data source setup skipped (user-controlled)')
      
      DIAGNOSTICS.checkpoint('Chart0 features setup complete')
      DIAGNOSTICS.memoryCheck()
      
    } catch (err) {
      DIAGNOSTICS.error('Critical error setting up chart0 features', err)
    }
  })
}

// Wait longer for chart0 to be ready (allow time for data loading)
setTimeout(setupChart0Features, 1000)

/**
 * Data Source Configuration
 * 
 * Configure data source for chart0 to enable real-time data updates.
 * This sets up Binance WebSocket integration for live price updates.
 * 
 * Features:
 * - Real-time price streaming
 * - Automatic historical data fetching when scrolling
 * - WebSocket connection management
 * 
 * Note: This feature requires network access and may fail due to CORS restrictions
 * in some browsers. The error handling below will gracefully handle failures.
 */

// Real-time data state management
// Default: Real-time data is disabled, user must enable it via UI
let realtimeDataEnabled = false
let realtimeDataTicker = null // Store ticker reference for stopping

/**
 * Enable Real-time Data
 * 
 * Starts Binance WebSocket connection for real-time price updates
 */
function enableRealTimeData() {
  if (!window.chart0) {
    DIAGNOSTICS.warn('chart0 not available for real-time data setup')
    return false
  }

  if (realtimeDataEnabled) {
    DIAGNOSTICS.log('Real-time data is already enabled')
    return true
  }

  const chart0 = window.chart0

  try {
    DIAGNOSTICS.checkpoint('Enabling real-time data source')

    // Configure range limit callbacks for data fetching with error handling
    if (state1.dataSource && state1.dataSource.source) {
      state1.dataSource.source.rangeLimitFuture = (e, sym, tf, ts) => { 
        return onRangeLimit2(e, sym, tf, ts, "future").catch(err => {
          console.warn("Failed to fetch future data from Binance:", err.message)
          return { ohlcv: [] }
        })
      }
    }

    // Start ticker with historical data support
    if (chart0.state && chart0.state.dataSource) {
      realtimeDataTicker = chart0.state.dataSource.startTickerHistory({
        rangeLimitPast: (e, sym, tf, ts) => { 
          return onRangeLimit2(e, sym, tf, ts, "past").catch(err => {
            console.warn("Failed to fetch historical data from Binance:", err.message)
            return { ohlcv: [] }
          })
        },
        start: (symbol, tf, onTick) => { 
          try {
            livePrice_Binance(chart0, symbol, tf, onTick)
            DIAGNOSTICS.log(`Binance WebSocket started for ${symbol}`)
          } catch (err) {
            DIAGNOSTICS.error("Failed to start WebSocket connection", err)
            console.warn("Failed to start WebSocket connection:", err.message)
          }
        },
        stop: () => {
          DIAGNOSTICS.log('Binance WebSocket stopped')
          console.log('Binance WebSocket stopped')
        },
        symbol: "btcusdt",
        tf: 60000 // 1 minute timeframe
      })

      // Listen for range limit events
      chart0.on("range_limitFuture", () => {
        console.log("Chart reached future range limit - fetching more data...")
      })

      realtimeDataEnabled = true
      DIAGNOSTICS.checkpoint("Real-time data source enabled for chart0")
      console.log("✅ Real-time data enabled for chart0")
      return true
    } else {
      DIAGNOSTICS.error("chart0.state.dataSource is not available")
      return false
    }
  } catch (err) {
    DIAGNOSTICS.error("Failed to enable real-time data source", err)
    console.error("Failed to enable real-time data source:", err)
    return false
  }
}

/**
 * Disable Real-time Data
 * 
 * Stops Binance WebSocket connection
 */
function disableRealTimeData() {
  if (!realtimeDataEnabled) {
    DIAGNOSTICS.log('Real-time data is already disabled')
    return
  }

  try {
    DIAGNOSTICS.checkpoint('Disabling real-time data source')

    if (window.chart0 && window.chart0.state && window.chart0.state.dataSource) {
      // Stop the ticker if it exists
      if (realtimeDataTicker) {
        try {
          window.chart0.state.dataSource.stopTicker()
          realtimeDataTicker = null
        } catch (err) {
          DIAGNOSTICS.error('Error stopping ticker', err)
        }
      }
    }

    realtimeDataEnabled = false
    DIAGNOSTICS.checkpoint("Real-time data source disabled")
    console.log("⏸️ Real-time data disabled")
  } catch (err) {
    DIAGNOSTICS.error("Failed to disable real-time data source", err)
    console.error("Failed to disable real-time data source:", err)
  }
}

// Export functions globally for UI access
window.enableRealTimeData = enableRealTimeData
window.disableRealTimeData = disableRealTimeData
window.getRealTimeDataStatus = () => realtimeDataEnabled


/**
 * Chart Configuration Management
 * 
 * Set up state and configuration management for chart0.
 * This enables:
 * - Loading different chart states
 * - Switching between configurations
 * - Adding indicators via dropdown
 */

// Setup chart configuration management with error handling
const setupChartManagement = () => {
  if (!window.chart0) {
    DIAGNOSTICS.warn('chart0 not available for management setup, retrying...')
    setTimeout(setupChartManagement, 500)
    return
  }

  try {
    DIAGNOSTICS.checkpoint('Setting up chart configuration management')
    
    const chart0 = window.chart0
    const states = { state1, state2, state3 }
    const cfgs = { config1, config2, config3, config4, config5, config6, config7, config8, dre }

    // Load state management UI
    try {
      if (typeof loadStates === 'function') {
        loadStates(chart0, states, cfgs)
        DIAGNOSTICS.checkpoint('State management UI loaded')
      } else {
        DIAGNOSTICS.error('loadStates is not a function')
      }
    } catch (err) {
      DIAGNOSTICS.error('Failed to load states', err)
    }
    
    // Add state dropdown menu
    try {
      if (typeof statesDropDown === 'function') {
        statesDropDown(chart0, states)
        DIAGNOSTICS.checkpoint('State dropdown menu added')
      } else {
        DIAGNOSTICS.error('statesDropDown is not a function')
      }
    } catch (err) {
      DIAGNOSTICS.error('Failed to add state dropdown', err)
    }
    
    // Add indicator dropdown menu
    try {
      if (typeof addIndicatorDropdown === 'function') {
        addIndicatorDropdown(chart0)
        DIAGNOSTICS.checkpoint('Indicator dropdown menu added')
      } else {
        DIAGNOSTICS.error('addIndicatorDropdown is not a function')
      }
    } catch (err) {
      DIAGNOSTICS.error('Failed to add indicator dropdown', err)
    }
    
    // Optional: Load timeframe selector
    // loadTimeFrame(chart0)

    /**
     * Control Panel Event Handlers
     * 
     * Handles user interactions with the control panel UI.
     * These handlers allow users to dynamically change chart states and configurations.
     */
    
    // Initialize control panel after a short delay to ensure chart0 is ready
    setTimeout(() => {
      try {
        initializeControlPanel(chart0, states, cfgs)
        DIAGNOSTICS.checkpoint('Control panel initialized')
      } catch (err) {
        DIAGNOSTICS.error('Failed to initialize control panel', err)
      }
    }, 500)
    
    DIAGNOSTICS.checkpoint('Chart management setup complete')
  } catch (err) {
    DIAGNOSTICS.error('Critical error in chart management setup', err)
  }
}

// Wait for chart0 to be ready
setTimeout(setupChartManagement, 1500)

/**
 * Initialize Control Panel
 * 
 * Sets up event handlers for the control panel UI elements
 */
function initializeControlPanel(chart0, states, cfgs) {
  // Status indicator helper functions
  const statusIndicator = document.getElementById('status-indicator')
  const statusDot = statusIndicator?.querySelector('.status-dot')
  const statusText = statusIndicator?.querySelector('.status-text')
  
  const updateStatus = (state, message) => {
    if (!statusIndicator || !statusDot || !statusText) return
    
    // Remove all status classes
    statusDot.classList.remove('status-idle', 'status-loading', 'status-success', 'status-error', 'status-active')
    
    // Add new status class and update text
    statusDot.classList.add(`status-${state}`)
    statusText.textContent = message || 'Ready'
  }

  // State selector
  const stateSelect = document.getElementById('state-select')
  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      const selectedState = e.target.value
      console.log(`State selector changed to: ${selectedState}`)
      updateStatus('idle', `Selected: ${selectedState}`)
    })
  }

  // Config selector
  const configSelect = document.getElementById('config-select')
  if (configSelect) {
    configSelect.addEventListener('change', (e) => {
      const selectedConfig = e.target.value
      console.log(`Config selector changed to: ${selectedConfig}`)
      updateStatus('idle', `Selected: ${selectedConfig}`)
    })
  }

  // Apply config button
  const applyButton = document.getElementById('apply-config')
  const buttonIcon = applyButton?.querySelector('.button-icon')
  const buttonText = applyButton?.querySelector('.button-text')
  
  if (applyButton && chart0) {
    applyButton.addEventListener('click', async () => {
      const selectedState = stateSelect?.value || 'state1'
      const selectedConfig = configSelect?.value || 'config1'
      
      // Update status to loading
      updateStatus('loading', 'Applying...')
      applyButton.disabled = true
      
      if (buttonIcon) buttonIcon.textContent = '⏳'
      if (buttonText) buttonText.textContent = 'Applying...'
      
      try {
        // Get the selected state and config
        const state = states[selectedState]
        const config = cfgs[selectedConfig]
        
        if (state && config) {
          // Create new config with selected state
          const newConfig = {
            ...config,
            state: state,
            talib: talib,
            wasm: wasm
          }
          
          console.log(`Applying ${selectedConfig} with ${selectedState} to chart0`)
          
          // Update chart with new configuration
          chart0.start(newConfig)
          chart0.refresh()
          
          // Show success feedback
          updateStatus('success', 'Applied successfully')
          if (buttonIcon) buttonIcon.textContent = '✅'
          if (buttonText) buttonText.textContent = 'Applied!'
          
          setTimeout(() => {
            updateStatus('idle', 'Ready')
            if (buttonIcon) buttonIcon.textContent = '✅'
            if (buttonText) buttonText.textContent = 'Apply'
            applyButton.disabled = false
          }, 2000)
        } else {
          console.warn(`State or config not found: ${selectedState}, ${selectedConfig}`)
          updateStatus('error', 'Config not found')
          if (buttonIcon) buttonIcon.textContent = '⚠️'
          if (buttonText) buttonText.textContent = 'Not Found'
          
          setTimeout(() => {
            updateStatus('idle', 'Ready')
            if (buttonIcon) buttonIcon.textContent = '✅'
            if (buttonText) buttonText.textContent = 'Apply'
            applyButton.disabled = false
          }, 2000)
        }
      } catch (err) {
        console.error('Error applying config:', err)
        DIAGNOSTICS.error('Failed to apply config', err)
        updateStatus('error', 'Error occurred')
        if (buttonIcon) buttonIcon.textContent = '❌'
        if (buttonText) buttonText.textContent = 'Error'
        
        setTimeout(() => {
          updateStatus('idle', 'Ready')
          if (buttonIcon) buttonIcon.textContent = '✅'
          if (buttonText) buttonText.textContent = 'Apply'
          applyButton.disabled = false
        }, 2000)
      }
    })
  }

  // Toggle real-time data button
  const toggleRealtimeButton = document.getElementById('toggle-realtime')
  const toggleIcon = toggleRealtimeButton?.querySelector('.button-icon')
  const toggleText = toggleRealtimeButton?.querySelector('.button-text')
  
  if (toggleRealtimeButton) {
    // Update button text and status based on current state
    const updateButtonText = () => {
      const isEnabled = window.getRealTimeDataStatus()
      
      if (toggleIcon) {
        toggleIcon.textContent = isEnabled ? '🔄' : '⏸️'
      }
      if (toggleText) {
        toggleText.textContent = isEnabled ? 'Real-time ON' : 'Real-time OFF'
      }
      
      toggleRealtimeButton.style.background = isEnabled
        ? 'rgba(41, 98, 255, 0.15)'
        : 'rgba(255, 255, 255, 0.05)'
      
      updateStatus(isEnabled ? 'active' : 'idle', isEnabled ? 'Real-time Active' : 'Ready')
    }
    
    // Initialize button state (default: OFF)
    updateButtonText()
    
    toggleRealtimeButton.addEventListener('click', () => {
      const isCurrentlyEnabled = window.getRealTimeDataStatus()
      
      updateStatus('loading', isCurrentlyEnabled ? 'Stopping...' : 'Starting...')
      
      if (isCurrentlyEnabled) {
        // Disable real-time data
        window.disableRealTimeData()
        updateStatus('idle', 'Real-time Stopped')
      } else {
        // Enable real-time data
        const success = window.enableRealTimeData()
        if (!success) {
          updateStatus('error', 'Failed to start')
          alert('Failed to enable real-time data. Please check console for details.')
          setTimeout(() => updateStatus('idle', 'Ready'), 2000)
          return
        }
        updateStatus('active', 'Real-time Active')
      }
      
      // Update button state
      updateButtonText()
      
      console.log(`Real-time data ${window.getRealTimeDataStatus() ? 'enabled' : 'disabled'}`)
    })
  }
  
  // Initialize status
  updateStatus('idle', 'Ready')
}

// Global error handler
window.addEventListener('error', (event) => {
  DIAGNOSTICS.error(`Global error: ${event.message}`, {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  })
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  DIAGNOSTICS.error(`Unhandled promise rejection: ${event.reason}`, event.reason)
})

// Output diagnostics summary when page is fully loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    DIAGNOSTICS.checkpoint('Page fully loaded')
    DIAGNOSTICS.memoryCheck()
    DIAGNOSTICS.summary()
    
    // Log chart status
    console.group('📊 Charts Status')
    for (let i = 0; i < 10; i++) {
      const chart = window[`chart${i}`]
      if (chart) {
        console.log(`Chart ${i}: ✅ Available`, chart)
      } else {
        console.log(`Chart ${i}: ❌ Not available`)
      }
    }
    console.groupEnd()
  }, 2000)
})
