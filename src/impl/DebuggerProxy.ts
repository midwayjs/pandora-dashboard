
import Dashboard from '../Dashboard';
import urllib = require('urllib');
import {Server as WSServer} from 'ws';
import * as WebSocket from 'ws';
import {Actuator} from './Actuator';


export class DebuggerProxy {

  app: Dashboard;
  wss: WSServer;
  constructor(app) {
    this.app = app;
    this.wss = new WSServer({ noServer: true });
  }

  setup () {

    this.app.server.on('upgrade', (request, socket, head) => {

      const regRes = /^\/debugger-proxy\/([^\/]*)\/([^\/]*)/.exec(request.url);
      if(!regRes) {
        return;
      }
      socket.wsHasBeenTaken = true;

      const appName = regRes[1];
      const pid = parseInt(regRes[2], 10);

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.handleConnection(appName, pid, ws).catch((error) => {
          ws.terminate();
          throw error;
        }).catch(console.error);
      });
    });

  }

  async handleConnection(appName, pid, ws) {

    ws.pause();

    const res = await Actuator.get('/process?appName=' + encodeURIComponent(appName));
    if(!res.success) {
      throw new Error(res.message);
    }
    const processes = res.data;

    let process;
    for(const item of processes) {
      if(item.pid === pid) {
        process = item;
      }
    }

    if(!process) {
      throw new Error('Cannot found process [ pid: ' + pid + ' ]');
    }

    const debugPort = process.debugPort;

    const listUrl = `http://127.0.0.1:${debugPort}/json/list`;
    const listRes = await urllib.request(listUrl, { timeout: 5000, dataType: 'json' });
    if(!listRes.data || !listRes.data.length) {
      throw new Error('Cannot found any instance at ' + listUrl);
    }
    const uuid = listRes.data[0].id;
    const wsUrl = `ws://127.0.0.1:${debugPort}/${uuid}`;
    console.log(wsUrl);

    const targetWs = new WebSocket(wsUrl);
    targetWs.on('open', () => {
      ws.resume();
    });

    ws.on('message', function (data) {
      try {
        targetWs.send(data);
      } catch (err) {
        console.error(err);
      }
    });

    targetWs.on('message', function(data) {
      try {
        ws.send(data);
      } catch (err) {
        console.error(err);
      }
    });

    const close = () => {
      try {
        ws.close();
      } catch(err) { }
      try {
        targetWs.close();
      } catch(err) { }
    };
    targetWs.on('error', close);
    targetWs.on('close', close);
    ws.on('close', close);
    ws.on('error', close);

  }

}
