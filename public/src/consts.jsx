export const State = (function (State) {
  State[State["pending"] = 1] = "pending";
  State[State["complete"] = 2] = "complete";
  State[State["stopped"] = 3] = "stopped";
  return State;
})({});
