import { AccessControlPlus } from 'accesscontrol-plus';

const accessControl = new AccessControlPlus();

accessControl
  .deny('public').scope('*:*')
  .grant('user').inherits('public')
  .grant('admin').inherits('user');

export default accessControl;
