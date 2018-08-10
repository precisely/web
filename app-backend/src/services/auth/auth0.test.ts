import { getToken, authenticate } from './auth0';
import { log } from 'src/common/logger';
import * as jwt from 'jsonwebtoken-promisified';

describe('auth0', function () {
  describe('getToken', function () {

    it('should return the token part of the authorization header', function () {
      expect(getToken({
        type: 'REQUEST',
        methodArn: 'foo',
        headers: { Authorization: 'bearer the-token' }
      })).toEqual('the-token');
    });

    it('should throw an error when the authorization header is missing', function () {  
      expect(() => getToken({
        type: 'REQUEST',
        methodArn: 'some:arn'
      })).toThrow(/Missing Authorization/);
    });

    it('should throw an invalid exception when the authorization header is invalid', function () {
      expect(() => getToken({
        type: 'REQUEST',
        methodArn: 'some:arn',
        headers: { Authorization: 'foo' }
      })).toThrow(/Invalid Authorization/);
    });
  });
});
