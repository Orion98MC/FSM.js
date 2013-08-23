function FSM(name) {
  this.state = null;
  this.transitions = {};
  this.enters = {};
  this.leaves = {};
  this.cycles = {};
  this.name = name || "no name";
  this.verbose = false;
}

var dispatch_async = null;
if ((typeof (window) !== 'undefined') && window.requestAnimationFrame) {
  dispatch_async = window.requestAnimationFrame;
} else {
  dispatch_async = function (callback) { setTimeout(callback, 0); }
}

FSM.prototype.vlog = function () {
  if (this.verbose) console.log.apply(null, arguments);
}

FSM.StateOptions = {
  'Initial': 0,
  'Enter': 1 << 0,
  'Cycle': 1 << 1
};

FSM.StateTransitionning = "__kFSMStateTransitionning__";

FSM.prototype.enforceState = function (state) {
  if (!this.transitions[state]) this.transitions[state] = {};
};

FSM.prototype.on = function (event, transitionFromState, toState, withCallback) {  
  if (!transitionFromState) throw new Error('from state is required');
  if (!toState) throw new Error('to state is required');

  this.enforceState(transitionFromState);
  this.transitions[transitionFromState][event] = [toState, withCallback];
};

FSM.prototype.enter = function (state, callback) {
   this.enters[state] = callback;
};

FSM.prototype.leave = function (state, callback) {
  this.leaves[state] = callback;
};

FSM.prototype.cycle = function (state, callback) {
  this.cycles[state] = callback;
};

FSM.prototype.setState = function (state, options) {
  if (!this.transitions[state]) { return NO; }
  
  if ((options & FSM.StateOptions.Enter) && this.enters[state]) this.enters[state]();
  if ((options & FSM.StateOptions.Cycle) && this.cycles[state]) this.cycles[state]();
  
  this.state = state;
  return true;
};

FSM.prototype.event = function (event, userInfo, exclusive) {
  if (!this.state) throw new Error('No initial state!');
  if (exclusive && this.state === FSM.StateTransitionning) {
    this.vlog("Discarded event "+ event +" due to ongoing exclusive transition");
    return false;
  }
  
  // Check the transition exists
  if (!this.transitions[this.state][event]) {
    this.vlog("Invalid transition on "+ event +" from state", this.state);
    return false;
  }
  
  // We are allowed to transition
  var oldState = this.state
  var targetState = this.transitions[oldState][event][0];
  
  if (exclusive) this.state = kFSMStateTransitionning;

  // Do we need a leave ?
  if ((targetState !== oldState) && this.leaves[oldState]) {
    this.vlog("Leave block for state", oldState);
    dispatch_async(this.leaves[oldState]);
  }

  var that = this;
  var done = function () {
    dispatch_async(function () {
      // Do we need an enter ?
      if (targetState !== oldState) {
        if (that.enters[targetState]){
          that.vlog("Enter block for state", targetState);
          that.enters[targetState]();
        }
      } else if (that.cycles[oldState]) {
        that.vlog("Cycle block for state", oldState);
        that.cycles[oldState]();
      }
      that.state = targetState;
      that.vlog("Landed on state", targetState);
    });
  };
  
  if (this.transitions[oldState][event][1]) this.transitions[oldState][event][1](done, userInfo);
  else done();
  
  this.vlog("Transitionning from state "+ oldState +" to state "+ targetState +" with event "+ event +" (Exclusive: "+ exclusive +")");
  return true;  
};

if (typeof window === 'undefined' && module && module.exports) {
  module.exports = FSM;
}