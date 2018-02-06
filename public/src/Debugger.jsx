import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {ProcessTree} from './components/ProcessTree';
import {Button} from 'antd';


export class Debugger extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.processes = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchProcess().catch(alert);
  }

  async fetchProcess () {
    const processes = await Actuator.get('/process', {
      appName: this.appName
    });
    this.setState({processes});
  }

  renderPage () {
    const {processes, app} = this.state;
    const {structure} = app;
    if(!structure.inspector) {
      return <div style={{fontSize: 14}} >
        <h3 style={{marginBottom: 20}} >Debugger</h3>
        <p>Please restart this application with the --inspect option, like below.</p>
        <p>pandora start --inspect</p>
      </div>;
    }
    return <div>
      <h3 style={{marginBottom: 20}} >Debugger</h3>
      {processes ? <ProcessTree appName={this.appName} processes={processes} extPart={(process) => {
        const debugUrl = '/chrome-devtools/inspector.html?experiments=true&v8only=true&ws=' + location.host + '/debugger-proxy/' + app.appName + '/' + process.pid;
        return <a target="_blank" href={debugUrl} onClick={() => {
          open(debugUrl);
        }} ><Button type="primary" size="small" style={{marginLeft: 10}} >Inspect</Button></a>
      }} /> : null}
    </div>;
  }

}
