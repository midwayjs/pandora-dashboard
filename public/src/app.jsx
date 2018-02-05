import 'regenerator-runtime/runtime';
import './app.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import {LayoutCpnt} from './components/LayoutCpnt';
import {Home} from './Home';
import {Stdout} from './Stdout';
import {ProcessStructure} from "./ProcessStructure";
import {ErrorInspection} from "./ErrorInspection";
import {Metrics} from "./Metrics";
import {Trace} from "./Trace";
import {TraceViewer} from "./TraceViewer";
import {Debugger} from './Debugger';

class ScrollToTop extends Component {

  componentWillReceiveProps(nextProps) {
    if(this.props.location.pathname === '/' || nextProps.location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return null;
  }

}

ReactDOM.render((
  <BrowserRouter >
    <LayoutCpnt>
      <Route component={ScrollToTop} />
      <Route exact path='/' component={Home} ></Route>
      <Route path='/application/:appName/:methodName(stdout)' component={Stdout} ></Route>
      <Route path='/application/:appName/:methodName(processStructure)' component={ProcessStructure} ></Route>
      <Route path='/application/:appName/:methodName(errorInspection)' component={ErrorInspection} ></Route>
      <Route path='/application/:appName/:methodName(metrics)' component={Metrics} ></Route>
      <Route path='/application/:appName/:methodName(trace)' component={Trace} ></Route>
      <Route path='/application/:appName/:methodName(traceViewer)/:traceId' component={TraceViewer} ></Route>
      <Route path='/application/:appName/:methodName(debugger)' component={Debugger} ></Route>
    </LayoutCpnt>
  </BrowserRouter>
), document.getElementById('DUMP_APP_HERE'));

