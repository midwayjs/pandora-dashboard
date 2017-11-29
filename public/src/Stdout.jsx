import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {PreView} from "./components/PreView";

export class Stdout extends ApplicationPage {

  renderPage () {

    const content = `Pandora.js Dashboard started, open http://127.0.0.1:9081/
Pandora.js Dashboard started, open http://127.0.0.1:9081/
Patcher(98651): eggLogger hook enabled
Patcher(98651): eggLogger hook enabled
Patcher(98651): urllib hook enabled
Patcher(98651): urllib hook enabled
2017-11-29 15:46:15,661 INFO 98648 Application [appName = pandora-dashboard, processName = null dir = /Users/Allen/Works/midway6/pandora-dashboard, pid = 98650] started successfully!
Debug application start successful.`;

    return <div>
      <h3 style={{marginBottom: 20}} >Standard Output ( 1000 lines from bottom, auto refresh for every 10 seconds )</h3>
      <PreView defaultContent={content} style={{minHeight: '60vh'}} />

    </div>

  }

}
