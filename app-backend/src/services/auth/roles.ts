import {makeScopes} from './scopes';

export interface RoleScopes {
  [key: string]: string[][];
}

export const PreciselyRoles: RoleScopes = {
  user: makeScopes(
    'variantCall:read:$userId',
    'report:read:public:*',
    'report:read:owner:$userId',
    'report:write:$userId'
  ),
  admin: makeScopes(
    'variantCall:read:*',
    'variantCall:write:$userId',
    'report:read:public:*',
    'report:'
  ),
  public: makeScopes(
    'report:query:*'
  )
};
