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
                    <h2>Hellou</h2>
                </div>
                <div className='infoBox'>
                    <h2>Placeholder</h2>
                    <p>yeah</p>
                </div>
                <div className='infoBox'>
                    <h2>Miaou</h2>
                </div>
            </div>
        );
    }
}

export default InfoBox;