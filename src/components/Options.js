import React, { Component } from 'react'

import { PrimaryButton, DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { EditStyle } from './EditStyle'
import { EditType } from './EditType'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'

export class Options extends Component {

  constructor() {
    super()
    this.state = {
      styleEditOpen: false,
      typeEditOpen: false,
      new: false,
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
          selectedKey={this.props.items.styleKey}
          id="StyleDropDown"
          ariaLabel="Style selector"
          allowFreeform={false}
          autoComplete="on"
          options={this.props.items.styles.map((e) => { return { key: e.key, text: e.name } })}
          onRenderOption={this._onRenderFontOption}
          componentRef={this._basicComboBoxComponentRef}
          onChange={(e, option) => {
            this.props.onSelectionChange(option.key, this.props.items.typeKey)
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
          iconProps={{ iconName: 'Copy' }}
          title='Make a copy'
          ariaLabel='Make a copy'
          onClick={() => {
            this.setState({ styleEditOpen: true })
            this.setState({ new: true })
          }} />
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          title='Delete this style'
          ariaLabel='Delete this style'
          onClick={() => {
            this.setState({ deleteStyleHidden: false })
          }} />
        <Dialog
          hidden={this.state.deleteStyleHidden}
          onDismiss={() => this.setState({ deleteStyleHidden: true })}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Delete Style',
            subText:
              'Are you sure you want to delete the active style?'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverride'
          }}
        >
          {null /** You can also include null values as the result of conditionals */}
          <DialogFooter>
            <PrimaryButton onClick={() => {
              this.props.onChange('StyleDeleted', { key: this.props.items.styleKey })
              this.setState({ deleteStyleHidden: true })
            }} text="Yes" />
            <DefaultButton onClick={() => this.setState({ deleteStyleHidden: true })} text="No" />
          </DialogFooter>
        </Dialog>
      </div>
      <div className="flexColumns">
        <Label>Type</Label>
        <ComboBox
          defaultSelectedKey={0}
          selectedKey={this.props.items.typeKey}
          id="TypeDropDown"
          ariaLabel="Type selector"
          allowFreeform={false}
          autoComplete="on"
          options={this.props.items.types.map((e) => { return { key: e.key, text: e.name } })}
          onRenderOption={this._onRenderFontOption}
          componentRef={this._basicComboBoxComponentRef}
          onChange={(e, option) => {
            this.props.onSelectionChange(this.props.items.styleKey, option.key)
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
          iconProps={{ iconName: 'Copy' }}
          title='Make a copy'
          ariaLabel='Make a copy'
          onClick={() => {
            this.setState({ typeEditOpen: true })
            this.setState({ new: true })
          }} />
 <IconButton
          iconProps={{ iconName: 'Delete' }}
          title='Delete this Type'
          ariaLabel='Delete this Type'
          onClick={() => {
            this.setState({ deleteTypeHidden: false })
          }} />
        <Dialog
          hidden={this.state.deleteTypeHidden}
          onDismiss={() => this.setState({ deleteTypeHidden: true })}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Delete type',
            subText:
              'Are you sure you want to delete the active type?'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverride'
          }}
        >
          {null /** You can also include null values as the result of conditionals */}
          <DialogFooter>
            <PrimaryButton onClick={() => {
              this.props.onChange('TypeDeleted', { key: this.props.items.typeKey })
              this.setState({ deleteTypeHidden: true })
            }} text="Yes" />
            <DefaultButton onClick={() => this.setState({ deleteTypeHidden: true })} text="No" />
          </DialogFooter>
        </Dialog>
      </div>
      <Panel
        hasCloseButton={false}
        isOpen={this.state.styleEditOpen}
        type={PanelType.smallFluid}
        onDismiss={() => this.setState({ styleEditOpen: false })}
        headerText="Edit Style">
        <EditStyle new={this.state.new} style={this.props.items.styles.filter(s => s.key === this.props.items.styleKey)[0]}
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
        <EditType new={this.state.new} type={this.props.items.types.filter(s => s.key === this.props.items.typeKey)[0]}
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
