import {Breadcrumb} from 'antd';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {ApplicationItem} from "./components/ApplicationItem";
import { Link } from 'react-router-dom';

export class Home extends Component {


  render () {

    const breadcrumb = <Breadcrumb>
        <Breadcrumb.Item><Link to="/" >Pandora.js</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>;


    return <div>
      <div style={{ margin: '16px 0' }} >
        {breadcrumb}
      </div>
      <div>

        <SimpleCube title="Pandora.js Information" >
          <Row style={{marginTop: 10}} >
            <Col span={10} style={styles.pandoraInfoCol} >
              <p><b>Node.js Version:</b> 8.8.8</p>
              <p><b>Pandora.js Version:</b> 1.0.0</p>
              <p><b>Daemon PID:</b> 88888</p>
              <p><b>Daemon Uptime:</b> 3 days 5 hours 3 minutes</p>
            </Col>
            <Col style={Object.assign({}, styles.pandoraInfoCol, {borderLeft: '1px solid #ddd', paddingLeft: 30})} span={14} >

              <p>
                <b>Loaded Global Configs:</b>
                <br/>
                <span style={{textIndent: 10, display: 'block'}} >
                  /home/admin/xxx.js, /dsfds.js, /sdfsdf.js
                </span>
              </p>

              <p>
                <b>Loaded Endpoints:</b>
                <br/>
                <span style={{textIndent: 10, display: 'block'}} >
                  error, health
                </span>
              </p>

              <p>
                <b>Loaded Reporters:</b>
                <br/>
                <span style={{textIndent: 10, display: 'block'}} >
                  files, open-falcon
                </span>
              </p>

            </Col>
          </Row>
        </SimpleCube>

        <SimpleCube title="Application List" >
          <div >
            <ApplicationItem/>
            <ApplicationItem/>
            <ApplicationItem/>
          </div>
        </SimpleCube>

      </div>
    </div>;


  }
}


const SimpleCube = (props) => {
  return <div style={{background: '#fff', padding: 24, minHeight: 200, marginBottom: 30, paddingBottom: 30}}>
    <h2 style={styles.title} >{props.title}</h2>
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
