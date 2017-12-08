import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Pagination} from 'antd';
import {Link} from "react-router-dom";
import moment from "moment";
import {displayDuration} from "./utils/Common";

const PAGE_SIZE = 20;

export class Trace extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.items = null;
    this.state.count = null;
    this.state.pageNumber = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchTrace(1).catch(alert);
  }

  async fetchTrace(pageNumber) {
    const {count, items} = await Actuator.get('/trace', {
      appName: this.appName,
      // by: 'timestamp',  // never use
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

    const columns = [
      {
        title: 'Trace ID',
        dataIndex: 'traceId',
        key: 'traceId'
      },
      {
        title: 'Transaction',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'PID',
        dataIndex: 'pid',
        key: 'pid'
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render: displayDuration
      },
      {
        title: 'Time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render(ts) {
          return moment(ts).format('L LTS');
        }
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          return <Link to={`/application/${this.appName}/traceViewer/${record.traceId}`} target="_blank" >Take a look</Link>
        }
      }
    ];

    return <div>
      <h3 style={{marginBottom: 20}} >Recent Traces</h3>
        <Table rowKey="traceId" columns={columns} dataSource={items} pagination={false} />
      <div style={{marginTop: 30, textAlign: 'center'}} >
        <Pagination total={count} pageSize={PAGE_SIZE} current={pageNumber} onChange={(pageNumber) => {
          this.fetchTrace(pageNumber).catch(alert);
        }}/>
      </div>
    </div>;

  }

}
