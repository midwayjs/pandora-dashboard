import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Row, Col, Tag} from 'antd';
import {ascendDimension} from "./utils/Common";

export class Metrics extends ApplicationPage {

  constructor (props) {
    super(props);
    this.state.displayList = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchMetrics().catch(alert);
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

      <h3 style={{marginBottom: 20}} >Metrics ( auto refresh for every 10 seconds )</h3>

      {
        displayList.map((single, idx) => {

          const name = single.group.replace(/^.{1}/, (firstChar) => firstChar.toUpperCase());

          return <div key={idx} >
            <h3 style={{margin: '30px 0 15px 0'}} >Group: {name} </h3>
            {ascendDimension(single.metrics, 4).map((row, idx) => {
              return <Row gutter={16} key={idx} >
                {
                  row.map((metric, idx) => {
                    return <Col span={6} key={idx} >
                      <InstantaneousValue metric={metric} />
                    </Col>

                  })
                }
              </Row>
            })}
          </div>

        })
      }

    </div>

  }

}

const InstantaneousValue = (props) => {
  const {metric} = props;
  const tagKeys = Object.keys(metric.tags);
  return (
    <Card bodyStyle={{padding: '15px 20px 17px 20px'}} style={{marginBottom: 16, borderColor: '#ddd', borderRadius: 0}} >
      <div style={{fontSize: 26, marginBottom: 10, marginLeft: 7, lineHeight: 1.1}} >{displayValue(metric.value)}</div>
      <div>
        <Tag color="green" >{metric.metric.toString()}</Tag>
      </div>
      {
        tagKeys.length ? (
          <div style={{marginTop: 5}} >
            {
              tagKeys.map((key) => {
                const value = metric.tags[key];
                return <Tag key={key} style={{marginTop: 5}} >{key.toString()}: {displayValue(value)}</Tag>
              })
            }
          </div>
        ) : null
      }
    </Card>
  )
};


function displayValue(value) {
  return typeof value === 'string' || typeof value === 'number'
    ? value : JSON.stringify(value);
}
