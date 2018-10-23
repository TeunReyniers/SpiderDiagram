import React, { Component } from 'react'
import { PrimaryButton, DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { EditStyle } from './EditStyle'
import { EditType } from './EditType'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
const ReactMarkdown = require('react-markdown')

const whatsNew = `
## Version: 0.1.2
- First release

## Version: 0.1.3
- Only selected students or being removed on clear
- On download only for selected students is a spiderdiagram created

## Version: 0.1.4
- Splashscreen added

## Version: 0.1.5
- Version indicator added
- Whats new added
- Export/Import styles and types added
- Fix clear all not working when no students selected
- Fix download all not working when no students selected

# Version: 0.1.6
- Changes in which properties belong to style and which to type to make it more usable
  Sorry for the breaking changes
- Faster loading speeds
- UI improvements
`
export class Header extends Component {

  constructor() {
    super()
    this.state = {
      styleEditOpen: false,
      typeEditOpen: false,
      whatsnewOpen: false,
      new: false,
    }
  }

  render() {
    return <div className="flexColumns"
      style={{
        padding: '5px 10px',
        background: '#eee',
        borderBottom: 'solid 2px #ccc',
        justifyContent: 'stretch'
      }}>
      <div className="flexColumns">
        <div style={{ margin: 'auto 5px auto 0' }}>
          <Label>Style</Label>
        </div>
        <ComboBox
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
        <div style={{ margin: 'auto 5px auto 30px' }}>
          <Label>Type</Label>
        </div>
        <ComboBox
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
      <div className="flexColumns">
        <DefaultButton
          id="ContextualMenuBasicExample"
          text="More"
          menuProps={{
            shouldFocusOnMount: true,
            items: [
              {
                key: 'Import',
                text: 'Import',
                onClick: () =>this.props.onImport()
              },
              {
                key: 'Export',
                text: 'Export',
                onClick: () => this.props.onExport(),
              },
            ]
          }}
        />
      </div>
      <div className="flexColumns" style={{ margin: 'auto 0 auto auto' }}>
        <a className='version' href='#' onClick={() => this.setState({ whatsnewOpen: true })}>Version: {this.props.version}</a>
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
      <Dialog minWidth='50%'
        hidden={!this.state.whatsnewOpen}
        onDismiss={() => this.setState({ whatsnewOpen: false })}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'What\'s new',
          subText:
            ''
        }}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}
      >
        <div>
          <ReactMarkdown source={whatsNew} />
        </div>
        <DialogFooter>
          <DefaultButton onClick={() => this.setState({ whatsnewOpen: false })} text="Dismiss" />
        </DialogFooter>
      </Dialog>
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
