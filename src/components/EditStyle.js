import React, { Component } from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { PrimaryButton, Button } from 'office-ui-fabric-react/lib/Button';

import { JsonEditor as Editor } from 'jsoneditor-react';
import { RenderCanvas } from '../logic/RenderSpinDiagramCanvas.js';
import 'jsoneditor-react/es/editor.min.css';
import ReactResizeDetector from 'react-resize-detector';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';


export class EditStyle extends Component {
    constructor() {
        super()

        this.state = {
            calloutVisible: false,
            key: -1,
            name: '',
            style: {
                ratio: 1.2,
                fillmode: 'piece',
                title: {
                    font: {
                        type: 'Arial',
                        size: 7,
                        style: 'bold',
                    },
                    color: 'black',
                    position: {
                        X: 100,
                        Y: 14
                    },
                    rotation: 0,
                    alignment: 'center'
                },
                student: {
                    font: {
                        type: 'Arial',
                        size: 5,
                        style: '',
                    },
                    color: 'black',
                    position: {
                        X: 100,
                        Y: 20
                    },
                    rotation: 0,
                    alignment: 'center'
                },
                diagram: {
                    position: {
                        X: 100,
                        Y: 120,
                    },
                    radius: 80,
                    lines: {
                        sector: {
                            color: '#1f4e5f',
                            width: 2,
                            length: 10.5
                        },
                        part: {
                            color: '#aacfd0',
                            width: 1,
                            length: 10
                        },
                        circles: {
                            color: '#aacfd0',
                            width: 1,
                        }
                    },
                    text: {
                        sector: {
                            font: {
                                type: 'Arial',
                                size: 7,
                                style: 'bold',
                            },
                            color: 'black',
                            radius: 11,
                            rotation: 0,
                            smartRotate: false,
                            smartRotateDirection: 'horizontal', // or horizontal
                            smartRotateInvert: false,
                            bow: true,
                        },
                        part: {
                            font: {
                                type: 'Arial',
                                size: 4.5,
                                style: '',
                            },
                            color: 'black',
                            radius: 9.4,
                            rotation: 0,
                            smartRotate: false,
                            smartRotateDirection: 'horizontal', // or horizontal
                            smartRotateInvert: false,
                            bow: true,
                        },
                        circles: {
                            font: {
                                type: 'Arial',
                                size: 3,
                                style: 'bold',

                            },
                            color: 'black',
                            offset: {
                                X: -3, Y: -3
                            },
                            rotation: -90,
                            alignment: 'left'
                        }
                    }
                }
            },

        }

        this._getErrorMessage = this._getErrorMessage.bind(this);
        this._jsonChanged = this._jsonChanged.bind(this);
        this._renderCanvas = this._renderCanvas.bind(this);

    }

    componentDidMount() {

        
        console.log('Componend mounted')
        console.log(this.props)
        if (!this.props.new) {
            console.log('set new props');


            if (this.props.style.style !== undefined) {
                this.setState({
                    style: this.props.style.style,
                    name: this.props.style.name,
                    key: this.props.style.key
                })
                console.log('mine');

            }
        }
    }


    render() {
        return <div> {this.state &&
            <div className='flexColumns' style={{ margin: '0px', position: 'relative' }}>

                <div style={{ width: '40%', height: 'calc(100vh - 180px)' }}>
                    <TextField placeholder="A name to reconize the style"
                        onGetErrorMessage={this._getErrorMessage}
                        label="Name"
                        value={this.state.name}
                        onChange={(e, v) => this.setState({ name: v })}
                      ></TextField>
                    <div style={{ height: 'calc(100% - 100px)' }}>
                        <Editor value={this.state.style}
                            mode='form'
                            allowedModes={['code', 'form']}
                            htmlElementProps={{ style: { height: '100%' } }}
                            onChange={this._jsonChanged} />
                    </div>
                    <div>
                        <PrimaryButton onClick={() => {
                            if (this._getErrorMessage(this.state.name) == "") {
                                this.props.onSave(this.state.key, this.state.name, this.state.style)
                            }
                            console.log(this.state.name);

                        }}>Save</PrimaryButton>
                        <Button onClick={() => { this.props.onCancel() }}>Cancel</Button>
                    </div>
                </div>
                <div id="StyleCanvasWrapper" style={{ width: '60%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                    <canvas id='StyleCanvas' style={{ background: 'white', alignSelf: 'center', border: '1px solid #333' }}></canvas>
                </div>

                <ReactResizeDetector handleWidth handleHeight onResize={this._renderCanvas} />

            </div>}
        </div>
    }

    _getErrorMessage(value) {
        if (value === 'wiskunde') {
            return 'This name already exists'
        }
        if (value.length === 0) {
            return 'This field is required'
        }
        if (value.length <= 3) {
            return 'The length must be greater than 3'
        }
        return ''
    }

    _jsonChanged(value) {
        this.setState({ style: value })
        this._renderCanvas()
    }

    _renderCanvas() {
        const layout = {
            title: "Wiskunde - getallenleer",
            sectors: [
                {
                    name: "Gehelegetallen",
                    parts: [
                        { name: "optellen" },
                        { name: "aftrekken" },
                        { name: "delen" },
                        { name: "vermenigvuldigen" }
                    ]
                },
                {
                    name: "Breuken", parts: [
                        { name: "optellen" },
                        { name: "aftrekken" },
                        { name: "delen" },
                        { name: "vermenigvuldigen" }
                    ]
                },
                {
                    name: "Complex", parts: [
                        { name: "optellen" },
                        { name: "aftrekken" },
                        { name: "vermenigvuldigen" },
                    ]
                }
            ],
            grades: [
                { name: "Onvoldoende", width: 3, color: '#3b8686' },
                { name: "Voldoende", width: 6, color: '#79bd9a' },
                { name: "Goed", width: 9, color: '#a8dba8' },
                { name: "Stoppen met werken", width: 10, color: '#cff09e' },
            ]
        };

        const wrapper = document.getElementById('StyleCanvasWrapper')
        RenderCanvas.drawCanvas({ format: this.state.style, layout: layout }, 'StyleCanvas', { name: "Teun Reyniers", scores: [0, 1, 3, 2, 2, 2, 1, 0, 2, 0, 3] }, Math.min(wrapper.offsetWidth * 0.9, wrapper.offsetHeight * 0.9 / this.state.style.ratio));
    }

}