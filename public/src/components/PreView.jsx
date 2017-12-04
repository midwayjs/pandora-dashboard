import React, { Component } from 'react';
export class PreView extends Component {
  constructor(props) {
    super(props);
    this.autoScrollFlag = true;
  }

  componentWillUpdate() {
    const ownPreView = document.getElementById('ownPreView');
    this.autoScrollFlag = !!(ownPreView.scrollTop + ownPreView.clientHeight + 10 > ownPreView.scrollHeight);
  }

  componentDidUpdate() {
    if(this.autoScrollFlag) {
      const ownPreView = document.getElementById('ownPreView');
      ownPreView.scrollTop = ownPreView.scrollHeight;
    }
  }

  render() {
    const logs = this.props.logs || [];
    const ownStyle = Object.assign({}, styles.container, this.props.style);
    return <div style={ownStyle} id="ownPreView" >
      <pre style={styles.pre} >
        {logs.map((log) => {
          return <p key={log.key} >{log.content}</p>
        })}
      </pre>
    </div>
  }
}

const styles = {
  container: {
    background: '#000',
    overflow: 'auto'
  },
  pre: {
    lineHeight: 2,
    fontSize: 14,
    padding: '12px 15px',
    color: '#fff',
    whiteSpace: 'pre-wrap'
  }
};