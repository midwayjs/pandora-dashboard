import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Pagination} from 'antd';
import {Link} from "react-router-dom";
export class Trace extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.traces = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchTrace().catch(alert);
  }

  async fetchTrace() {
    const traces = await Actuator.get('/trace', {
      appName: this.appName
    });
    this.setState({traces});
  }

  renderPage () {

    const traces = this.state.traces;

    if(!traces) {
      return null;
    }

    console.log(traces);

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
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render(text) {
          return `${text} seconds`;
        }
      },
      {
        title: 'Time',
        dataIndex: 'date',
        key: 'date'
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
      <h3 style={{marginBottom: 20}} >Recent 1000 Traces</h3>
        <Table columns={columns} dataSource={traces} pagination={false} />
      <div style={{marginTop: 30, textAlign: 'center'}} >
        <Pagination defaultCurrent={1} total={500} />
      </div>
    </div>;

  }

}
