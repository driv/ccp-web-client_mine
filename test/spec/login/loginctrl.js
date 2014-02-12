'use strict';

describe('Controller: LoginCtrl', function() {

  // load the controller's module
  beforeEach(module('ccpWebClientApp'));

  var LoginCtrl,
    scope,
    deferred,
    CredentialsValidator,
    Session,
    PersistentSession;

  var username = 'test_username',
    password = 'test_password';

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _CredentialsValidator_, _Session_, _$q_, _PersistentSession_) {
    scope = $rootScope.$new();
    deferred = _$q_.defer();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
    CredentialsValidator = _CredentialsValidator_;
    Session = _Session_;
    PersistentSession = _PersistentSession_;
  }));

  it('Should have a clean scope', function() {
    expect(scope.login).toBeDefined();
    expect(scope.loginStatus).not.toBeDefined();
    expect(scope.storeSession).toBeFalsy();
  });

  it('should pass user and password to the CredentialsValidator', function() {
    scope.username = username;
    scope.password = password;
    spyOn(CredentialsValidator, 'obtainCredentials').andCallThrough();
    scope.login();
    expect(CredentialsValidator.obtainCredentials).toHaveBeenCalledWith(username, password);
  });

  it('should store the session if the credentials are valid', function() {
    scope.username = username;
    scope.password = password;
    spyOn(Session, 'login').andCallThrough();
    mockCorrectLogin();

    scope.login();
    scope.$apply();

    expect(Session.login).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should show errors and not store the session id if login is incorrect', function() {
    spyOn(Session, 'login');
    mockIncorrectLogin();

    scope.login();
    scope.$apply();

    expect(Session.login).not.toHaveBeenCalled();
    expect(scope.loginStatus).toEqual('Incorrect credentials.');
  });

  it('should store the session permanently if storeSession is set', function() {
    scope.storeSession = true;
    mockCorrectLogin();
    spyOn(PersistentSession, 'store').andCallThrough();

    scope.login();
    scope.$apply();

    expect(PersistentSession.store).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should not store the session permanently if storeSession is not set', function() {
    scope.storeSession = false;
    mockCorrectLogin();
    spyOn(PersistentSession, 'store').andCallThrough();

    scope.login();
    scope.$apply();

    expect(PersistentSession.store).not.toHaveBeenCalled();
  });

  function mockCorrectLogin() {
    mockLogin(true);
  }

  function mockIncorrectLogin() {
    mockLogin(false);
  }

  function mockLogin(correct) {
    var mockResult = {
      isLoginCorrect: correct
    };
    deferred.resolve(mockResult);
    spyOn(CredentialsValidator, 'obtainCredentials')
      .andReturn(deferred.promise);
  }
});