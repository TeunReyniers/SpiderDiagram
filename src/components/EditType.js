import React, { Component } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton, Button } from 'office-ui-fabric-react/lib/Button'
import { JsonEditor as Editor } from 'jsoneditor-react'
import { RenderCanvas } from '../logic/RenderSpinDiagramCanvas.js'
import 'jsoneditor-react/es/editor.min.css'
import ReactResizeDetector from 'react-resize-detector'

export class EditType extends Component {
    constructor() {
        super()

        this._getErrorMessage = this._getErrorMessage.bind(this)
        this._jsonChanged = this._jsonChanged.bind(this)
        this._renderCanvas = this._renderCanvas.bind(this)

    }

    componentDidMount() {
        const  {grades, ...type} = this.props.type.type
        if (!this.props.new) {
            if (this.props.type.type !== undefined) {
                this.setState({
                    type: type,
                    name: this.props.type.name,
                    key: this.props.type.key
                })
            }
        } else {
            this.setState({
                type: type,
                name: this.props.type.name  + '_copy',
                key: -1
            }) 
            // this.setState({
            //     key: -1,
            //     name: '',
            //     type: {
            //         title: "Wiskunde - getallenleer",
            //         sectors: [
            //             {
            //                 name: "Gehelegetallen",
            //                 parts: [
            //                     { name: "optellen" },
            //                     { name: "aftrekken" },
            //                     { name: "delen" },
            //                     { name: "vermenigvuldigen" }
            //                 ]
            //             },
            //             {
            //                 name: "Breuken", parts: [
            //                     { name: "optellen" },
            //                     { name: "aftrekken" },
            //                     { name: "delen" },
            //                     { name: "vermenigvuldigen" }
            //                 ]
            //             },
            //             {
            //                 name: "Complex", parts: [
            //                     { name: "optellen" },
            //                     { name: "aftrekken" },
            //                     { name: "vermenigvuldigen" },
            //                 ]
            //             }
            //         ],
            //         grades: [
            //             { name: "Onvoldoende", width: 3, color: '#3b8686' },
            //             { name: "Voldoende", width: 6, color: '#79bd9a' },
            //             { name: "Goed", width: 9, color: '#a8dba8' },
            //             { name: "Stoppen met werken", width: 10, color: '#cff09e' },
            //         ]
            //     },
            // })
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
                        <Editor value={this.state.type}
                            mode='tree'
                            allowedModes={['code', 'tree']}
                            htmlElementProps={{ style: { height: '100%' } }}
                            onChange={this._jsonChanged} />
                    </div>
                    <div>
                        <PrimaryButton onClick={() => {
                            if (this._getErrorMessage(this.state.name) === "") {
                                this.props.onSave(this.state.key, this.state.name, this.state.type)
                            }
                        }}>Save</PrimaryButton>
                        <Button onClick={() => { this.props.onCancel() }}>Cancel</Button>
                    </div>
                </div>
                <div id="TypeCanvasWrapper" style={{ width: '60%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                    <canvas id='TypeCanvas' style={{ background: 'white', alignSelf: 'center', border: '1px solid #333' }}></canvas>
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
        this.setState({ type: value })
        this._renderCanvas()
    }

    _renderCanvas() {
        const style = {
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
        }

        const wrapper = document.getElementById('TypeCanvasWrapper')
        RenderCanvas.drawCanvas({ style: this.props.style.style, type: this.state.type }, 'TypeCanvas', { name: "Teun Reyniers", scores: [0, 1, 3, 2, 2, 2, 1, 0, 2, 0, 3] }, Math.min(wrapper.offsetWidth * 0.9, wrapper.offsetHeight * 0.9 / this.props.style.style.ratio))
    }

}