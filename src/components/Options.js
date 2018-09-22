import React, { Component } from 'react';

import { PrimaryButton, Button, IconButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { EditStyle } from './EditStyle'

export class Options extends Component {

  constructor() {
    super();
    this.state = {
      StyleEditOpen: false,
    };

  }

  render() {
    return <div className="ms-Grid" style={{ padding: '5px, 10px', background: '#eee', borderBottom: 'solid 2px #ccc' }} >
      <div className="ms-Grid-row">
        <div className="ms-Grid-col" style={{ margin: '5px' }}>
          <div className="ms-Grid-col">
            <Label>Style</Label>
          </div>
          <div className="ms-Grid-col" style={{ padding: '0px' }}>
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
          <div className="ms-Grid-col" style={{ padding: '0px' }}>
            <IconButton
              iconProps={{ iconName: 'Edit' }}
              title="Edit"
              ariaLabel="Edit"
            />
          </div>
          <div className="ms-Grid-col" style={{ padding: '0px 5px' }}>
            <PrimaryButton onClick={() => this.setState({StyleEditOpen: true})}>New style</PrimaryButton>
          </div>
        </div>
        <div className="ms-Grid-col" style={{ margin: '5px' }}>
          <div className="ms-Grid-col">
            <Label>Type</Label>
          </div>
          <div className="ms-Grid-col" style={{ padding: '0px' }}>
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
          <div className="ms-Grid-col" style={{ padding: '0px' }}>
            <IconButton
              iconProps={{ iconName: 'Edit' }}
              title="Edit"
              ariaLabel="Edit"
            />
          </div>
          <div className="ms-Grid-col" style={{ padding: '0px 5px' }}>
            <PrimaryButton>New type</PrimaryButton>
          </div>
        </div>
      </div>
      <Panel
          isOpen={this.state.StyleEditOpen}
          type={PanelType.smallFluid}
          // tslint:disable-next-line:jsx-no-lambda
          onDismiss={() => this.setState({ StyleEditOpen: false })}
          headerText="Edit Style"
        >
          <EditStyle></EditStyle>
        </Panel>
    </div>
  }

  _basicComboBoxComponentRef = (component) => {
    this._basicCombobox = component;
  };

  _onRenderFontOption = (item) => {
    return (
      <div>
        <span className={'ms-ComboBox-optionText'}>
          {item.text}
        </span>

      </div>
    );
  };
}
