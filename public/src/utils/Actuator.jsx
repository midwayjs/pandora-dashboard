import axios from 'axios';
export class Actuator {
  static async get (path, params) {
    const resp = await axios.get('/actuator' + path, {params});
    if(!resp.data.success) {
      throw Error('Access Actuator API went wrong, course form server : ' + resp.data.message);
    }
    return resp.data.data;
  }
}
