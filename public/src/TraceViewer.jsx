import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Tag, Tooltip} from 'antd';
import {SpanCostIndicator} from "./components/SpanCostIndicator";
import {displayDuration, displayValue} from "./utils/Common";
import moment from "moment";

export class TraceViewer extends ApplicationPage {

  constructor(props) {
    super(props);
    this.state.trace = null;
  }

  get traceId () {
    return this.props.match.params.traceId;
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchTrace().catch(alert);
  }

  async fetchTrace() {
    const trace = await Actuator.get('/trace/' + this.traceId, {
      appName: this.appName
    });
    this.setState({trace});
  }

  renderPage () {

    const {trace} = this.state;
    if(!trace) {
      return null;
    }

    const columns = [
      {
        title: 'Span ID',
        dataIndex: 'context.spanId',
        key: 'spanId',
        width: '20%'
      },
      {
        title: 'Operation Name',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        render: (text) => {
          return <Tag color="green" >{text}</Tag>

        }
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        width: '35%',
        render: (tags) => {
          const tagKeys = Object.keys(tags);
          if(!tags || !tagKeys.length) {
            return null;
          }
          const eleTags = tagKeys.map((key, idx) => {
            const value = tags[key].value;
            const text = `${key}: ${displayValue(value)}`;
            const eleTag = <Tag title={text} style={{
              marginBottom: 6, whiteSpace: 'nowrap',
              textOverflow: 'ellipsis', overflow: 'hidden',
              maxWidth: '49%'
            }} >{text}</Tag>;
            return <Tooltip key={idx} placement={'top'} trigger={'hover'} title={text} onClick={() => {
              prompt('Tag: ' + key, displayValue(value));
            }} >
              {eleTag}
            </Tooltip>;
          });
          return <div style={{maxHeight: 60, overflow: 'auto', overflowX: 'hidden', maxWidth: 'calc(100vw/3)'}} >
            {eleTags}
          </div>;
        }
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        width: '10%',
        render: displayDuration
      },
      {
        width: 'auto',
        title: 'Timeline',
        key: 'timeline',
        render: (_, record) => {
          return <SpanCostIndicator style={{marginRight: 10}} start={record.timestamp - trace.timestamp} duration={record.duration} total={trace.duration}  />
        }
      }
    ];


    const tree = [attachChildren(trace.spans[0], trace.spans)];

    return <div>
      <h2 style={{marginBottom: 14}} >Trace Viewer</h2>
      <div style={{marginBottom: 18}} >
        <Tag style={styles.majorTag} color="108ee9" >TraceId: {this.traceId}</Tag>
        <Tag style={styles.majorTag} color="108ee9" >Transaction: {trace.name}</Tag>
        <Tag style={styles.majorTag} color="108ee9" >PID: {trace.pid}</Tag>
        <Tag style={styles.majorTag} color="108ee9" >Duration: {displayDuration(trace.duration)}</Tag>
        <Tag style={styles.majorTag} color="108ee9" >Time: {moment(trace.timestamp).format('L LTS')}</Tag>
        </div>
      <Table rowKey="rowKey" indentSize={10} columns={columns} dataSource={tree} pagination={false} />
    </div>;

  }

}

function attachChildren (lead, spans) {
  const spanId = lead.context.spanId;
  const children = [];
  lead.rowKey = spanId;
  for(const span of spans) {
    if(span.context.parentId && span.context.parentId === spanId) {
      attachChildren(span, spans);
      children.push(span);
    }
  }
  if(children.length) {
    lead.children = children;
  }
  return lead;
}

const styles = {
  majorTag: {
    marginBottom: 6
  }
};
