import {Breadcrumb} from 'antd';
import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {ApplicationItem} from "./components/ApplicationItem";
import {Link} from 'react-router-dom';
import {Actuator} from "./utils/Actuator";
import {safe} from "./utils/Common";

export class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appList: null,
      daemonInfo: null
    }
  }

  componentDidMount() {
    this.fetchAppList().catch(alert);
    this.fetchDaemonInfo().catch(alert);
  }

  async fetchDaemonInfo() {
    const daemonInfo = await Actuator.get('/daemon');
    this.setState({daemonInfo});
  }

  async fetchAppList() {
    const infoRes = await Actuator.get('/info');
    const appList = [];

    for(const appName of Object.keys(infoRes)) {
      const record = infoRes[appName];
      const endPoint = {};
      record[0].data.endPoint = endPoint;
      for(const item of record) {
        endPoint[item.key] = item.data;
      }
      appList.push(record[0].data);
    }
    const appList2nd = appList.sort((a, b) => {
      return a.uptime - b.uptime;
    });

    this.setState({appList: appList2nd});
  }

  render() {

    const breadcrumb = <Breadcrumb>
      <Breadcrumb.Item><Link to="/">Pandora.js</Link></Breadcrumb.Item>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
    </Breadcrumb>;


    return (
      <div>
        <div style={{margin: '16px 0'}}>
          {breadcrumb}
        </div>
        <div>

          <SimpleCube title="Pandora.js Information">
            <PandoraInfo daemonInfo={this.state.daemonInfo}/>
          </SimpleCube>

          <SimpleCube title="Application List">
            <AppList appList={this.state.appList}/>
          </SimpleCube>

        </div>
      </div>
    );


  }
}

const AppList = (props) => {

  const {appList} = props;

  return <div style={{minHeight: 300}} >
    {appList && appList.map((app) => {
      return <ApplicationItem key={app.appName} app={app} />
    })}
  </div>

};

const PandoraInfo = (props) => {

  const {daemonInfo} = props;

  return <Row style={{marginTop: 10}}>
    <Col span={10} style={styles.pandoraInfoCol}>
      <p><b>Node.js Version:</b> {safe(() => daemonInfo.versions.node, '-')}</p>
      <p><b>Pandora.js Version:</b> {safe(() => daemonInfo.versions.pandora, '-')}</p>
      <p><b>Daemon PID:</b> {safe(() => daemonInfo.pid, '-')}</p>
      <p><b>Daemon Uptime:</b> {safe(() => daemonInfo.uptime + ' seconds', '-')}</p>
      <p><b>Daemon WorkDir:</b> {safe(() => daemonInfo.cwd , '-')}</p>
    </Col>
    <Col style={Object.assign({}, styles.pandoraInfoCol, {borderLeft: '1px solid #ddd', paddingLeft: 30})} span={14}>

      <p>
        <b>Loaded Global Configs:</b>
        <br/>
        <span style={{textIndent: 10, display: 'block'}}>{safe(() => daemonInfo.loadedGlobalConfigPaths.join(', ') , '-')}</span>
      </p>

      <p>
        <b>Loaded Endpoints:</b>
        <br/>
        <span style={{textIndent: 10, display: 'block'}}>{safe(() => daemonInfo.loadedEndPoints.join(', ') , '-')}</span>
      </p>

      <p>
        <b>Loaded Reporters:</b>
        <br/>
        <span style={{textIndent: 10, display: 'block'}}>{safe(() => daemonInfo.loadedReporters.join(', ') , '-')}</span>
      </p>

    </Col>
  </Row>;
};


const SimpleCube = (props) => {
  return <div style={{background: '#fff', padding: 24, minHeight: 200, marginBottom: 30, paddingBottom: 30}}>
    <h2 style={styles.title}>{props.title}</h2>
    {props.children}
  </div>
};

const styles = {
  pandoraInfoCol: {
    padding: '0 10px',
    lineHeight: '2'
  },
  title: {
    borderBottom: '1px solid #ddd',
    paddingBottom: 15,
    marginBottom: 30
  }
};
