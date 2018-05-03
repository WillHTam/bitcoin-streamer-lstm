import React, { Component } from 'react';
import { withTooltipPropTypes } from '@vx/tooltip/build/enhancers/withTooltip';

class InfoBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { results, showTooltip, hideTooltip } = this.props

        return (
            <div className='info'>
                <div className='infoBox'>
                    <div className="midText">Predictions are for the Next Day</div>
                    <div className="spacer" />
                    <div className="smallText">Last Updated: {results.last}</div>
                    <div className="smallText">Current Momentum / RoC: {results.momentum}</div>
                    <div className="smallText">🔵 If momentum > 105 these predictions should be taken with a larger grain of salt.</div>
                    <div className="smallText">🔵 Avg. momentum is 96</div>
                    <div className="smallText">🔵 Feature Columns include: </div>
                    <div className="smallText">'Volume', 'Close Off High', 'Volatility', 'EMA', 'Momentum'</div>
                </div>
                <div className='infoBox'>
                    <div className="bigText">Random Forest</div>
                    <div className="smallText">🔵 max_features=5</div>
                    <div className="spacer" />
                    <div className="midText">Predicted: {results.rf}</div>
                </div>
                <div className='infoBox'>
                    <div className="bigText">XGBoost (Untuned)</div>
                    <div className="spacer" />
                    <div className="midText">Predicted: {results.xg}</div>
                </div>
                <div className='infoBox'>
                    <div className="bigText">RNN</div>
                    <div className="spacer" />
                    <div className="smallText">🔵 Created with Keras & TensorFlow</div>
                    <div className="smallText">🔵 20 Neuron LSTM Layer with 0.2 Dropout</div>
                    <div className="smallText">🔵 ReLu Activation, Adam Optimizer</div>
                    <div className="spacer" />
                    <div className="midText">Predicted: {results.rnn}</div>
                    <div className="midText">Current MAE: {results.rnnmae}</div>
                </div>
            </div>
        );
    }
}

export default InfoBox;