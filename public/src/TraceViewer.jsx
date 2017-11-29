import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Table, Tag} from 'antd';
import {SpanCostIndicator} from "./components/SpanCostIndicator";

const timelineWitdh = 400;

export class TraceViewer extends ApplicationPage {

  get traceId () {
    return this.props.match.params.traceId;
  }

  renderPage () {

    const columns = [
      {
        title: 'Span ID',
        dataIndex: 'spanId',
        key: 'spanId'
      },
      {
        title: 'Operation Name',
        dataIndex: 'operationName',
        key: 'operationName',
        render: (text) => {
          return <Tag color="green" >{text}</Tag>

        }
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        render: (tags) => {

          if(!tags || !tags.length) {
            return null;
          }

          return tags.map((tag, idx) => {

            return <Tag key={idx} >{tag.key}: {tag.value}</Tag>

          });

        }
      },
      {
        width: timelineWitdh,
        title: 'Timeline',
        key: 'timeline',
        render: (_, recoard) => {
          return <SpanCostIndicator style={{width: timelineWitdh - 30}} start={recoard.startTime} duration={recoard.duration} total={3000}  />
        }
      }
    ];



    const cell = {
      spanId: 'nope-nope-nope',
      operationName: 'HTTP GET',
      startTime: 55,
      duration: 1200,
      tags: [
        { key: 'tag1', value: 'value1' },
        { key: 'tag1', value: 'value1' },
        { key: 'tag1', value: 'value1' },
      ]
    };

    let y = 0;

    const data = [
      Object.assign({}, cell, {
        key: y++,
        children: [
          Object.assign({}, cell, {
            key: y++,
            children: [
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
            ]
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
        ]
      }),
      Object.assign({}, cell, {
        key: y++,
        children: [
          Object.assign({}, cell, {
            key: y++,
            children: [
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
            ]
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
        ]
      }),
      Object.assign({}, cell, {
        key: y++,
        children: [
          Object.assign({}, cell, {
            key: y++,
            children: [
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
              Object.assign({}, cell, {key: y++}),
            ]
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
          Object.assign({}, cell, {
            key: y++,
          }),
        ]
      }),
    ];


    return <div>
      <h2 style={{marginBottom: 10}} >Trace Viewer  </h2>
      <div style={{marginBottom: 25}} >
        <Tag color="108ee9" >TraceId: {this.traceId}</Tag>
        <Tag color="108ee9" >Transaction: HTTP GET /index</Tag>
        <Tag color="108ee9" >Cost: 120 seconds</Tag>
        <Tag color="108ee9" >Time: 3 minutes ago</Tag>
        </div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>;

  }

}
