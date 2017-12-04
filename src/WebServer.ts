import * as Koa from 'koa';
import * as Router from 'koa-router';

import {createServer, Server} from 'http';

const methods = ['get', 'put', 'post', 'patch', 'delete', 'del'];

export abstract class WebServer extends Koa {

  server: Server;
  router: any;

  pandoraContext;

  constructor(pandoraContext) {
    super();
    this.pandoraContext = pandoraContext;
    this.router = new Router;
    this.server = createServer(this.callback());
    this.setup();
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());
  }

  setup() {
    const router = this.router;
    const routes: any[] = this.getRoutes();
    for(const Route of routes) {
      const routePath = Route.route;
      const route = new Route(this);
      if(route.setup) {
        route.setup();
      }
      for(const method of methods) {
        if(route[method]) {
          router[method](routePath, route[method].bind(route));
        }
      }
    }
  }

  abstract getRoutes();
  abstract getPort(): {port: number, host: string};

  async start() {
    const {port, host} = this.getPort();
    await new Promise((resolve) => {
      this.server.listen({ port, host }, resolve);
    });
  }

  async stop() {
    await new Promise((resolve) => {
      this.server.close(resolve);
    });
  }

}
