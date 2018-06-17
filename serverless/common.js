
module.exports.vars = (sls)=> {
  const optionsValid = sls && sls.processedInput && sls.processedInput.options;
  const opt = optionsValid ? sls.processedInput.options : {};
  const env = process.env;

  const stage = opt.stage || env.STAGE || 'dev';
  const region = opt.region || env.REGION || 'us-east-1';

  // Corresponds to an AWS account (dev, beta, prod)
  const account = /^beta|prod|offine$/.test(stage) ? stage : 'dev';
  const defaultProfile = `${account}-profile-precisely`;
  const profile = opt.profile || env.PROFILE || defaultProfile;
  const auth0Tenant = account==='offline' ? 'dev-precisely' : `${account}-precisely`;
  const rootDomain = account==='prod' ? 'precise.ly'
                   : account==='offline' ? 'localhost'
                   : `codeprecisely.net`;
  const baseDomain = account==='dev' ? `${stage}.${rootDomain}` : rootDomain;
  const apiDomain = account==='offline' ? 'localhost' : `api.${baseDomain}`;
  const certificateName = `*.${rootDomain}`;
  const reactURL = account==='offline' ? `https://${baseDomain}:3000` : `https://${baseDomain}/`;
  const graphQLAPIPath = '/graphql';

  const result = {
    account,
    accountId: '#{AWS::AccountId}',
    apiDomain,
    auth0Tenant,
    baseDomain,
    certificateName,
    graphQLAPIPath,
    profile,
    reactURL,
    region,
    stage
  };

  return result;
};
