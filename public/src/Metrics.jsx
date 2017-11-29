import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Row, Col, Tag} from 'antd';

export class Metrics extends ApplicationPage {

  renderPage () {

    return <div>

      <h3 style={{marginBottom: 20}} >Metrics ( auto refresh for every 10 seconds )</h3>

      <Row gutter={16}>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
        <Col span={6} >
          <InstantaneousValue/>
        </Col>
      </Row>

    </div>

  }

}

const InstantaneousValue = () => {

  return (
    <Card bodyStyle={{padding: '15px 20px 17px 20px'}} style={{marginBottom: 16, borderColor: '#ddd', borderRadius: 0}} >
      <div style={{fontSize: 26, marginBottom: 10, marginLeft: 7, lineHeight: 1.1}} >5.6</div>
      <div><Tag color="green" >system.load.1min</Tag></div>
    </Card>
  )

};
