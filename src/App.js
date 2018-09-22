
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { List } from 'office-ui-fabric-react/lib/List'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { Options } from './components/Options'
import { Students } from './components/Students'


import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const path = require('path');
const Store = require('./logic/Store.js');

initializeIcons();

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 'teun', height: '600' }
  }
});


class App extends Component {

  constructor() {
    super();
    let { width, height } = store.get('windowBounds');
    this.state = {
      styles: [
        { key: 1, name: 'wiskunde' },
        { key: 2, name: 'frans', },
      ],
      types: [
        { name: 'gehele getallen', tag: 'wiskunde' },
        { name: 'algebra', tag: 'wiskunde' },
      ],
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
        }
      ],
      showPanel: false,
      width: width,
      height: height
    };

  }

  render() {
    return (
      <div className="App FullScreen">
        <div>
          <Options items={this.state} ></Options>
        </div>
        <div className="LeftPane">
          <div className="" style={{ height: '100%' }}>
            <Students items={this.state.students}></Students>
          </div>
          {/* <div className="">
            <TextField value={this.state.width} onChange={(e, s) => {
              console.log(e);
              
              store.set('windowBounds', { width: s, height: '600' })
              this.setState({ width: s })
            }}>
            </TextField>
          </div> */}
        </div>
      </div >
    );
  }
}

export default App;
