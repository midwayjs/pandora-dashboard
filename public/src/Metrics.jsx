import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Row, Col} from 'antd';

export class Metrics extends ApplicationPage {

  renderPage () {

    return <div>

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
    <Card bodyStyle={{padding: '15px 20px'}} style={{marginBottom: 16, borderColor: '#ddd', borderRadius: 0}} >
      <p style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}} >5.6</p>
      <p>system.load.1min</p>
    </Card>
  )

};
