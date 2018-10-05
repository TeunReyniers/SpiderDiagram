import React, { Component } from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { PrimaryButton, Button } from 'office-ui-fabric-react/lib/Button';

import { JsonEditor as Editor } from 'jsoneditor-react';
import {RenderCanvas}  from '../logic/RenderSpinDiagramCanvas.js';
import 'jsoneditor-react/es/editor.min.css';


export class EditStyle extends Component {
    constructor() {
        super()

        this.state = {
            style: {
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
    }

    render() {
        return <div className='flexColumns' style={{ margin: '0px', position: 'relative' }}>
            <div style={{ width: '40%', height: 'calc(100vh - 180px)' }}>
                <TextField placeholder="A name to reconize the style"
                    onGetErrorMessage={this._getErrorMessage}
                    label="Name"
                    required={true}></TextField>
                <div style={{ height: 'calc(100% - 100px)' }}>
                    <Editor value={this.state.style}
                        mode='form'
                        allowedModes={['code', 'form']}
                        htmlElementProps={{ style: { height: '100%' } }} 
                        onChange={this._jsonChanged}/>
                </div>
                <div>
                    <PrimaryButton>Save</PrimaryButton>
                    <Button>Cancel</Button>
                </div>
            </div>
            <div style={{ height: '100', width: '60%' }}>
                <canvas id='StyleCanvas'></canvas>
            </div>

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

    _jsonChanged(value){
        this.setState({style: value})

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
        }
        RenderCanvas.drawCanvas.bind(this)({format: this.style.format, layout: layout}, 'StyleCanvas', { name: "Teun Reyniers", scores: [0, 1, 3, 2, 2, 2, 1, 0, 2, 0, 3] });
    }
}