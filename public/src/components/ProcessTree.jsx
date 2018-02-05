import React from 'react';
import {Tree, Tag} from 'antd';
import {displayDuration, makeProcessTree} from '../utils/Common';
const { TreeNode } = Tree;
export const ProcessTree = (props) => {
  const {appName, processes} = props;
  const leads = makeProcessTree(processes);
  return <Tree defaultExpandAll={true} showLine >
    <TreeNode title={`[Application] ${appName}`} key="0-0">
      {subTreeWithoutLead({process: {children: leads}}, props)}
    </TreeNode>
  </Tree>;
};

const subTreeWithoutLead = (node, props) => {
  const process = node.process;
  const children = process.children;
  if(!children) {
    return null;
  }
  return children.map((process) => {

    const span = <span style={{whiteSpace: 'normal', display: 'block', paddingRight: 20}} >
      <Tag style={{float: 'left', marginTop: -2}} >PID: {process.pid}</Tag>
      Process Name: {process.processName} / Uptime: {displayDuration(process.uptime * 1000)} / CPU Usage: {process.cpu}% / Memory: {(process.memory / 1024 / 1014).toFixed(2)}MB{props.extPart && props.extPart(process)}</span>;

    return <TreeNode title={span} key={process.pid} >
      {subTreeWithoutLead({process}, props)}
    </TreeNode>
  });
};

