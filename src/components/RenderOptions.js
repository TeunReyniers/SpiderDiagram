import React, { Component } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Slider } from 'office-ui-fabric-react/lib/Slider'
import { Label } from 'office-ui-fabric-react/lib/Label'

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
                            <TextField label='Width'
                                value={this.props.items.width}
                                onGetErrorMessage={this._getErrorMessage}
                                onChange={(s, e) => this.props.onChange({
                                    width: e,
                                    viewScale: this.props.items.viewScale
                                })} />
                        </div>
                    </div>
                    <div className='flexColumns'
                        style={{ flexGrow: 'stretch', marginTop: '10px' }}>
                        <div style={{width: 'calc(100% - 40px)'}}>
                            <Slider label="Scale"
                                max={100}
                                value={this.props.items.viewScale}
                                showValue={false}
                                onChange={(e) => this.props.onChange({
                                    width: this.props.items.width,
                                    viewScale: e
                                })}
                            />
                        </div>
                        <div style={{marginTop: '18px', marginLeft: '5px'}}>
                            <Label>{this.props.items.viewScale === 0
                                ? 'Auto'
                                : this.props.items.viewScale + '%'}</Label>
                        </div>
                    </div>
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