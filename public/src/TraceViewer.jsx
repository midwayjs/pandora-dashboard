import React from 'react';
import {Actuator} from './utils/Actuator';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Tag, Tooltip, Modal} from 'antd';
import {SpanCostIndicator} from "./components/SpanCostIndicator";
import {
  attachChildrenTimeOrder, displayDuration, displayValue, getTraceStatus, isErrorSpan,
  orderTags
} from "./utils/Common";
import TextareaAutosize from 'react-autosize-textarea';
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

  renderTitle() {

    const {trace: record} = this.state;

    const statusPlan = getTraceStatus(record) || {};
    const {color, label} = statusPlan;

    return <div>
      <div style={{padding: '0 3px 7px 3px', fontSize: 24, fontWeight: 'bold'}} >
        <span style={{color}} >{label ? `[${label.join('] [')}] ` : null}{record.name}</span>
      </div>
      <div style={{marginBottom: 18, paddingLeft: 3}} >
        <span style={styles.majorTag} color="#2db7f5" >Trace ID: {this.traceId}</span>
        <span style={styles.majorTag} color="#2db7f5" >Host: {record.host}</span>
        <span style={styles.majorTag} color="#2db7f5" >PID: {record.pid}</span>
        <span style={styles.majorTag} color="#2db7f5" >Duration: {displayDuration(record.duration)}</span>
        <span style={styles.majorTag} color="#2db7f5" >Time: {moment(parseInt(record.timestamp)).format('L LTS')}</span>
      </div>
    </div>;
  }

  renderPage () {

    const {trace} = this.state;
    if(!trace) {
      return null;
    }

    const columns = [
      {
        title: 'Span',
        dataIndex: 'name',
        width: '240px',
        key: 'name',
        render: (_, record) => {
          return <div style={{display: 'inline-block', verticalAlign: 'top'}} >
            <div style={{paddingBottom: 5, fontSize: 14, fontWeight: 'bold'}} >
              Span: <Tag color={isErrorSpan(record) ? '#f50' : '#108ee9'} >{record.name}</Tag>
            </div>
            <div style={{fontSize: 12, color: '#666'}} >ID: {record.context && record.context.spanId}</div>
          </div>;
        }
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        width: '100px',
        render: displayDuration
      },
      {
        width: '25%',
        title: 'Timeline',
        key: 'timeline',
        render: (_, record) => {
          return <SpanCostIndicator
            color={isErrorSpan(record) ? '#f50' : null}
            style={{marginRight: 10}} start={record.timestamp - trace.timestamp} duration={record.duration} total={trace.duration} />;
        }
      },
      {
        title: 'Extension',
        dataIndex: 'tags',
        key: 'tags',
        width: '35%',
        render: (tags, record) => {
          let tagKeys = Object.keys(tags);
          if (!tags || !tagKeys.length) {
            return null;
          }
          tagKeys = orderTags(record.name, tagKeys);
          const eleTags = tagKeys.map((key, idx) => {
            const value = tags[key].value;
            const text = `${key}: ${displayValue(value)}`;
            const eleTag = <Tag title={text} style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis', overflow: 'hidden',
              maxWidth: '97%', marginBottom: 5
            }}>{text}</Tag>;
            return <Tooltip key={idx} placement={'bottom'} trigger={'hover'} title={text} onClick={() => {
              prompt('Tag: ' + key, displayValue(value));
            }} >
              {eleTag}
            </Tooltip>;
          });

          const logsOnClick = () => {

            const logs = record.logs;

            const logsEle = logs.map((log, idx) => {
              return <div key={idx} style={{marginBottom: 30}} >
                <h2>Record Time: {moment(parseInt(log.timestamp)).format('L LTS')}</h2>
                {
                  log.fields && log.fields.length ? (
                    log.fields.map((field, idx) => {
                      return <div key={idx} style={{marginTop: 17}} >
                        <h3 style={{marginBottom: 10}} >Key: {field.key}</h3>
                        <TextareaAutosize
                          style={{minHeight: 100, padding: 10, display: 'block', width: '100%', borderColor: '#999', fontSize: 13}}
                          defaultValue={field.value} />
                      </div>;
                    })
                  ) : null
                }
              </div>;
            });

            Modal.info({
              zIndex: 9999,
              width: '800px',
              okText: 'OK',
              content: <div style={{marginBottom: '-25px'}} >
                {logsEle}
              </div>
            });

          };

          const logsEle = record.logs && record.logs.length ? <div style={{marginBottom: 10}} >

            <a href="#" style={{fontWeight: 'bold'}} onClick={(e) => {
              e.preventDefault();
              logsOnClick();
            }} >
              See all logs ( including { record.logs.map((log) => {
              if (!log.fields || !log.fields.length) {
                return null;
              }
              return log.fields.map((field) => {
                return field.key;
              }).join(', ');
            }).filter((text) => !!text).join(', ') } )
            </a>

          </div> : null;

          return <div>
            {logsEle}
            <div className="pandoraTagWrapper" style={{
              marginBottom: '-4px',
              maxHeight: 54, overflow: 'auto', overflowX: 'hidden', maxWidth: 'calc(100vw/4)'}} >
              {eleTags}
            </div>
          </div>;
        }
      },
    ];

    const tree = [attachChildrenTimeOrder(trace.spans[0], trace.spans)];

    return <div className="trace-container-pandora" >
      <div style={{marginBottom: 25}} >
        {this.renderTitle()}
      </div>
      <Table defaultExpandAllRows={true} rowKey="rowKey" indentSize={10}
             columns={columns} dataSource={tree} pagination={false} />
    </div>;

  }

}

const styles = {
  majorTag: {
    color: '#666',
    marginBottom: 6,
    marginRight: 15,
    fontSize: 13
  }
};
