import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';


class App extends Component {

  constructor() {
    super();
    this.state = {
      showPanel: false,
      json: { name: 'teun reyniers', issue: 'hello' }
    };
  }

  render() {
    return (
      <div className="App">
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md3 msu--lg2">
            Hello A
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md9 msu--lg10">
            B
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
