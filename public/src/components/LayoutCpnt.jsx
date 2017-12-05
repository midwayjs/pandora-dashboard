import React, { Component } from 'react';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { Link } from 'react-router-dom';

export class LayoutCpnt extends Component {
  render () {
    return <Layout style={{minHeight: '100vh', minWidth: 800, background: '#EEF1F4'}} >
      <Header style={{ position: 'fixed', zIndex: 99, width: '100%', minWidth: 800 , background: '#344eb9'}}>
        <Link to="/" ><h1 style={styles.title} >Pandora.js Dashboard</h1></Link>
        <a style={styles.starUs} target="_blank" rel="noopener noreferrer" href="https://github.com/midwayjs/pandora" >★ Star me on Github ★</a>
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
    marginRight: 5
  },
  title: {
    marginRight: 3,
    float: 'left',
    color: '#fff'
  }
};
