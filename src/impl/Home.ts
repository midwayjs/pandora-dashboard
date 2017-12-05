import Dashboard from '../Dashboard';

export class Home {

  static route = '*';

  app: Dashboard;
  constructor(app) {
    this.app = app;
  }

  async get(ctx) {

    const publicBaseURL = process.env.DASHBOARD_PUBLIC_BASE_URL || '/public';

    ctx.set('Content-Type', 'text/html');
    ctx.body = `
      <html>
        <head>
            <title>Pandora.js Dashboard</title>
        </head>
        <body>
            <div id="DUMP_APP_HERE" ></div>
            <script src="${publicBaseURL}/bundle.js" ></script>
        </body>
      </htmljw>
    `;
  }

}