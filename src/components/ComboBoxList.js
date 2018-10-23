import React, { Component } from 'react';

import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';

export class ComboBoxList extends Component {

    constructor() {
        super();
        this.state = {
            StyleEditOpen: false,
        };

    }

    render() {
        return <ComboBox
            label={this.props.label}
            defaultSelectedKey={this.props.selectedItem}
            id="TypeDropDown"
            ariaLabel="Type combobox"
            allowFreeform={false}
            autoComplete="off"
            options={this.props.items.map((e) => { return { key: e, text: e } })}
            onRenderOption={this._onRenderFontOption}
            componentRef={this._basicComboBoxComponentRef}></ComboBox>
    }

    _basicComboBoxComponentRef = (component) => {
        this._basicCombobox = component;
    };

    _onRenderFontOption = (item) => {
        return (
            <span className={'ms-ComboBox-optionText'}>
                {item.text}
            </span>
        );
    };
}
