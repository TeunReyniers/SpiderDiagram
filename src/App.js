import React, { Component } from 'react'
import './App.css'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { Header } from './components/Header'
import { Students } from './components/Students'
import { Group } from './components/Group'
import { RenderOptions } from './components/RenderOptions'
import ReactResizeDetector from 'react-resize-detector'
import { RenderCanvas } from './logic/RenderSpinDiagramCanvas.js'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import packageJson from '../package.json'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { List } from 'office-ui-fabric-react/lib/List'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

var lru = require('lru-cache')({ max: 256, maxAge: 250/*ms*/ });


const electron = window.require('electron');
var fs = electron.remote.require('fs');


var origLstat = fs.lstatSync.bind(fs);

// NB: The biggest offender of thrashing lstatSync is the node module system
// itself, which we can't get into via any sane means.
require('fs').lstatSync = function (p) {
  let r = lru.get(p);
  if (r) return r;

  r = origLstat(p);
  lru.set(p, r);
  return r;
};


const appVersion = packageJson.version

var path = require('path');
const Store = require('./logic/Store.js')
var JSZip = require("jszip");
var elerem = electron.remote;
var dialog = elerem.dialog;
var app = elerem.app;



initializeIcons()

const settingsStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'settings',
  defaults: {
    settings: {
      width: 1000,
      viewScale: 100,
    }
  }
})

const styleStore = new Store({
  configName: 'styleStore',
  defaults: {
    defaultStyleKey: 0,
    styles: [{
      key: 0,
      name: 'Default',
      style: {
        ratio: 1.2,
        fillmode: 'piece',
        title: {
          font: {
            type: 'Arial',
            size: 7,
            style: 'bold',
          },
          color: 'black',
          position: {
            X: 100,
            Y: 14
          },
          rotation: 0,
          alignment: 'center'
        },
        student: {
          font: {
            type: 'Arial',
            size: 5,
            style: '',
          },
          color: 'black',
          position: {
            X: 100,
            Y: 20
          },
          rotation: 0,
          alignment: 'center'
        },
        diagram: {
          position: {
            X: 100,
            Y: 120,
          },
          radius: 80,
          lines: {
            sector: {
              color: '#1f4e5f',
              width: 2,
              length: 10.5
            },
            part: {
              color: '#aacfd0',
              width: 1,
              length: 10
            },
            circles: {
              color: '#aacfd0',
              width: 1,
            }
          },
          text: {
            sector: {
              font: {
                type: 'Arial',
                size: 7,
                style: 'bold',
              },
              color: 'black',
              radius: 11,
              rotation: 0,
              smartRotate: false,
              smartRotateDirection: 'horizontal', // or horizontal
              smartRotateInvert: false,
              bow: true,
            },
            part: {
              font: {
                type: 'Arial',
                size: 4.5,
                style: '',
              },
              color: 'black',
              radius: 9.4,
              rotation: 0,
              smartRotate: false,
              smartRotateDirection: 'horizontal', // or horizontal
              smartRotateInvert: false,
              bow: true,
            },
            circles: {
              font: {
                type: 'Arial',
                size: 3,
                style: 'bold',

              },
              color: 'black',
              offset: {
                X: -3, Y: -3
              },
              rotation: -90,
              alignment: 'left'
            }
          },
          grades: [
            { name: "Onvoldoende", width: 3, color: '#3b8686' },
            { name: "Voldoende", width: 6, color: '#79bd9a' },
            { name: "Goed", width: 9, color: '#a8dba8' },
            { name: "Stoppen met werken", width: 10, color: '#cff09e' },
          ]
        }
      },
    },]
  }
})

const typeStore = new Store({
  configName: 'typeStore',
  defaults: {
    defaultTypeKey: 0,
    types: [
      {
        key: 0,
        name: 'Default',
        type: {
          title: "Wiskunde - getallenleer",
          sectors: [
            {
              name: "Gehelegetallen",
              parts: [
                { name: "optellen" },
                { name: "aftrekken" },
                { name: "delen" },
                { name: "vermenigvuldigen" }
              ]
            },
            {
              name: "Breuken", parts: [
                { name: "optellen" },
                { name: "aftrekken" },
                { name: "delen" },
                { name: "vermenigvuldigen" }
              ]
            },
            {
              name: "Complex", parts: [
                { name: "optellen" },
                { name: "aftrekken" },
                { name: "vermenigvuldigen" },
              ]
            }
          ],
          grades: [
            { name: "Onvoldoende", width: 3, color: '#3b8686' },
            { name: "Voldoende", width: 6, color: '#79bd9a' },
            { name: "Goed", width: 9, color: '#a8dba8' },
            { name: "Stoppen met werken", width: 10, color: '#cff09e' },
          ]
        }
      },
    ],
  }
})


