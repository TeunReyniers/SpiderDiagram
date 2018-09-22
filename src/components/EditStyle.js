import React, { Component } from 'react';

import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { PrimaryButton, Button } from 'office-ui-fabric-react/lib/Button';

export class EditStyle extends Component {
    constructor() {
        super()

        this._getErrorMessage = this._getErrorMessage.bind(this);
    }

    render() {
        return <div style={{ margin: '0px', height: '100%' }}>
            <div style={{ width: '40%' }}>
                <TextField placeholder="A name to reconize the style"
                    onGetErrorMessage={this._getErrorMessage}
                    label="Name"></TextField>
                <PrimaryButton>Save</PrimaryButton>
                <Button>Cancel</Button>
            </div>
            <div style={{ background: 'blue' }}>

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