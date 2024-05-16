var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

function Promise(execute) {
  var that = this;
  that.state = PENDING;
  function resolve(value) {
    if (that.state === PENDING) {
      that.state = FULFILLED;
      that.value = value;
    }
  }

  function reject(reason) {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.reason = reason;
    }
  }

  try {
    execute(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFilfilled === 'function'
      ? onFulfilled
      : function (x) {
          return x;
        };

  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : function (e) {
          throw e;
        };

  var that = this;
  var promise;

  if (that.state === FULFILLED) {
    promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          onFulfilled(that.value);
        } catch (reason) {
          reject(reason);
        }
      });
    });
  }

  if (that.state === REJECTED) {
    promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          onRejected(that.reason);
        } catch (reason) {
          reject(reason);
        }
      });
    });
  }

  if (that.state === PENDING) {
    promise = new Promise(function (resolve, reject) {
      that.onFulfilledFn.push(function () {
        try {
          onFulfilled(that.value);
        } catch (reason) {
          reject(reason);
        }
      });

      that.onRejectedFn.push(function () {
        try {
          onRejected(that.reason);
        } catch (reason) {
          reject(reason);
        }
      });
    });
  }

  if (that.state === REJECTED) {
    setTimeout(function () {
      onRejected(that.reason);
    });
  }

  if (that.state === PENDING) {
    that.onFulfilledFn = function () {
      onFulfilled(that.value);
    };

    that.onRejectedFn = function () {
      onRejected(that.reason);
    };
  }
};
