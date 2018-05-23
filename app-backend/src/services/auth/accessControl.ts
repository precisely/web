import {RBACPlus, Context} from 'rbac-plus';

function reportIsPublished({resource}: Context) { return resource.get('status') === 'published'; }
function ownedByUser({resource, user}: Context) { return user.get('id') === resource.get('userId'); }

const accessControl = new RBACPlus();
accessControl
  .grant('public')
    .scope('Report:read')
      .where(reportIsPublished)
  .grant('user')
    .scope('VariantCall:read')
      .where(ownedByUser);

export default accessControl;
