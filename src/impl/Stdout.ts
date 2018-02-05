import Dashboard from '../Dashboard';
import {Server as WSServer} from 'ws';
import {Actuator} from './Actuator';
import tailPkg = require('tail');
import readLastLines = require('read-last-lines');
const {Tail} = tailPkg;


export class Stdout {

  app: Dashboard;
  wss: WSServer;
  constructor(app) {
    this.app = app;
    this.wss = new WSServer({ noServer: true });
  }

  setup () {

    this.app.server.on('upgrade', (request, socket, head) => {

      const regRes = /^\/stdout\/(.*)$/.exec(request.url);
      if(!regRes) {
        return;
      }
      socket.wsHasBeenTaken = true;

      const appName = regRes[1];
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.handleConnection(appName, ws).catch((error) => {
          ws.send(JSON.stringify({ type: 'error', error: String(error) }));
          ws.terminate();
        }).catch(console.error);
      });
    });

  }

  async handleConnection(appName, ws) {

    const res = await Actuator.get('/info?appName=' + encodeURIComponent(appName));
    if(!res.success) {
      throw new Error(res.message);
    }
    const app = res.data;
    const introspection = app[0].data;
    const stdoutLogPath = introspection.stdoutLogPath;
    const lastLines = await readLastLines.read(stdoutLogPath, 100);
    const tail = new Tail(stdoutLogPath);
    ws.on('close', () => {
      tail.unwatch();
    });
    ws.send(JSON.stringify({ type: 'batch', content: lastLines }));
    tail.on('line', line => {
      ws.send(JSON.stringify({ type: 'line', content: line }));
    });
    tail.on('error', err => {
      console.error(err);
      ws.terminate();
    });

  }

}

