// states.js
// Consolidate demo states and derived state fragments

import state1 from './data/1hour.js'
import state2 from './data/data_btc_1m.js'
import state3 from './data/ohlcv_15m_BTC.js'

import decimals from './data/ohlcv_1d_IMPT'
import btcusdt_15min from './data/btcusdt_15min'
import tradesTestState from './data/trades-test-state.js'

// build a split state to test all merge features
const state1_5a = {primary:[], secondary:[]}
const state1_5b = {primary:[], secondary:[]}
{
  let l = state1.ohlcv.length
  state1_5a.ohlcv = state1.ohlcv.slice(0, l/2)
  state1_5b.ohlcv = state1.ohlcv.slice(l/2)

  const exclude = ["trades","events","drawings","annotations","hiLo"]
  for (let p of state1.primary) {
    if (exclude.includes(p.type)) continue
    let l = p.data.length
    let pra = { name: p.name, type: p.type, settings: p.settings }
    let prb = {...pra}
    pra.data = p.data.slice(0, l/2)
    prb.data = p.data.slice(l/2)
    state1_5a.primary.push(pra)
    state1_5b.primary.push(prb)
  }

  for (let p of state1.secondary) {
    let l = p.data.length
    let pra = { name: p.name, type: p.type, settings: p.settings }
    let prb = {...pra}
    pra.data = p.data.slice(0, l/2)
    prb.data = p.data.slice(l/2)
    state1_5a.secondary.push(pra)
    state1_5b.secondary.push(prb)
  }
}

// lightweight sample states used by some configs
let state4 = {
  "ohlcv": [
      [1663333201000,19139.4,19139.6,19179.6,19179.63478779,441.1],
      [1663333202000,19182.2,19182.2,19120.2,19133.5,445.2],
      [1663333203000,19134.2,19182.2,19120.2,19133.5,434.3]
  ],
  primary: [
    { "name": "SMA, 5", "type": "SMA", "data": [], "settings": {timePeriod: 5} }
  ],
  "secondary": [
    { "name": "RSI, 20", "type": "RSI", "data": [], "settings": {timePeriod: 20} },
  ]
}

let state5 = {
  "ohlcv": [],
  "primary": [
    { "name": "EMA, 25", "type": "EMA", "data": [], "settings": {timePeriod: 25} },
    { "name": "EMA, 43", "type": "EMA", "data": [], "settings": {timePeriod: 43} },
  ],
  "secondary": [
    { "name": "RSI, 20", "type": "RSI", "data": [], "settings": {timePeriod: 20} }
  ]
}

let state9 = {
  "ohlcv": [],
  primary: [
    { "name": "SMA, 5", "type": "SMA", "data": [], "settings": {timePeriod: 5} }
  ],
  "secondary": [
    { "name": "RSI, 20", "type": "RSI", "data": [], "settings": {timePeriod: 20} },
  ]
}

export {
  state1,
  state2,
  state3,
  state1_5a,
  state1_5b,
  state4,
  state5,
  state9,
  decimals,
  btcusdt_15min,
  tradesTestState,
}