class App extends Component {

  constructor() {
    super()

    const settings = settingsStore.get('settings')
    const styles = styleStore.get('styles')
    const types = typeStore.get('types')
    const lastStyleKey = styleStore.get('defaultStyleKey')
    const styleKey = styles.filter(s=>s.key === lastStyleKey).length === 0
      ? 0
      : lastStyleKey
    const  lastTypeKey = typeStore.get('defaultTypeKey')
    const typeKey = types.filter(s=>s.key === lastTypeKey).length === 0
      ? 0
      : lastTypeKey

    this.state = {
      settings,
      styles,
      types,
      students: [],
      styleKey,
      typeKey,
      exportWindowVisible: false,
      importWindowVisible: false,
      exportTypes: [],
      exportStyles: [],
      importJson: {},
      importNamePrefix: ''
    }

    this._renderCanvas = this._renderCanvas.bind(this)
    this._addStudents = this._addStudents.bind(this)
    this._downloadAll = this._downloadAll.bind(this)
    this._renderCheckboxCellStyle = this._renderCheckboxCellStyle.bind(this)
    this._renderCheckboxCellType = this._renderCheckboxCellType.bind(this)
    this._renderCheckboxCellStyleImport = this._renderCheckboxCellStyleImport.bind(this)
    this._renderCheckboxCellTypeImport = this._renderCheckboxCellTypeImport.bind(this)
  }

