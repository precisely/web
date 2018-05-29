import { RBACPlus } from 'rbac-plus';

const accessControl = new RBACPlus();

accessControl
  .deny('public').scope('*:*')
  .grant('user').inherits('public')
  .grant('admin').inherits('user');

export default accessControl;
