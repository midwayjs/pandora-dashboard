import Dashboard from '../Dashboard';
import {dirname, join} from 'path';
import staticCache = require('koa-static-cache');
import * as fs from 'fs';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);


export class ChromeDevtools {

  app: Dashboard;
  constructor(app) {
    this.app = app;
  }

  setup () {

    this.app.router.get('/chrome-devtools/InspectorBackendCommands.js', async (ctx) => {
      ctx.type = 'application/javascript';
      ctx.body = await readFile(join(__dirname, '../../resource/chrome-devtools/InspectorBackendCommands.js'));
    });

    this.app.router.get('/chrome-devtools/SupportedCSSProperties.js', async (ctx) => {
      ctx.type = 'application/javascript';
      ctx.body = await readFile(join(__dirname, '../../resource/chrome-devtools/SupportedCSSProperties.js'));
    });

    this.app.use(staticCache({
      dir: dirname(require.resolve('chrome-devtools-frontend/front_end/inspector.html')),
      prefix: '/chrome-devtools'
    }));

  }

}
