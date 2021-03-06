import React, { Component } from 'react'
import './App.css'
import moment from 'moment'

import GitHubForkRibbon from 'react-github-fork-ribbon'
import { LinearGradient } from '@vx/gradient'
import { withScreenSize } from '@vx/responsive'

import Chart from './components/chart'
import formatPrice from './components/formatPrice'
import InfoBox from './components/infoBox'

function Background({ width, height }) {
  return <svg width={width} height={height}>
    <LinearGradient id="fill" vertical={false}>
      <stop stopColor="#2c4e99" offset="0%" />
      <stop stopColor="#6e89d8" offset="45%" />
      <stop stopColor="#FFAF84" offset="100%" />
    </LinearGradient>
    <rect width={width} height={height} fill="url(#fill)" />
  </svg>
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      results: {}
    }
  }
  
  componentWillMount() {
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
      .then(res => res.json())
      .then(json => {
        this.setState({
          data: json
        })
      })

    fetch('http://localhost:3000/pass')
      .then(res => res.json())
      .then(json => {
        this.setState({
          results: json
        })
      })
  }
  
  render() {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const { data, results } = this.state

    if (!data.bpi) return <div className="main"><h2>Loading...!</h2></div>
    
    const prices = Object.keys(data.bpi).map(k => {
      return {
        time: k,
        price: data.bpi[k]
      }
    })

    const currentPrice = prices[prices.length - 1].price
    const lastPrice = prices[prices.length - 2].price
    const diffPrice = currentPrice - lastPrice
    const hasIncreased = diffPrice > 0

    return (
      <div className="App">
        <GitHubForkRibbon href="https://github.com/WillHTam/bitcoin-streamer-lstm"
          target="_blank"
          position="right"
          color="orange"
          >
          Fork Me on GitHub!
        </GitHubForkRibbon>

        <Background width={screenWidth} height={screenHeight} />
        <div className="main">
          <div className="chart">
            <div className="titleBar">
              <div className="title">
                <div> BTC Price <span className="thirtee">(Last 30 Days)</span></div>
              </div>
              <div className="prices">
                <div>
                  {formatPrice(currentPrice)}
                </div>
                <div className={hasIncreased ? 'increased' : 'decreased'}>
                  <small>
                    {hasIncreased ? '+' : '-'}{formatPrice(diffPrice)}
                  </small>
                </div>
              </div>
            </div>
            <div className="container">
              <Chart data={prices} />
            </div>
          </div>

          <InfoBox results = {results} />

        </div>
      </div>
    )
  }
}

export default withScreenSize(App)
