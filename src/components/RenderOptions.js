
import React, { Component } from 'react';

import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { PrimaryButton, Button } from 'office-ui-fabric-react';

export class RenderOptions extends Component {
    constructor() {
        super()

        this._getErrorMessage = this._getErrorMessage.bind(this);
    }

    render() {
        return <div style={{
            background: '#eee',
            margin: '0px',
        }}>
            {this.props.items.width !== undefined &&
                <div style={{ padding: '10px' }}>
                    <div className='flexColumns'>
                        <div style={{ flex: '1' }}>
                            <TextField label='width'
                                value={this.props.items.width}
                                onGetErrorMessage={this._getErrorMessage}
                                onChange={(s, e) => this.props.onChange({
                                    width: e,
                                    viewScale: this.props.items.viewScale
                                })} />
                        </div>
                    </div>
                    <Slider
                        label="Scale"
                        max={100}
                        value={this.props.items.viewScale}
                        showValue={true}
                        onChange={(e) => this.props.onChange({
                            width: this.props.items.width,
                            viewScale: e
                        })}
                    />
                </div>
            }
        </div >

    }

    _getErrorMessage(value) {
        if (isNaN(value)) {
            return 'This value must be an integer'
        }
        if (!Number.isInteger(parseFloat(value))) {
            return 'This value must be an integer'
        }
        if (value < 100 || value > 10000) {
            return 'Value is limited between 100 and 10000'
        }
        return ''
    }
}