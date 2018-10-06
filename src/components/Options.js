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
      styleEditOpen: false,
      new: false,
      selectedStyle: ''
    };

  }

  
  render() {
    return <div className="flexColumns"
      style={{
        padding: '5px 10px',
        background: '#eee',
        borderBottom: 'solid 2px #ccc'
      }}>
      <div className="flexColumns">
        <Label>Style</Label>
        <ComboBox
          defaultSelectedKey={'h'}
          id="TypeDropDown"
          ariaLabel="Type combobox"
          allowFreeform={true}
          autoComplete="on"
          options={this.props.items.styles.map((e) => { return { key: e.name, text: e.name } })}
          onRenderOption={this._onRenderFontOption}
          componentRef={this._basicComboBoxComponentRef}
          onPendingValueChanged={(option,g,h) => { 
            option && this.setState({selectedStyle: option.text})}} />
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          title="Edit"
          ariaLabel="Edit"
          onClick={() => {
            this.setState({ styleEditOpen: true })
            this.setState({ New: false })
          }}/>
        <IconButton
          iconProps={{ iconName: 'Add' }}
          onClick={() => {
            this.setState({ styleEditOpen: true })
            this.setState({ New: true })
          }}/>
      </div>
      <div className="flexColumns">
        <Label>Type</Label>
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
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          title="Edit"
          ariaLabel="Edit" />
        <IconButton
          iconProps={{ iconName: 'Add' }}
          onClick={() => this.setState({ styleEditOpen: true })} />
      </div>
      <Panel
        hasCloseButton={false}
        isOpen={this.state.styleEditOpen}
        type={PanelType.smallFluid}
        onDismiss={() => this.setState({ styleEditOpen: false })}
        headerText="Edit Style">
        <EditStyle new={this.state.new} style={this.props.items.styles.filter(s=> s.name == this.state.selectedStyle)[0]}
        onCancel={() => { this.setState({ styleEditOpen: false }) }}
          onSave={(name, style) => {
            this.setState({ styleEditOpen: false })
            if (this.props.items.styles.some(s => s.name == name)) {
              this.props.onChange('StyleEdited', { name: name, style: style })
            } else {
              
              this.props.onChange('StyleAdded', { name: name, style: style })
            
            }

          }}></EditStyle>
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
