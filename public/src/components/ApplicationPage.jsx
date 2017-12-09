import React, { Component } from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
const {Sider, Content} = Layout;
import { Link } from 'react-router-dom';
import {Actuator} from '../utils/Actuator';
import {displayDuration, safe, stateToDisplay} from "../utils/Common";

const noSiderMethods = [
  'traceViewer'
];

const appsCached = {};

export class ApplicationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: appsCached[this.appName] || null
    };
  }

  componentDidMount() {
    this.fetchApp().catch(alert);
  }

  async fetchApp() {
    const infoRes = await Actuator.get('/info', {
      appName: this.appName
    });
    if(!infoRes || !infoRes.length) {
      throw new Error('Can\'t get an Application it named ' + this.appName);
    }
    const app = infoRes[0].data;
    appsCached[this.appName] = app;
    this.setState({app});
  }

  get app() {
    return this.state.app;
  }

  get appName() {
    return this.props.match.params.appName;
  }

  get methodName() {
    return this.props.match.params.methodName;
  }

  renderBreadcrumb() {
    const breadcrumb = <Breadcrumb>
      <Breadcrumb.Item><Link to="/" >Pandora.js</Link></Breadcrumb.Item>
      <Breadcrumb.Item><Link to="/" >Application</Link></Breadcrumb.Item>
      <Breadcrumb.Item>{this.appName}</Breadcrumb.Item>
    </Breadcrumb>;
    return breadcrumb;
  }

  renderPage() {
    return null;
  }

  renderOuter() {

    const methodName = this.methodName;

    const content = <Content style={{padding: '5px 15px 15px 30px'}} >
        {this.app ? this.renderPage() : null}
      </Content>;

    if(noSiderMethods.indexOf(methodName) > -1) {
      content.props.style.padding = '0 0 15px 0';
      return content;
    }

    return <Layout style={{background: '#fff'}} >
        <Sider width={200} style={{ background: '#fff' }} >
          <Menu style={{minHeight: '100%'}} selectedKeys={[methodName]}>
            <Menu.Item key="stdout">
              <Link to={`/application/${this.appName}/stdout`} >Standard Output</Link>
            </Menu.Item>
            <Menu.Item key="processStructure">
              <Link to={`/application/${this.appName}/processStructure`} >Process Structure</Link>
            </Menu.Item>
            <Menu.Item key="errorInspection">
              <Link to={`/application/${this.appName}/errorInspection`} >Error Inspection</Link>
            </Menu.Item>
            <Menu.Item key="metrics">
              <Link to={`/application/${this.appName}/metrics`} >Metrics</Link>
            </Menu.Item>
            <Menu.Item key="trace">
              <Link to={`/application/${this.appName}/trace`} >Trace</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {content}
      </Layout>

  }
  render () {

    const app = this.app;

    return <div>
      <div style={{ margin: '16px 0' }} >
        {this.renderBreadcrumb()}
      </div>

      <div style={{ background: '#fff', padding: '20px 24px', paddingBottom: 25, marginBottom: 30 }}>
          <h4 style={{fontWeight: 'bold', fontSize: 20, display: 'inline'}} >{safe(() => app.appName, '-')} [{safe(() => stateToDisplay(app.state), '-')}]</h4>
          <p style={{marginTop: 10}} >At location {safe(() => app.appDir)}</p>
          <p style={{marginTop: 10}} >
            <span style={styles.titleIndicator} >
                <b>Uptime:</b> {safe(() => displayDuration(app.uptime * 1000), '-')}
              </span>
            <span style={styles.titleIndicator} >
                <b>PID:</b> {safe(() => app.pids.join(', '))}
              </span>
            <span style={styles.titleIndicator} >
                <b>Restart Count:</b> {safe(() => app.restartCount, '-')}
              </span>
          </p>

      </div>
      <div style={{ background: '#fff', padding: 24, minHeight: 380, marginBottom: 30 }}>
        { this.renderOuter() }
      </div>
    </div>;
  }


}

const styles = {
  titleIndicator: {
    marginRight: 10
  },
}
