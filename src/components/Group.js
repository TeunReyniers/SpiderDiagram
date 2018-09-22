
import React, { Component } from 'react';

import { Label } from 'office-ui-fabric-react/lib/Label'


export class Group extends Component {
    constructor() {
        super()
    }

    render() {
        return <div style={{
            background: '#eee',
            margin: '0px',
        }}>
            <div style={{ background: '#f7f7f7', padding: '5px' }}>
                <Label>{ this.props.title }</Label>
            </div>
            <div>
                {this.props.children}
            </div>
        </div>
    }
}