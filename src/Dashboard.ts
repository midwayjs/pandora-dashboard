import {WebServer} from './WebServer';
import {Home} from './impl/Home';
import {Static} from './impl/Static';
import {Actuator} from './impl/Actuator';
import {Stdout} from './impl/Stdout';

export default class Dashboard extends WebServer {

  getRoutes() {
    return [ Stdout, Actuator, Static, Home ];
  }

  getPort() {
    const port: number = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 9081;
    const host: string = process.env.DASHBOARD_HOST || '127.0.0.1';
    return { port, host };
  }

  async start () {
    await super.start();
    const {port, host} = this.getPort();
    console.log(`Pandora.js Dashboard started, open http://${host}:${port}/`);

  }

}