  render() {
    return (
      <div className="App FullScreen flexRows">
        <div>
          <Header items={this.state}
            version={appVersion}
            onChange={(c, e) => {
              if (c === 'StyleAdded') {
                const styleKey =  Math.max(...this.state.styles.map(s => s.key)) + 1
                const styles = [
                  ...this.state.styles.map(s => s),
                  {
                    key: styleKey,
                    name: e.name,
                    style: e.style
                  }]
                this.setState({ styles, styleKey })
                styleStore.set('styles', styles)
                styleStore.set('defaultStyleKey', styleKey)
              } else if (c === 'StyleEdited') {
                let array = [
                  ...this.state.styles.filter(s => s.key !== e.key), e]
                this.setState({ styles: array })
                styleStore.set('styles', array)
              } else if (c === 'StyleDeleted') {
                let array = this.state.styles.filter(s => s.key !== e.key)
                if (e.key !== 0) {
                  this.setState({ styles: array, styleKey: 0 })
                  styleStore.set('styles', array)
                }
              } else if (c === 'TypeAdded') {
                const typeKey = Math.max(...this.state.types.map(s => s.key)) + 1
                const types = [
                  ...this.state.types.map(s => s), {
                    key: typeKey,
                    name: e.name,
                    type: e.type
                  }]
                this.setState({ types, typeKey })
                typeStore.set('types', types)
                typeStore.set('defaultTypeKey', typeKey)
              } else if (c === 'TypeEdited') {
                let array = [
                  ...this.state.types.filter(s => s.key !== e.key), e]
                this.setState({ types: array })
                typeStore.set('types', array)
              } else if (c === 'TypeDeleted') {
                let array = this.state.types.filter(s => s.key !== e.key)
                if (e.key !== 0) {
                  this.setState({ types: array, typeKey: 0 })
                  typeStore.set('types', array)
                }
              }
            }}
            onSelectionChange={(s, t) => {
              styleStore.set('defaultStyleKey', s)
              typeStore.set('defaultTypeKey', t)
              this.setState({ styleKey: s, typeKey: t })
              this._renderCanvas(undefined, { style: s, type: t }, undefined)
            }}
            onExport={() => {
              this.setState({
                exportWindowVisible: true,
                exportStyles: [],
                exportTypes: []
              })
            }}
            onImport={() => {
              var toLocalPath = app.getPath("desktop")
              let userChosenPath = dialog.showOpenDialog({ defaultPath: toLocalPath })

              if (userChosenPath && userChosenPath[0]) {
                const json = fs.readFileSync(userChosenPath[0])
                this.setState({
                  exportStyles: [],
                  exportTypes: [],
                  importWindowVisible: true,
                  importJson: JSON.parse(json)
                })
              }
            }} />
        </div>
        <div className='flexColumns' style={{
          flex: 1,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 'auto',
        }}>
          <div style={{
            width: '40%',
            minWidth: '200px',
            maxWidth: '300px',
            overflow: 'auto',
            borderRight: 'solid 2px #ccc',
          }}>
            <div>
              <Group title='render options'>
                <RenderOptions items={this.state.settings}
                  onChange={(c) => {
                    this.setState({ settings: c })
                    settingsStore.set('settings', c)
                    this._renderCanvas(c, undefined)
                  }} />
              </Group>
              <Group title='students'>
                <Students items={this.state.students}
                  onSelectionChange={(key, selected) => {
                    let array = this.state.students.filter(s => s.key !== key)
                    let element = this.state.students.filter(s => s.key === key)[0]
                    element.isSelected = selected
                    array.push(element)
                    this.setState({ students: array })
                  }}
                  onChange={(c, l) => {
                    if (c === 'Clear') {
                      const totalStudents = this.state.students.length
                      const studentToKeep = this.state.students.filter(s => !s.isSelected)
                      const students = studentToKeep.length === totalStudents ? [] : studentToKeep        
                      const selectedStudent = Math.min(students.map(s=>s.key))            
                      this.setState({ 'students': students, selectedStudent: selectedStudent })
                      if(students.length === 0){
                        this._renderCanvas(undefined,undefined,'false')
                      }else{
                        this._renderCanvas(undefined, undefined, this.state.students.filter(s=>s.key === selectedStudent)[0])
                      }
                    } else if (c === 'Add') {
                      this._addStudents(l)
                    }
                  }}
                  onDownload={
                    () => {
                      this._myUrlSaveAs()
                    }
                  }
                  onSelectAll={() =>{
                    const array = this.state.students.map(s=>{
                      let ts = s
                      console.log(s.name)
                      ts.isSelected = true
                      return ts
                    })
                    console.log(array)
                    this.setState({students: array})}
                  }
                  onDeselectAll={ () =>{
                    const array = this.state.students.map(s=>{
                      let ts = s
                      console.log(s.name)
                      ts.isSelected = false
                      return ts
                    })
                    console.log(array)
                    this.setState({students: array})}
                  }></Students>
              </Group>
            </div>
          </div>
          <div id='MainCanvasWrapper' className='flexColumns' style={{ width: '80%', justifyContent: 'center', overflow: 'auto', position: 'relative', margin: '20px 0px 0px 0px' }}>
            <div className='flexColumns' style={{ position: 'absolute', top: 0 }}>
              <DefaultButton onClick={
                () => {
                  const index = Math.max(0, this.state.students.findIndex(s => s.key === (this.state.selectedStudent ? this.state.selectedStudent.key : 0)) - 1)
                  this.setState({ selectedStudent: this.state.students[index] })
                  this._renderCanvas(undefined, undefined, this.state.students[index])
                }
              }>Previous</DefaultButton>
              <ComboBox
                selectedKey={this.state.selectedStudent && this.state.selectedStudent.key}
                id="StudentDropDown"
                ariaLabel="Student selector"
                allowFreeform={false}
                autoComplete="on"
                options={this.state.students}
                onRenderOption={this._onRenderFontOption}
                componentRef={this._basicComboBoxComponentRef}
                onChange={(e, option) => {
                  this.setState({ selectedStudent: option })
                  this._renderCanvas(undefined, undefined, option)
                }} />
              <DefaultButton onClick={
                () => {
                  const index = Math.min(this.state.students.length - 1, this.state.students.findIndex(s => s.key === (this.state.selectedStudent ? this.state.selectedStudent.key : 0)) + 1)
                  this.setState({ selectedStudent: this.state.students[index] })
                  this._renderCanvas(undefined, undefined, this.state.students[index])
                }
              }>Next</DefaultButton>
            </div>
            <canvas id='MainCanvas' style={{ alignSelf: 'center', border: '1px solid #333' }}></canvas>
            <ReactResizeDetector handleWidth handleHeight onResize={() => this._renderCanvas(undefined, undefined, undefined)} />
          </div>
        </div>
        <Dialog minWidth='500px'
          hidden={!this.state.exportWindowVisible}
          onDismiss={() => this.setState({ exportWindowVisible: false })}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Export',
            subText:
              ''
          }}
          modalProps={{
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverride'
          }}
        >
          <div className='flexColumns' style={{ flexGrow: 'stretch' }}>
            <div style={{ margin: '10px' }}>
              <Label>Styles</Label>
              <List items={this.state.styles.sort(this._compareStudents)} onRenderCell={this._renderCheckboxCellStyle} />
            </div>
            <div style={{ margin: '10px' }}>
              <Label>Types</Label>
              <List items={this.state.types.sort(this._compareStudents)} onRenderCell={this._renderCheckboxCellType} />
            </div>
          </div>
          <DialogFooter>
            <DefaultButton onClick={() => this.setState({ exportWindowVisible: false })} text="Cancel" />
            <PrimaryButton onClick={() => {
              var toLocalPath = path.resolve(app.getPath("desktop"), 'export.json')
              let userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath })

