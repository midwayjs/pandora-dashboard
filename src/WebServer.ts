import * as Koa from 'koa';
import * as Router from "koa-router";

import {createServer, Server} from 'http';

export abstract class WebServer extends Koa {

  server: Server;
  router: any;

  pandoraContext;

  constructor(pandoraContext) {
    super();
    this.pandoraContext = pandoraContext;
    this.router = new Router;
    this.setup();
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());
    this.server = createServer(this.callback());
  }

  abstract setup();
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
