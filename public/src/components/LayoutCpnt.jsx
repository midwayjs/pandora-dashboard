import React, { Component } from 'react';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { Link } from 'react-router-dom';

export class LayoutCpnt extends Component {
  render () {
    return <Layout style={{minHeight: '100vh', minWidth: 800, background: '#EEF1F4'}} >
      <Header style={{ position: 'fixed', zIndex: 99, width: '100%', minWidth: 800 , background: '#344eb9'}}>
        <Link to="/" ><h1 style={styles.title} >Pandora.js Dashboard</h1></Link>

        <div style={styles.starUs} >
          <span style={{fontSize: 14, marginRight: 5}} >Star me on GitHub: </span>
          <iframe
            style={{verticalAlign: 'middle', position: 'relative', top: 2}}
            src="https://ghbtns.com/github-btn.html?user=midwayjs&repo=pandora&type=star&count=true"
            frameBorder="0" scrolling="0" width="110px" height="30px"></iframe>
        </div>

      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        {this.props.children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Pandora.js
      </Footer>
    </Layout>

  }
}

const styles = {
  starUs: {
    color: '#fff',
    float: 'right',
    marginTop: 1
  },
  title: {
    marginRight: 3,
    float: 'left',
    color: '#fff'
  }
};
