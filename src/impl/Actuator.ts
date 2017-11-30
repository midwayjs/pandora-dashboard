import Dashboard from '../Dashboard';
import urllib = require('urllib');
import {attachPPID} from '../utils/Common';

export class Actuator {

  static route = '/actuator/*';

  app: Dashboard;
  constructor(app) {
    this.app = app;
  }

  async get(ctx) {
    const url: string = /^\/actuator(.*)/.exec(ctx.request.url)[1];
    const remoteUrl = 'http://127.0.0.1:7002' + url;
    const res = await urllib.request(remoteUrl, {
      timeout: 5000,
      dataType: 'json'
    });
    if(/^\/process/.test(url) && res.data.success && res.data.data) {
      await attachPPID(res.data.data);
    }
    ctx.body = res.data;
  }

}