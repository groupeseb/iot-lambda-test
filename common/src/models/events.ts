import * as yaml from 'js-yaml';
import fs from 'fs';

export class Events extends Array<{
  http: {
    path: string;
    method: 'get'|'put'|'post'|'delete'
    authorizer: unknown
    cors?:{
      origin: string
    }
    request: unknown
  }
}>{
  constructor() {
    super();

    try{
      this.push(...(yaml.load(fs.readFileSync('./events.yml', 'utf8')) as Events));
    } catch(_){
      console.log('events.yml not found');
    }

  }
}

export default new Events();
