import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from './components/ApplicationPage';
import {Tabs} from 'antd';
import {PreView} from './components/PreView';
import {ProcessTree} from './components/ProcessTree';
const { TabPane } = Tabs;

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
              content: JSON.stringify(this.app.structure, null, 2)
            }]} style={{minHeight: '60vh'}} />
        </TabPane>
      </Tabs>
    </div>

  }

}

