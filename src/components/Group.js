import React, { Component } from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label'
import { IconButton } from "office-ui-fabric-react/lib/Button";

export class Group extends Component {
    constructor() {
        super()

        this.state = { collapsed: false }
        this._switch = this._switch.bind(this)
    }

    render() {
        return <div style={{
            background: '#eee',
            margin: '0px',
        }}>
            <div className='flexColumns'
                style={{
                    background: '#f7f7f7',
                    padding: '5px',
                    paddingLeft: (5 + this.props.level * 20) + 'px'
                }}>
                <IconButton onClick={this._switch}
                    iconProps={{ iconName: this.state.collapsed ? 'Down' : 'Up' }}></IconButton>
                <Label>{this.props.title}</Label>
            </div>
            <div style={{
                height: this.state.collapsed ? '0px' : 'inherit',
                visibility: this.state.collapsed ? 'hidden' : 'visible',
                transition: 'height 2s'
            }}>
                {this.props.children}
            </div>
        </div>
    }

    _switch() {
        this.setState({ collapsed: !this.state.collapsed })
    }
}