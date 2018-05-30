import {AccessControlPlus, IContext} from 'accesscontrol-plus';

function reportIsPublished({resource}: IContext) { return resource.get('status') === 'published'; }
function ownedByUser({resource, user}: IContext) { return user.get('id') === resource.get('userId'); }

const accessControl = new AccessControlPlus();
accessControl
  .grant('public')
    .scope('Report:read')
      .where(reportIsPublished)
  .grant('user')
    .scope('VariantCall:read')
      .where(ownedByUser);

export default accessControl;
