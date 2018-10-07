import React, { Component } from 'react'

import { PrimaryButton, Button, IconButton } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { EditStyle } from './EditStyle'
import { EditType } from './EditType'

export class Options extends Component {

  constructor() {
    super()
    this.state = {
      styleEditOpen: false,
      typeEditOpen: false,
      new: false,
      selectedStyle: 0,
      selectedType: 0,
    }
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
          defaultSelectedKey={0}
          selectedKey={this.state.selectedStyle}
          id="StyleDropDown"
          ariaLabel="Style selector"
          allowFreeform={false}
          autoComplete="on"
          options={this.props.items.styles.map((e) => { return { key: e.key, text: e.name } })}
          onRenderOption={this._onRenderFontOption}
          componentRef={this._basicComboBoxComponentRef}
          onChange={(e, option) => {            
            this.setState({ selectedStyle: option.key })
            this.props.onSelectionChange( option.key, this.state.selectedType)
          }} />
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          title="Edit"
          ariaLabel="Edit"
          onClick={() => {
            this.setState({ styleEditOpen: true })
            this.setState({ new: false })
          }} />
        <IconButton
          iconProps={{ iconName: 'Add' }}
          onClick={() => {
            this.setState({ styleEditOpen: true })
            this.setState({ new: true })
          }} />
      </div>
      <div className="flexColumns">
        <Label>Type</Label>
        <ComboBox
          defaultSelectedKey={0}
          selectedKey={this.state.selectedType}
          id="TypeDropDown"
          ariaLabel="Type selector"
          allowFreeform={false}
          autoComplete="on"
          options={this.props.items.types.map((e) => { return { key: e.key, text: e.name } })}
          onRenderOption={this._onRenderFontOption}
          componentRef={this._basicComboBoxComponentRef}
          onChange={(e, option) => {
            this.setState({ selectedType: option.key })
            this.props.onSelectionChanged(this.state.selectedStyle, option.key)
          }} />
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          title="Edit"
          ariaLabel="Edit"
          onClick={() => {
            this.setState({ typeEditOpen: true })
            this.setState({ new: false })
          }} />
        <IconButton
          iconProps={{ iconName: 'Add' }}
          onClick={() => {
            this.setState({ typeEditOpen: true })
            this.setState({ new: true })
          }} />
      </div>
      <Panel
        hasCloseButton={false}
        isOpen={this.state.styleEditOpen}
        type={PanelType.smallFluid}
        onDismiss={() => this.setState({ styleEditOpen: false })}
        headerText="Edit Style">
        <EditStyle new={this.state.new} style={this.props.items.styles.filter(s => s.key == this.state.selectedStyle)[0]}
          onCancel={() => { this.setState({ styleEditOpen: false }) }}
          onSave={(key, name, style) => {
            this.setState({ styleEditOpen: false })
            if (key >= 0) {
              this.props.onChange('StyleEdited', { key: key, name: name, style: style })
            } else {
              this.props.onChange('StyleAdded', { name: name, style: style })
            }
          }}></EditStyle>
      </Panel>
      <Panel
        hasCloseButton={false}
        isOpen={this.state.typeEditOpen}
        type={PanelType.smallFluid}
        onDismiss={() => this.setState({ typeEditOpen: false })}
        headerText="Edit Type">
        <EditType new={this.state.new} type={this.props.items.types.filter(s => s.key == this.state.selectedType)[0]}
          onCancel={() => { this.setState({ typeEditOpen: false }) }}
          onSave={(key, name, type) => {
            this.setState({ typeEditOpen: false })
            if (key >= 0) {
              this.props.onChange('TypeEdited', { key: key, name: name, type: type })
            } else {
              this.props.onChange('TypeAdded', { name: name, type: type })
            }
          }}></EditType>
      </Panel>
    </div>
  }

  _basicComboBoxComponentRef = (component) => {
    this._basicCombobox = component
  }

  _onRenderFontOption = (item) => {
    return (
      <div>
        <span className={'ms-ComboBox-optionText'}>
          {item.text}
        </span>

      </div>
    )
  }
}
