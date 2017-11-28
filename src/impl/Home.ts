import Dashboard from '../Dashboard';

export class Home {

  static route = '*';

  app: Dashboard;
  constructor(app) {
    this.app = app;
  }

  async get(ctx) {
    ctx.set('Content-Type', 'text/html');
    ctx.body = `
      <html>
        <head>
            <title>Pandora.js Dashboard</title>
        </head>
        <body>
            <div id="DUMP_APP_HERE" ></div>
            <script src="/public/bundle.js" ></script>
        </body>
      </htmljw>
    `;
  }

}