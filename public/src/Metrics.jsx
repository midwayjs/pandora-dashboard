import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Row, Col, Tag, Tabs} from 'antd';
import {ascendDimension, displayValue, humanizeMetricValue, sortMetrics, sortMetricsGroups} from "./utils/Common";
const TabPane = Tabs.TabPane;

export class Metrics extends ApplicationPage {

  constructor (props) {
    super(props);
    this.state.displayList = null;
    this.interval = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchMetrics().then(() => {
      this.interval = setInterval(() => {
        this.fetchMetrics().catch(console.error);
      }, 10 * 1000)
    }).catch(alert);
  }

  componentWillUnmount() {
    if(this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async fetchMetrics() {
    const groups = await Actuator.get('/metrics/list');
    const groupNames = Object.keys(groups);
    const displayList = [];
    for(const group of groupNames) {
      const res = await Actuator.get('/metrics/' + group);
      displayList.push({
        group: group,
        metrics: res
      });
    }
    this.setState({displayList});
  }

  renderPage () {

    const {displayList} = this.state;
    if(!this.state.displayList) {
      return null;
    }

    return <div>

      <h3 style={{marginBottom: 20}} >Metrics instantaneous values ( auto refresh for every 10 seconds )</h3>

      <Tabs size="large" >
        {
          sortMetricsGroups(displayList).map((single, idx) => {
            const name = single.group.replace(/^.{1}/, (firstChar) => firstChar.toUpperCase());
            return <TabPane tab={'Group: ' + name} key={name} >
              <GroupContent single={single} idx={idx} />
            </TabPane>
          })
        }
      </Tabs>
    </div>

  }

}

const GroupContent = (props) => {

  const {single, idx} = props;

  if(single.group === 'node') {
    return <NodeGroup single={single} key={idx} />
  }

  return <div key={idx} >
    <GroupSubView metrics={single.metrics} />
  </div>
};



const NodeGroup = (props) => {
  const {single} = props;
  const {metrics} = single;
  const metricsSplitByPid = {};

  for(const one of metrics) {
    if(one.tags && one.tags.pid) {
      const pid = one.tags.pid;
      const list = metricsSplitByPid[pid] = metricsSplitByPid[pid] || [];
      list.push(one);
    } else {
      const list = metricsSplitByPid['other'] = metricsSplitByPid['other'] || [];
      list.push(one);
    }
  }

  return <div>
    <Tabs size="small" >
      {Object.keys(metricsSplitByPid).map((pid) => {
        const metricsForThisPid = metricsSplitByPid[pid];
        return <TabPane tab={pid === 'other' ? 'Other': `PID: ${pid}`} key={pid} >
          <GroupSubView metrics={metricsForThisPid} />
        </TabPane>
      })}
    </Tabs>
    </div>;
};

const GroupSubView = (props) => {

  const {metrics} = props;
  const obj = {};
  const order = [];

  for(const one of sortMetrics(metrics)) {
    const name = one.metric;
    const first2part = name.split('.').slice(0, -1).slice(0, 3).join('.');
    if(!obj[first2part]) {
      order.push(first2part);
      obj[first2part] = [];
    }
    const list = obj[first2part];
    list.push(one);
  }

  return <div>

    {
      order.map((name) => {

        return <div key={name} style={{marginTop: -5}} >
          <h3 style={{paddingBottom: 15, paddingTop: 5, paddingLeft: 2}} >🏆 Category: {name}</h3>

          {ascendDimension(sortMetrics(obj[name]), 3).map((row, idx) => {
            return <Row gutter={16} key={idx} >
              {
                row.map((metric, idx) => {
                  return <Col span={8} key={idx} >
                    <InstantaneousValue metric={metric} />
                  </Col>
                })
              }
            </Row>
          })}
        </div>;
      })
    }

  </div>;

};

const InstantaneousValue = (props) => {
  const {metric} = props;
  const tagKeys = Object.keys(metric.tags);
  return (
    <Card bodyStyle={{padding: '15px 10px 17px 20px'}} style={{marginBottom: 16, borderColor: '#ddd', borderRadius: 0}} >
      <div style={{fontSize: 26, marginBottom: 10, marginTop: 5, marginLeft: 7, lineHeight: 1.1}} >{humanizeMetricValue(metric)}</div>
      <div className="pandora-tag-namespace" >
        <Tag color="green" style={{marginTop: 5}} >{metric.metric.toString()}</Tag>
        {
          tagKeys.length ? tagKeys.map((key) => {
            const value = metric.tags[key];
            return <Tag key={key} style={{marginTop: 5}} >{key.toString()}: {displayValue(value)}</Tag>
          }) : null
        }
      </div>
    </Card>
  )
};


