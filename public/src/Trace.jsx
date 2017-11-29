import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Pagination} from 'antd';
import {Link} from "react-router-dom";
export class Trace extends ApplicationPage {

  renderPage () {

    const columns = [
      {
        title: 'Trace ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Transaction',
        dataIndex: 'transaction',
        key: 'transaction'
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost'
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          return <Link to={`/application/${this.appName}/traceViewer/${record.id}`} target="_blank" >Take a look</Link>
        }
      }
    ];

    const cell = {
      id: 'nope-nope-nope',
      time: '3 minutes ago',
      cost: '120 seconds',
      transaction: 'HTTP GET /index'
    };

    const data = [
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
      cell,
    ];

    return <div>
      <h3 style={{marginBottom: 20}} >Recent 1000 Traces</h3>
        <Table columns={columns} dataSource={data} pagination={false} />
      <div style={{marginTop: 30, textAlign: 'center'}} >
        <Pagination defaultCurrent={1} total={500} />
      </div>
    </div>;

  }

}
