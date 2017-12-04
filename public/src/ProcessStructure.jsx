import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Tabs, Tree, Tag} from 'antd';
import {PreView} from "./components/PreView";
import {displayDuration, makeProcessTree} from "./utils/Common";
const { TabPane } = Tabs;
const { TreeNode } = Tree;

export class ProcessStructure extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.processes = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchProcess().catch(alert);
  }

  async fetchProcess () {
    const processes = await Actuator.get('/process', {
      appName: this.appName
    });
    this.setState({processes});
  }

  renderPage () {

    const {processes} = this.state;

    return <div>
      <h3 style={{marginBottom: 10}} >Process Structures</h3>
      <Tabs defaultActiveKey="1" >
        <TabPane tab="Process Tree" key="1">
          {processes ? <ProcessTree appName={this.appName} processes={processes} /> : null}
        </TabPane>
        <TabPane tab="Static Representation" key="2">
          <PreView logs={[{
              key: -1,
              content: JSON.stringify(this.app.complex, null, 2)
            }]} style={{minHeight: '60vh'}} />
        </TabPane>
      </Tabs>
    </div>

  }

}

const ProcessTree = (props) => {
  const {appName, processes} = props;
  const leads = makeProcessTree(processes);
  return <Tree defaultExpandAll={true} showLine >
    <TreeNode title={`[Application] ${appName}`} key="0-0">
      {subTreeWithoutLead({process: {children: leads}})}
    </TreeNode>
  </Tree>;
};

const subTreeWithoutLead = (props) => {
  const process = props.process;
  const children = process.children;
  if(!children) {
    return null;
  }
  return children.map((process) => {
    const span = <span style={{whiteSpace: 'normal', display: 'block', paddingRight: 20}} >
      <Tag style={{float: 'left', marginTop: -2}} >PID: {process.pid}</Tag>
      Process Name: {process.processName} / Uptime: {displayDuration(process.uptime * 1000)} / CPU Usage: {process.cpu}% / Memory: {(process.memory / 1024 / 1014).toFixed(2)}MB</span>;

    return <TreeNode title={span} key={process.pid} >
      {subTreeWithoutLead({process})}
    </TreeNode>
  });
};