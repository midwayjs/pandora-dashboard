import cp = require('mz/child_process');

export async function attachPPID (processes) {
  const relations = await getPPIDRelations();
  for(const process of processes) {
    if(!process.ppid) {
      process.ppid = relations.get(Number(process.pid));
    }
  }
  return processes;
}

export async function getPPIDRelations () {
  const stdout = await cp.exec('ps -A -o pid,ppid');
  const ps = stdout.toString().split('\n');
  // get rid of the header
  ps.shift();
  // get rid of the last empty line
  ps.pop();

  const relations: Map<number, number> = new Map;
  ps.forEach(line => {
    line = line.trim();
    const matches = line.match(/^(\d+)\s+(\d+)/);
    matches.shift();
    const [pid, ppid] = matches;
    relations.set(Number(pid), Number(ppid));
  });
  return relations;
}