import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { List } from 'office-ui-fabric-react/lib/List'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { Options } from './components/Options'
import { Students } from './components/Students'

import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

initializeIcons();




class App extends Component {

  constructor() {
    super();
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
    };

  }

  render() {
    return (
      <div className="App FullScreen">
        <div className="ms-Grid-row">
          <Options items={this.state}></Options>
        </div>
        <div className="ms-Grid-row FullBottom">
          <div className="" style={{ height: '100%', width: '30%' }}>
            <Students items={this.state.students}></Students>
          </div>
          <div className="">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
