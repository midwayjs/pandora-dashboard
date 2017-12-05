import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {PreView} from "./components/PreView";
import throttle from 'lodash.throttle';

const BUFFER_SIZE = 1000;

export class Stdout extends ApplicationPage {


  constructor(props) {
    super(props);
    this.idx = 0;
    this.state.logs = [];
    this.state.loading = true;
    this.logs = [];
    this.syncState = throttle(() => {
      if(this.state.loading === true) {
        this.setState({ loading: false });
      }
      this.setState({ logs: this.logs });
    }, 700);
  }


  componentDidMount() {
    super.componentDidMount();
    this.startWs();
  }

  pushLog(log, shouldSplit) {

    if(shouldSplit) {
      const logs = log.split('\n').map(content => {
        return { key: ++this.idx, content }
      });
      if(logs.length && logs[logs.length - 1].content === '\n') {
        logs.shift();
      }
      this.logs = this.logs.concat(logs);
    } else {
      this.logs.push({ content: log, key: ++this.idx });
    }

    if(this.logs.length > BUFFER_SIZE) {
      this.logs = this.logs.slice(-100);
    }

    this.syncState();
  }

  startWs() {

    const wsURI = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/stdout/' + this.appName;
    const ws = new WebSocket(wsURI);

    ws.onmessage = (event) => {

      const msg = JSON.parse(event.data);

      if(msg.type === 'error') {
        alert(msg.error);
        return ws.close();
      }

      if(msg.type === 'batch') {
        this.pushLog(msg.content, true);
        return;
      }

      if(msg.type === 'line') {
        this.pushLog(msg.content, false);
        return;
      }

    };

  }

  renderPage () {

    const logs = this.state.logs;

    return <div>
      <h3 style={{marginBottom: 20}} >Standard Output</h3>
      {this.state.loading ? (
        <PreView logs={[{key: 'nope', content: 'Loading...' }]} style={{height: '60vh'}} />
      ) : (
        <PreView logs={logs} style={{height: '60vh'}} />
      )}
    </div>

  }

}
