
import React, { Component } from 'react';

import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';


export class Students extends Component {
    constructor() {
        super()
    }

    render() {
        return <div style={{ background: '#eee', margin: '0px', height: '100%'}}>
            <div style={{ background: '#f7f7f7', padding: '5px'}}>
                <Label>Students</Label>
            </div>
            <div style={{padding: '10px'}}>
            <List items={this.props.items} onRenderCell={this.renderCheckboxCell} />
            </div>
        </div>
    }

    renderCheckboxCell(item, index) {
        return (
            <div style={{ padding: '5px' }} >
                <Checkbox label={item.name} />
            </div>
        );
    }
}