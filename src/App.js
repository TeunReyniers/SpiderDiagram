
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { Options } from './components/Options'
import { Students } from './components/Students'
import { Group } from './components/Group'
import { RenderOptions } from './components/RenderOptions'



import { JsonEditor as Editor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'

const path = require('path')
const Store = require('./logic/Store.js')

initializeIcons()



const settingsStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'settings',
  defaults: {
    settings: { 
    canvas: { width: 1000, height: 1000 },
    viewScale: 100,
  }
  }
});

const styleStore = new Store({
  configName: 'styleStore',
  defaults: {
    defaultStyleKey: 'defaultStyle',
    styles: [{ key: 1, name: 'wiskunde' },]
  }
});

const typeStore = new Store({
  configName: 'typeStore',
  defaults: {
    defaultTypeKey: 'defaultTypeKey',
    types: [
      { name: 'gehele getallen', tag: 'wiskunde' },
    ],
  }
});


class App extends Component {

  constructor() {
    super();

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
    };

  }

  render() {
    return (
      <div className="App FullScreen flexRows">
        <div>
          <Options items={this.state} ></Options>
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
                <RenderOptions items={this.settings} onChange={(c) => { this.setState({settings: c})}}></RenderOptions>
              </Group>
              <Group title='students'>
                <Students items={this.state.students}></Students>
              </Group>
            </div>
          </div>
          <div style={{ width: '80%' }}>
            hello
            {/* <TextField value={this.state.width} onChange={(e, s) => {
              console.log(e);
              
              store.set('windowBounds', { width: s, height: '600' })
              this.setState({ width: s })
            }}>
            </TextField> */}
          </div>
        </div>
      </div >
    );
  }
}

export default App;
