import {WebServer} from './WebServer';

export default class Dashboard extends WebServer {
  setup() {
    const router = this.router;
    router.get('/', async (ctx) => {
      ctx.body = {
        success: true
      };
    });
  }
  getPort() {
    const port: number = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 9081;
    const host: string = process.env.DASHBOARD_HOST || '127.0.0.1';
    return { port, host };
  }
}
