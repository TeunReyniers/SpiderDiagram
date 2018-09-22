import React, { Component } from 'react';

import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';


export class Options extends Component {
  render() {
    return <div className="ms-Grid" style={{ padding: '5px, 10px', background: '#eee', borderBottom: 'solid 2px #ccc' }} >
      <div className="ms-Grid-row">
        <div className="ms-Grid-col" style={{margin: '5px'}}>
          <div className="ms-Grid-col">
            <Label>Style</Label>
          </div>
          <div className="ms-Grid-col">
            <ComboBox
              defaultSelectedKey={1}
              id="TypeDropDown"
              ariaLabel="Type combobox"
              allowFreeform={true}
              autoComplete="on"
              options={this.props.items.styles.map((e) => { return { key: e.key, text: e.name } })}
              onRenderOption={this._onRenderFontOption}
              componentRef={this._basicComboBoxComponentRef}
              onPendingValueChanged={(option, pendingIndex, pendingValue) => { }} />
          </div>
          <div className="ms-Grid-col">
            <PrimaryButton>New style</PrimaryButton>
          </div>
        </div>
        <div className="ms-Grid-col" style={{margin: '5px'}}>
          <div className="ms-Grid-col">
            <Label>Type</Label>
          </div>
          <div className="ms-Grid-col">
            <ComboBox
              defaultSelectedKey={1}
              id="TypeDropDown"
              ariaLabel="Type combobox"
              allowFreeform={true}
              autoComplete="on"
              options={this.props.items.types.map((e) => { return { key: e.name, text: e.name } })}
              onRenderOption={this._onRenderFontOption}
              componentRef={this._basicComboBoxComponentRef}
              onPendingValueChanged={(option, pendingIndex, pendingValue) => { }} />
          </div>
          <div className="ms-Grid-col">
            <PrimaryButton>New type</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  }

  _basicComboBoxComponentRef = (component) => {
    this._basicCombobox = component;
  };

  _onRenderFontOption = (item) => {
    return (
      <span className={'ms-ComboBox-optionText'}>
        {item.text}
      </span>
    );
  };
}
