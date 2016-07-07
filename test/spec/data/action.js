module.exports = {
  name: 'basis.net.action',
  init: function(){
    var basis = window.basis.createSandbox();
    var DataObject = basis.require('basis.data').Object;
    var STATE = basis.require('basis.data').STATE;
    var createAction = basis.require('basis.data.action').fromPromise;
    var resolvedFn = function(){
      return Promise.resolve('success');
    };
    var rejectedFn = function(){
      return Promise.reject('fail');
    };
  },
  test: [
    {
      name: 'Action from promise',
      test: [
        {
          name: 'Should call every callback when fulfilled',
          test: function(done){
            var passed = {};

            createAction({
              fn: resolvedFn,
              start: function(){
                assert(this instanceof DataObject);
                passed.start = true;
              },
              success: function(data){
                assert(this instanceof DataObject);
                assert(String(this.state) == STATE.PROCESSING);
                assert(data == 'success');
                passed.success = true;
              },
              failure: function(){
                assert('', 'Failure callback must not be called!');
              },
              complete: function(){
                assert(this instanceof DataObject);
                assert(String(this.state) == STATE.READY);
                passed.complete = true;
              }
            }).call(new DataObject).then(function(data){
              assert(data == 'success');
              assert(passed.start);
              assert(passed.success);
              assert(passed.complete);
              done();
            });
          }
        },
        {
          name: 'Should call every callback when rejected',
          test: function(done){
            var passed = {};

            createAction({
              fn: rejectedFn,
              start: function(){
                assert(this instanceof DataObject);
                passed.start = true;
              },
              failure: function(error){
                assert(this instanceof DataObject);
                assert(String(this.state) == STATE.PROCESSING);
                assert(error == 'fail');
                passed.failure = true;
              },
              success: function(){
                assert('', 'Success callback must not be called!');
              },
              complete: function(){
                assert(this instanceof DataObject);
                assert(String(this.state) == STATE.ERROR);
                passed.complete = true;
              }
            }).call(new DataObject).catch(function(error){
              assert(error == 'fail');
              assert(passed.start);
              assert(passed.failure);
              assert(passed.complete);
              done();
            });
          }
        }
      ]
    }
  ]
};
