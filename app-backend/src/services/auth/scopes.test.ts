import { makeScopes, checkScope } from 'src/services/auth/scopes';
import context from 'jest-plugin-context';

describe('auth.scopes', function () {
  context('makeScopes', function () {
    it('should return a string containing the colon-separated elements', function () {
      expect(makeScopes('a:b:c')).toEqual([['a', 'b', 'c']]);
    });
  });

  context('checkScope', function () {
    it('should complete without error when the scope is found', function () {
      expect(() => checkScope('a:b', makeScopes('a:b'), {})).not.toThrow();
      expect(() => checkScope('a:b', makeScopes('a', 'c', 'z:x:y', 'a:b'), {})).not.toThrow();
    });
    it('should throw an error when the scope is not found', function () {
      expect(() => checkScope('a:b', makeScopes('a:z'), {})).toThrow();
    });
    it('should not throw an error when a * match exists', function () {
      expect(() => checkScope('a:b', makeScopes('a:*'), {})).not.toThrow();
    });
    it('should throw an error when a * match exists, but the two scopes are of the wrong length', function () {
      expect(() => checkScope('a:b', makeScopes('a:*:c'), {})).toThrow();
    });
    it('should not throw an error when a ** match exists', function () {
      expect(() => checkScope('a:b:c:d', makeScopes('a:**'), {})).not.toThrow();
    });
    it('should throw an error when a ** follows a non-match', function () {
      expect(() => checkScope('a:b:c:d', makeScopes('z:**'), {})).toThrow();
    });
    it('should not throw an error when a context variable matches', function () {
      expect(() => checkScope('a:b:123', makeScopes('a:b:$var'), { var: 123 })).not.toThrow();
    });
    it('should not throw an error when a nested context variable matches', function () {
      expect(() => checkScope('a:b:123', makeScopes('a:b:$vars.foo'), { vars: {foo: 123} })).not.toThrow();
    });
    it('should throw an error when the context variable doesn\'t match', function () {
      expect(() => checkScope('a:b:123', makeScopes('a:b:$var'), { var: 456 })).toThrow();
    });

  });
});