              if (userChosenPath) {
                let content = {
                  styles: this.state.styles.filter(
                    s => this.state.exportStyles.includes(s.key)),
                  types: this.state.types.filter(
                    s => this.state.exportTypes.includes(s.key)),
                }
                fs.writeFileSync(userChosenPath, JSON.stringify(content));
                this.setState({ exportWindowVisible: false })
              }
            }}
              text="Export" />
          </DialogFooter>
        </Dialog>
        <Dialog minWidth='500px'
          hidden={!this.state.importWindowVisible}
          onDismiss={() => this.setState({ importWindowVisible: false })}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Import',
            subText:
              ''
          }}
          modalProps={{
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverride'
          }}
        >
          <div>
            <TextField label='Name prefix'
              value={this.state.importNamePrefix}
              onChange={(e, s) => this.setState({ importNamePrefix: s })} />
            <div className='flexColumns' style={{ flexGrow: 'stretch' }}>
              <div style={{ margin: '10px' }}>
                <Label>Styles</Label>
                <List items={this.state.importJson && this.state.importJson.styles && this.state.importJson.styles.sort(this._compareStudents)}
                  onRenderCell={this._renderCheckboxCellStyleImport} />
              </div>
              <div style={{ margin: '10px' }}>
                <Label>Types</Label>
                <List items={this.state.importJson && this.state.importJson.types && this.state.importJson.types.sort(this._compareStudents)}
                  onRenderCell={this._renderCheckboxCellTypeImport} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DefaultButton onClick={() => this.setState({ importWindowVisible: false })}
              text="Cancel" />
            <PrimaryButton onClick={() => {

              let styleKey = Math.max(...this.state.styles.map(s => s.key)) + 1
              const styles = this.state.exportStyles.map(s => {
                let style = this.state.importJson.styles.filter(e => e.key === s)[0]
                style.key = styleKey
                style.name = this.state.importNamePrefix !== ''
                  ? this.state.importNamePrefix + '-' + style.name
                  : style.name
                styleKey = styleKey + 1
                return style
              })

              let typeKey = Math.max(...this.state.types.map(s => s.key)) + 1
              const types = this.state.exportTypes.map(s => {
                let type = this.state.importJson.types.filter(e => e.key === s)[0]
                type.key = typeKey
                type.name = this.state.importNamePrefix !== ''
                  ? this.state.importNamePrefix + '-' + type.name
                  : type.name
                typeKey = typeKey + 1
                return type
              })

              styleStore.set('styles', [...this.state.styles, ...styles])
              typeStore.set('types', [...this.state.types, ...types])

              this.setState({
                styles: [...this.state.styles, ...styles],
                types: [...this.state.types, ...types],
                importWindowVisible: false
              })

            }}
              text="Import" />
          </DialogFooter>
        </Dialog>
      </div >
    )
  }

  _compareStudents(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  _renderCheckboxCellStyle(item, index) {
    return (
      <div style={{ padding: '10px', background: index % 2 === 0 ? '#ddd' : '#eee' }} >
        <Checkbox isSelected={item.isSelected}
          label={item.name}
          onChange={(e, b) => {
            b
              ? this.setState({ exportStyles: [...this.state.exportStyles, item.key] })
              : this.setState({ exportStyles: this.state.exportStyles.filter(s => s !== item.key) })
          }} />
      </div>
    );
  }

  _renderCheckboxCellType(item, index) {
    return (
      <div style={{ padding: '10px', background: index % 2 === 0 ? '#ddd' : '#eee' }} >
        <Checkbox isSelected={item.isSelected}
          label={item.name}
          onChange={(e, b) => {
            b
              ? this.setState({ exportTypes: [...this.state.exportTypes, item.key] })
              : this.setState({ exportTypes: this.state.exportTypes.filter(s => s !== item.key) })
          }} />
      </div>
    );
  }

  _renderCheckboxCellStyleImport(item, index) {
    return (
      <div style={{ padding: '10px', background: index % 2 === 0 ? '#ddd' : '#eee' }} >
        <Checkbox isSelected={item.isSelected}
          label={item.name}
          onChange={(e, b) => {
            b
              ? this.setState({ exportStyles: [...this.state.exportStyles, item.key] })
              : this.setState({ exportStyles: this.state.exportStyles.filter(s => s !== item.key) })
          }} />
      </div>
    );
  }

  _renderCheckboxCellTypeImport(item, index) {
    return (
      <div style={{ padding: '10px', background: index % 2 === 0 ? '#ddd' : '#eee' }} >
        <Checkbox isSelected={item.isSelected}
          label={item.name}
          onChange={(e, b) => {
            b
              ? this.setState({ exportTypes: [...this.state.exportTypes, item.key] })
              : this.setState({ exportTypes: this.state.exportTypes.filter(s => s !== item.key) })
          }} />
      </div>
    );
  }




  _basicComboBoxComponentRef = (component) => {
    this._basicCombobox = component
  }

  _renderCanvas(c, b, l) {
    const student = l ? l : this.state.selectedStudent
    const viewScale = c ? c.viewScale : this.state.settings.viewScale
    const width = c ? c.width : this.state.settings.width
    const style = this.state.styles.filter(s => s.key === (b ? b.style : this.state.styleKey))[0]
    const type = this.state.types.filter(s => s.key === (b ? b.type : this.state.typeKey))[0]
    const wrapper = document.getElementById('MainCanvasWrapper')
    RenderCanvas.drawCanvas({
      style: style.style,
      type: type.type
    }, 'MainCanvas', student,
      viewScale < 5
        ? Math.min(Math.min(wrapper.offsetWidth * 0.9, wrapper.offsetHeight * 0.9 / style.style.ratio), width)
        : viewScale * width / 100)
  }

  _renderCanvasFinal(c, b, l) {
    const students = l ? l : this.state.selectedStudent
    const width = c ? c.width : this.state.settings.width
    const style = this.state.styles.filter(s => s.key === (b ? b.style : this.state.styleKey))[0]
    const type = this.state.types.filter(s => s.key === (b ? b.type : this.state.typeKey))[0]
    students && RenderCanvas.drawCanvas({
      style: style.style,
      type: type.type
    }, 'MainCanvas', students, width)
  }

  _addStudents(ltext) {
    let index = this.state.students.length === 0 ? 0 : Math.max(this.state.students.map(s => s.key)) + 1
    let students = []
    ltext.split('\n').forEach(l => {
      if (l !== "") {
        let student = { name: "", key: index, text: '', scores: [] }
        index = index + 1
        let first = true
        l.split(',').forEach(w => {
          if (first) {
            student.name = w
            student.text = w
          } else {
            student.scores.push(parseInt(w))
          }
          first = false
        })
        students.push(student)
      }
    })
    this.setState({ students: students })
  }

  _onRenderFontOption = (item) => {
    return (
      <div>
        <span className={'ms-ComboBox-optionText'}>
          {item.name}
        </span>

      </div>
    )
  }

  _myUrlSaveAs() {
    // app.getPath("desktop")       // User's Desktop folder
    // app.getPath("documents")     // User's "My Documents" folder
    // app.getPath("downloads")     // User's Downloads folder

    var toLocalPath = path.resolve(app.getPath("desktop"), 'spindiagram.zip')
    let userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath })

    if (userChosenPath) {
      this._downloadAll(userChosenPath)
    }
  }

  _download(dest, content) {
    fs.writeFileSync(dest, new Buffer(content));
  };

  _downloadAll(dest) {
    var zip = new JSZip()
    const index = this.state.selectedStudent ? this.state.selectedStudent.key : 0
    for (let q = 0; q < this.state.students.length; q++) {

      if (!this.state.students[q].isSelected && this.students.filter(s => s.isSelected).length !== 0) continue
      this._renderCanvasFinal(undefined, undefined, this.state.students[q])
      const canvas = document.getElementById("MainCanvas");
      var savable = new Image();
      savable.src = canvas.toDataURL();
      zip.file(this.state.students[q].name + ".png", savable.src.substr(savable.src.indexOf(',') + 1), { base64: true })
    }

    zip.generateAsync({ type: "uint8array" })
      .then((content) => {
        this._download(dest, content)
      });

    this._renderCanvas(undefined, undefined, this.state.students[index])
  }
}



export default App
