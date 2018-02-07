import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Pagination} from 'antd';
import {Link} from "react-router-dom";
import moment from "moment";
import {displayDuration, getTraceStatus} from "./utils/Common";

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
        title: 'Trace',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => {

          const statusPlan = getTraceStatus(record) || {};
          const {color, label} = statusPlan;

          return <div>
            <div
              style={{
                color,
                paddingBottom: 5,
                fontSize: 14,
                fontWeight: 'bold'
              }} >
              <Link
                style={{ color }}
                to={`/application/${this.appName}/traceViewer/${record.traceId}`} target="_blank"
              >{label ? `[${label.join('] [')}] ` : null}{record.name}</Link>
            </div>
            <div style={{fontSize: 12, color: '#666'}} >Trace ID: {record.traceId}</div>
          </div>;

        }
      },
      {
        title: 'Duration',
        width: '100px',
        dataIndex: 'duration',
        key: 'duration',
        render: displayDuration
      },
      {
        title: 'Time',
        width: '180px',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render(ts) {
          return moment(parseInt(ts)).format('L LTS');
        }
      },
      {
        title: 'PID',
        dataIndex: 'pid',
        key: 'pid',
        width: '110px'
      },
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
