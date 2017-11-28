import {WebServer} from './WebServer';
import {Home} from './impl/Home';
import {Static} from './impl/Static';

export default class Dashboard extends WebServer {

  getRoutes() {
    return [ Static, Home ];
  }

  getPort() {
    const port: number = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 9081;
    const host: string = process.env.DASHBOARD_HOST || '127.0.0.1';
    return { port, host };
  }
}
