import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
export class Trace extends ApplicationPage {

  renderPage () {

    return <div style={{textAlign: 'center'}} >{JSON.stringify(this.props.match)}</div>

  }

}
