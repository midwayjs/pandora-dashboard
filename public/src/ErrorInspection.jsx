import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Tag, Pagination} from 'antd';
import moment from "moment";

const PAGE_SIZE = 20;

export class ErrorInspection extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.items = null;
    this.state.count = null;
    this.state.pageNumber = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchError(1).catch(alert);
  }

  async fetchError(pageNumber) {
    const {count, items} = await Actuator.get('/error', {
      appName: this.appName,
      // by: 'date', // nerver use
      order: 'DESC',
      offset: (pageNumber - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    });
    this.setState({count, items, pageNumber});
  }

  renderPage () {

    const {count, items, pageNumber} = this.state;
    if(!items) {
      return null;
    }

    return <div>
      <h3 style={{marginBottom: 20}} >Recent Errors</h3>

      {items.length ? (
        items.map((error, idx) => {
          return <SingleMsg error={error} key={idx} />
        })
      ) : (
        <p style={{textAlign: 'center', padding: 40}} >Empty</p>
      )}

      <div style={{marginTop: 30, textAlign: 'center'}} >
        <Pagination total={count} pageSize={PAGE_SIZE} current={pageNumber} onChange={(pageNumber) => {
          this.fetchError(pageNumber).catch(alert);
        }}/>
      </div>
    </div>
  }

}

const SingleMsg = (props) => {
  const {error} = props;

  const title = <div style={{fontSize: 12, marginBottom: 10}} >
    <Tag color="pink">{error.errType}</Tag>
    &nbsp;
    <b>Time:</b> {moment(error.timestamp).format('L LTS')}
    &nbsp;&nbsp;&nbsp;&nbsp;
    <b>PID:</b> {error.pid}
    &nbsp;&nbsp;&nbsp;&nbsp;
    <b>Path:</b> {error.path}
  </div>;

  return (
    <Card bodyStyle={{padding: '15px 20px'}} style={{marginBottom: 15, borderColor: '#ddd', borderRadius: 0}} >
      {title}
      <div><b style={{marginRight: 5}} >Error Message: </b><span>{error.message}</span></div>
      {error.stack ? (
        <div style={{overflow: 'hidden', lineHeight: 1.5, marginTop: 5}} >
          <b style={{marginRight: 5, float: 'left'}} >Stack: </b>
          <div style={{ float: 'left', whiteSpace: 'pre-wrap' }} >
            {error.stack}
          </div>
        </div>
      ) : null}
    </Card>
  )
};

