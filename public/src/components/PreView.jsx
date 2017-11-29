import React, { Component } from 'react';
export class PreView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      content: props.defaultContent
    }
  }

  setContent (content) {
    this.setState({content});
  }

  render () {

    const ownStyle = Object.assign({}, styles.container, this.props.style);

    return <div style={ownStyle} >
      <pre style={styles.pre} >
        {this.state.content}
      </pre>
    </div>

  }

}

const styles = {
  container: {
    background: '#000'
  },
  pre: {
    lineHeight: 1.8,
    padding: '12px 15px',
    color: '#fff',
    whiteSpace: 'pre-wrap'
  }
};