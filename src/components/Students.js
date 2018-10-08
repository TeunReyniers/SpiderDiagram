
import React, { Component } from 'react';

import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from "office-ui-fabric-react/lib/Panel";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';

export class Students extends Component {
    constructor() {
        super()

        this.state = { hideDialog: true }

        this._getErrorMessage = this._getErrorMessage.bind(this);
    
    }

    render() {
        return <div style={{
            background: '#eee',
            margin: '0px',
            overflow: 'auto',
        }}>

            <div style={{ padding: '0px' }}>

                <DefaultButton onClick={this._showDialog}>Add</DefaultButton>
                <DefaultButton onClick={() => this.props.onChange('Clear', '')}>Clear</DefaultButton>
                <PrimaryButton onClick={()=>this.props.download()}>Download</PrimaryButton>
                <List items={this.props.items} onRenderCell={this._renderCheckboxCell} />
            </div>
            <Dialog
                hidden={this.state.hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Add students',
                    subText:
                        'Copy the values below and press insert.'
                }}
                modalProps={{
                    titleAriaId: 'myLabelId',
                    subtitleAriaId: 'mySubTextId',
                    isBlocking: true,
                    containerClassName: 'ms-dialogMainOverride'
                }}>
                <TextField multiline
                    rows={5}
                    required={true} 
                    value={this.state.NewStudents}
                    onChange={(e,v)=> this.setState({NewStudents: this._formatText(v)})}></TextField>
                <DialogFooter>
                    <PrimaryButton onClick={() => {
                        this.props.onChange('Add', this.state.NewStudents)
                        this.setState({NewStudents: ''})
                        this._closeDialog()
                    }} text="Insert" />
                    <DefaultButton onClick={this._closeDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        </div>
    }

    _formatText (text) {
        if (text.substr(0, 1) == '"') {
            return text.substr(1, text.length)
        }
        return text
    }

    _renderCheckboxCell(item, index) {
        return(
            <div style={{ padding: '10px', background: index % 2 === 0 ? '#ddd' : '#eee' }} >
                <Checkbox label={item.name}/>
            </div>
        );
    }

    _getErrorMessage(value) {
        if (isNaN(value)) {
            return 'This value must be an integer'
        }
        if (!Number.isInteger(parseFloat(value))) {
            return 'This value must be an integer'
        }
        if (value < 100 || value > 10000) {
            return 'Value is limited between 100 and 10000'
        }
        return ''
    }

    _showDialog = () => {
        this.setState({ hideDialog: false });
    };

    _closeDialog = () => {
        this.setState({ hideDialog: true });
    };
}