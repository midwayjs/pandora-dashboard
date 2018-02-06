import {WebServer} from './WebServer';
import {Home} from './impl/Home';
import {Static} from './impl/Static';
import {Actuator} from './impl/Actuator';
import {Stdout} from './impl/Stdout';
import {ChromeDevtools} from './impl/ChromeDevtools';
import {DebuggerProxy} from './impl/DebuggerProxy';
import * as auth from 'basic-auth';

export default class Dashboard extends WebServer {

  setup() {
    const PANDORA_DASHBOARD_AUTH = process.env.PANDORA_DASHBOARD_AUTH;
    let authName, authPass;
    if(typeof PANDORA_DASHBOARD_AUTH === 'string') {
      [authName, authPass] = PANDORA_DASHBOARD_AUTH.split(':');
    }
    if(authName && authPass) {
      this.use( async (ctx, next) => {
        const credentials = auth(ctx.req);
        if (!credentials || credentials.name !== authName || credentials.pass !== authPass) {
          ctx.status = 401;
          ctx.set('WWW-Authenticate', 'Basic');
          ctx.body = 'Access denied';
        } else {
          await next();
        }
      });
    }
    super.setup();
  }

  getRoutes() {
    return [ ChromeDevtools, DebuggerProxy, Stdout, Actuator, Static, Home ];
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
    // this.echoTestErrors().catch(console.error);
  }

  async echoTestErrors () {
    for(let idx = 0; idx < 100; idx++) {
      await new Promise(resolve => {
        setTimeout(resolve, 200);
      });
      console.error(new Error('Test Errror ' + (idx + 1)));
    }
  }

}
