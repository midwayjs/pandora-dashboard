import {State} from "../consts";

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
