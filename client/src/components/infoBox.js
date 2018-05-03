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
                    <div>Random Forest</div>
                    <div>{results.momentum}</div>
                    <div>Predicted: {results.rf}</div>
                </div>
                <div className='infoBox'>
                    <div>XGBoost</div>
                    <div>Predicted: {results.xg}</div>
                </div>
                <div className='infoBox'>
                    <div>LSTM</div>
                    <div>Predicted: {results.rnn}</div>
                    <div>Current MAE: {results.rnnmae}</div>
                </div>
            </div>
        );
    }
}

export default InfoBox;