import React, { Component } from 'react';

import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { PrimaryButton, Button } from 'office-ui-fabric-react/lib/Button';
import { Group } from "./Group";

export class EditStyle extends Component {
    constructor() {
        super()

        this._getErrorMessage = this._getErrorMessage.bind(this);
    }

    render() {
        return <div style={{ margin: '0px', height: '100%', position: 'relative' }}>
            <div style={{ width: '40%' }}>
                <TextField placeholder="A name to reconize the style"
                    onGetErrorMessage={this._getErrorMessage}
                    label="Name"
                    required={true}></TextField>
                <Group title='Text'>
                    <Group title='Title' level={1}>
                        <TextField label='Position X'></TextField>
                        <TextField label='Position Y'></TextField>
                        <TextField label='Alignment'></TextField>
                        <TextField label='Color'></TextField>
                        <TextField label='Font'></TextField>
                    </Group>
                    <Group title='Title' level={1}>
                    <Group title='Title' level={2}>
                        <TextField label='Position X'></TextField>
                        <TextField label='Position Y'></TextField>
                        <TextField label='Alignment'></TextField>
                        <TextField label='Color'></TextField>
                        <TextField label='Font'></TextField>
                    </Group>
                    </Group>
                </Group>
            </div>
            <div style={{ background: 'blue' }}>

            </div>
            <div style={{ button: '100%', height: '50px' }}>
                <PrimaryButton>Save</PrimaryButton>
                <Button>Cancel</Button>
            </div>
        </div>
    }

    _getErrorMessage(value) {
        if (value === 'wiskunde') {
            return 'This name already exists'
        }
        if (value.length === 0) {
            return 'This field is required'
        }
        if (value.length <= 3) {
            return 'The length must be greater than 3'
        }
        return ''
    }
}