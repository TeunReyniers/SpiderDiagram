import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { Options } from './components/Options'
import { Students } from './components/Students'
import { Group } from './components/Group'
import { RenderOptions } from './components/RenderOptions'
import ReactResizeDetector from 'react-resize-detector'
import { RenderCanvas } from './logic/RenderSpinDiagramCanvas.js'

const path = require('path')
const Store = require('./logic/Store.js')

initializeIcons()

const settingsStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'settings',
  defaults: {
    settings: {
      width: 1000,
      viewScale: 100,
    }
  }
})

const styleStore = new Store({
  configName: 'styleStore',
  defaults: {
    defaultStyleKey: 0,
    styles: [{
      key: 0,
      name: 'Default',
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
    },]
  }
})

const typeStore = new Store({
  configName: 'typeStore',
  defaults: {
    defaultTypeKey: 0,
    types: [
      {
        key: 0, name: 'Default', type: {
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
      },
    ],
  }
})


class App extends Component {

  constructor() {
    super()

    this.state = {
      settings: settingsStore.get('settings'),
      styles: styleStore.get('styles'),
      types: typeStore.get('types'),
      students: [
        {
          name: "Teun Reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Piet reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Kristel de boulle",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Teun Reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Piet reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Kristel de boulle",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Teun Reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Piet reyniers",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }, {
          name: "Kristel de boulle",
          grades: [1, 2, 5, 3, 2, 1, 5]
        }
      ],
      styleKey: 0,
      typeKey: 0,
    } 

    this._renderCanvas = this._renderCanvas.bind(this)
    this._addStudents = this._addStudents.bind(this)

  }

  render() {
    return (
      <div className="App FullScreen flexRows">
        <div>
          <Options items={this.state} onChange={(c, e) => {
            if (c == 'StyleAdded') {
              let array = this.state.styles.map(s => s)
              array.push({ key: Math.max(...this.state.styles.map(s => s.key)) + 1, name: e.name, style: e.style })
              this.setState({ styles: array })
              styleStore.set('styles', array)
            } else if (c == 'StyleEdited') {
              let array = this.state.styles.filter(s => s.key != e.key)
              array.push(e)
              this.setState({ styles: array })
              styleStore.set('styles', array)
            } else if (c == 'TypeAdded') {
              let array = this.state.types.map(s => s)
              array.push({ key: Math.max(...this.state.types.map(s => s.key)) + 1, name: e.name, type: e.type })
              this.setState({ types: array })
              typeStore.set('types', array)
            } else if (c == 'TypeEdited') {
              let array = this.state.types.filter(s => s.key != e.key)
              array.push(e)
              this.setState({ types: array })
              typeStore.set('types', array)
            }
          }
          }
          onSelectionChange={(s, t) => {
              this.setState({ styleKey: s, typeKey: t })
              this._renderCanvas(undefined, {style: s, type: t})
            }}></Options>
        </div>
        <div className='flexColumns' style={{
          flex: 1,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 'auto',
        }}>
          <div style={{
            width: '40%',
            minWidth: '200px',
            maxWidth: '300px',
            overflow: 'auto',
            borderRight: 'solid 2px #ccc',
          }}>
            <div>
              <Group title='render options'>
                <RenderOptions items={this.state.settings}
                  onChange={(c) => {
                    this.setState({ settings: c })
                    settingsStore.set('settings', c)
                    this._renderCanvas(c, undefined)
                  }} />
              </Group>
              <Group title='students'>
                <Students items={this.state.students} onChange={(c, l)=> {
                  if(c === 'Clear'){
                    this.setState({'students': []})
                  }else if(c === 'Add'){
                    this._addStudents(l)
                  }
                }}></Students>
              </Group>
            </div>
          </div>
          <div  id='MainCanvasWrapper' className='flexColumns' style={{ width: '80%', justifyContent: 'center', overflow: 'auto' }}>
            <canvas id='MainCanvas' style={{ alignSelf: 'center', border: '1px solid #333' }}></canvas>
            <ReactResizeDetector handleWidth handleHeight onResize={() => this._renderCanvas(undefined, undefined)} />
          </div>
        </div>
      </div >
    )
  }

  _renderCanvas(c,b) {
    const viewScale = c ? c.viewScale : this.state.settings.viewScale
    const width = c ? c.width :  this.state.settings.width
    const style = this.state.styles.filter(s => s.key ===   (b ? b.style :this.state.styleKey))[0]
    const type =  this.state.types.filter(s => s.key === (b ? b.type: this.state.typeKey))[0]
    const wrapper = document.getElementById('MainCanvasWrapper')
    RenderCanvas.drawCanvas({
      format: style.style,
      layout: type.type
    }, 'MainCanvas', { name: "Teun Reyniers", scores: [0, 1, 3, 2, 2, 2, 1, 0, 2, 0, 3] },
      viewScale < 5
        ? Math.min(Math.min(wrapper.offsetWidth * 0.9, wrapper.offsetHeight * 0.9 / style.style.ratio),width)
        : viewScale * width / 100)
  }

  _addStudents(ltext) {
    
    let students = []
    ltext.split('\n').forEach(l => {
        if (l != "") {
            let student = { name: "", scores: [] }
            let first = true
            l.split(',').forEach(w => {
                if (first) {
                    student.name = w
                } else {
                    student.scores.push(parseInt(w))
                }
                first = false
            })
            students.push(student)
        }
    })
    this.setState({ students: students})
  }

}

export default App
