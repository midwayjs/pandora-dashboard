import {State} from "../consts";
import Duration from "duration";

export function stateToDisplay (state) {
  state = State[state];
  state = state === 'complete' ? 'Running' : state.replace(/^.{1}/, (firstChar) => firstChar.toUpperCase());
  return state;
}

export const safe = (fn, x) => {
  try {
    return fn();
  } catch (err) {
    return x || null;
  }
};

export function makeProcessTree (processes) {
  const leads = [];
  for(const process of processes) {
    const parents = findByCertainKey(processes, 'pid', process.ppid);
    if(!parents) {
      expandChildren(processes, process);
      leads.push(process);
    }
  }
  return leads;
}

function expandChildren(processes, process) {
  const children = findByCertainKey(processes, 'ppid', process.pid);
  if(children) {
    process.children = children;
    for(const child of children) {
      expandChildren(processes, child);
    }
  }
}

function findByCertainKey (processes, key, eq) {
  const ret = [];
  for(const process of processes) {
    if((process[key] && process[key].toString()) === (eq && eq.toString())) {
      ret.push(process);
    }
  }
  if(!ret.length) {
    return null;
  }
  return ret;
}

export function ascendDimension(arr, n) {

  if(!arr.length) {
    return [];
  }

  const ret = [[]];

  for(const x of arr) {
    if(ret[ret.length - 1].length >= n) {
      ret.push([]);
    }
    ret[ret.length - 1].push(x);
  }

  return ret;

}
export function displayDuration(ms) {
  if(ms == null) {
    return null;
  }
  const duration = new Duration(new Date(0), new Date(ms));
  return duration.toString(1);
}

export function displayValue(value) {

  if(typeof value === 'string') {
    return value;
  }

  if(typeof value === 'number') {
    return value.toString().indexOf('.') > -1 ? value.toFixed(2) : value;
  }

  return JSON.stringify(value);
  
}

const metricsWeight = [
  ['system.load.', 1],
  ['system.cpu.', 2],
  ['system.mem.', 3],
  ['system.disk.', 4],
  ['system.tcp.', 5],
  ['node.v8.total_heap_size', 1],
  ['node.v8.total_heap_size_executable', 2],
  ['node.v8.total_physical_size', 3],
  ['node.v8.total_available_size', 4],
  ['node.v8.used_heap_size', 5],
  ['node.v8.heap_size_limit', 6],
  ['node.v8.malloced_memory', 7],
  ['node.v8.peak_malloced_memory', 8],
  ['node.v8.does_zap_garbage', 9],
  ['node.v8.new_space', 10],
  ['node.v8.old_space', 11],
  ['node.v8.code_space', 12],
  ['node.v8.large_object_space', 13],
];

export function sortMetrics(metrics) {
  return metrics.sort((a, b) => {
    const aw = getMetricsWeight(a.metric);
    const bw = getMetricsWeight(b.metric);
    return aw - bw;
  });
}

function getMetricsWeight(name) {
  for(const [prefix, weight] of metricsWeight) {
    if(name.startsWith(prefix)) {
      return weight;
    }
  }
  return Infinity;
}


export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function humanizeMetricValue(metric) {
  const name = metric.metric;
  const value = metric.value;
  if(typeof value === 'number') {
    if(name.startsWith('node.v8')) {
      return bytesToSize(metric.value);
    }
    if(name === 'system.disk.partition.total' || name === 'system.disk.partition.free') {
      return bytesToSize(metric.value * 1024);
    }
    if(name.startsWith('system.mem.') && metric.value > 1) {
      return bytesToSize(metric.value * 1024);
    }
    if(name.endsWith('bytes')) {
      return bytesToSize(metric.value);
    }
  }
  return displayValue(value);
}

export function attachChildren (lead, spans) {
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

export function attachChildrenTimeOrder(lead, spans) {

  const children1st = [];
  lead.rowKey = lead.context.spanId;
  for (let idx = 0, len = spans.length; idx < len; idx++) {
    if (idx === 0) {
      continue;
    }
    const span = spans[idx];
    span.rowKey = span.context.spanId;
    children1st.push({ order: idx, span });
  }

  const children2nd = children1st.sort(function(a, b) {
    if (a.span.timestamp < b.span.timestamp) return -1;
    if (a.span.timestamp > b.span.timestamp) return 1;
    return a.order - b.order;
  });

  const children3rd = children2nd.map((wrapper) => {
    return wrapper.span;
  });

  if (children3rd.length) {
    lead.children = children3rd;
  }
  return lead;

}

const tagsOrderMap = {
  'http': [
    'http.status_code',
    'http.url',
    'http.method',
    'error',
  ],
  'http-client': [
    'http.status_code',
    'http.hostname',
    'http.port',
    'http.path',
    'http.method',
    'error',
  ]
};
export function orderTags(type, tagKeys) {

  if (!tagsOrderMap.hasOwnProperty(type)) {
    return tagKeys;
  }
  const order = tagsOrderMap[type];

  const ret = [];

  for (const one of order) {
    if (tagKeys.indexOf(one) > -1) {
      ret.push(one);
    }
  }
  for (const key of tagKeys) {
    if (order.indexOf(key) < 0) {
      ret.push(key);
    }
  }

  return ret;

}

export function isErrorSpan(record) {
  return !!record.tags && record.tags.error && record.tags.error.value;
}

const SLOW_TRACE = 2;
const ERROR_TRACE = 8;
export function getTraceStatus(record) {
  const {status} = record;
  if (typeof status !== 'number') {
    return null;
  }
  let label = [];
  let color;


  if (status & SLOW_TRACE) {
    label.unshift('Slow');
    color = 'rgb(255, 145, 0)';
  }

  if (status & ERROR_TRACE) {
    label.unshift('Error');
    color = '#f50';
  }
  return {
    label: label.length ? label : null, color
  };
}

const metricsGroupWeights = {
  'node': 1,
  'error': 2,
  'system': 3,
  'nginx': 4,
  'http': 5,
}
export function sortMetricsGroups(groups) {
  return groups.sort((a, b) => {
    const aw = metricsGroupWeights[a.group] || Infinity;
    const bw = metricsGroupWeights[b.group] || Infinity;
    return aw - bw;
  });
}

