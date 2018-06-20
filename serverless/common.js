
module.exports.vars = (sls)=> {
  const optionsValid = sls && sls.processedInput && sls.processedInput.options;
  const opt = optionsValid ? sls.processedInput.options : {};
  const env = process.env;

  const stage = opt.stage || env.STAGE || 'dev';
  const region = opt.region || env.REGION;

  if (!region) {
    throw new Error(`AWS region must be provided as an environment variable REGION or argument to serverless`);
  }
  // Corresponds to an AWS account (dev, beta, prod)
  const account = /^beta|prod|offine$/.test(stage) ? stage : 'dev';
  const defaultProfile = `${account}-profile-precisely`;
  const profile = opt.profile || env.PROFILE || defaultProfile;
  const auth0Tenant = account==='offline' ? 'dev-precisely' : `${account}-precisely`;
  const auth0ReactClientId = getAuth0ReactClientId(account);
  const rootDomain = account==='prod' ? 'precise.ly'
                   : account==='offline' ? 'localhost'
                   : `codeprecisely.net`;
  const baseDomain = account==='dev' ? `${stage}.${rootDomain}` : rootDomain;
  const apiDomain = account==='offline' ? 'localhost'
                  : account==='dev' ? `api-${baseDomain}` // e.g., api-aneil.codeprecisely.net
                  : `api.${basedomain}`; //  e.g., api.precise.ly or api.precisionhealth.site
  const certificateName = `*.${rootDomain}`;
  const certificateArn = getCertificateArn(certificateName);
  const reactURL = account==='offline' ? `https://${baseDomain}:3000` : `https://${baseDomain}/`;
  const graphQLAPIPath = 'graphql';

  // manually provisioned bucket avoids stack removal issue:
  // automatically provisioned bucket causes stack delete failure
  const deploymentBucket = `${account}-precisely-deployment-bucket`;

  const s3HostedZoneId = getS3HostedZoneId(region);

  const rootDomainHostedZoneId = getRootDomainHostedZoneId(rootDomain);

  // see https://docs.aws.amazon.com/general/latest/gr/rande.html#cf_region
  const cloudfrontHostedZoneId = 'Z2FDTNDATAQYW2';

  const result = {
    account,
    accountId: '#{AWS::AccountId}',
    apiDomain,
    auth0Tenant,
    auth0ReactClientId,
    baseDomain,
    certificateName,
    certificateArn,
    cloudfrontHostedZoneId,
    deploymentBucket,
    graphQLAPIPath,
    profile,
    reactURL,
    region,
    rootDomain,
    rootDomainHostedZoneId,
    s3HostedZoneId,
    stage
  };

  return result;
};

// see https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region
const S3HostedZoneIds = {
  'us-east-2': 'Z2O1EMRO9K5GLX',
  'us-east-1':	'Z3AQBSTGFYJSTF',
  'us-west-1': 'Z2F56UZL2M1ACD',
  'us-west-2': 'Z3BJ6K6RIION7M',
  'ca-central-1': 'Z1QDHH18159H29',
  'ap-south-1': 'Z11RGJOFQNVJUP',
  'ap-northeast-2': 'Z3W03O7B5YMIYP',
  'ap-northeast-3': 'Z2YQB5RD63NC85',
  'ap-southeast-1': 'Z3O0J2DXBE1FTB',
  'ap-southeast-2': 'Z1WCIGYICN2BYD',
  'ap-northeast-1': 'Z2M4EHUR26P7ZW',
  'cn-northwest-1': null, // not supported
  'eu-central-1': 'Z21DNDUVLTQW6Q',
  'eu-west-1': 'Z1BKCTXD74EZPE',
  'eu-west-2': 'Z3GKZC51ZF0DB4',
  'eu-west-3': 'Z3R1K369G5AVDG',
  'sa-east-1': 'Z7KQH4QJS55SO'
};

function getS3HostedZoneId(region) {
  const hostedZoneId = S3HostedZoneIds[region];
  if (!hostedZoneId) {
    throw new Error(`No S3 hosted zone for ${region}`);
  }
  return hostedZoneId;
}

function getRootDomainHostedZoneId(rootDomain) {
  switch(rootDomain) {
    case 'codeprecisely.net': return 'Z1TVBJKYIAVO8C';
    default: throw new Error(`HostedZoneId for ${rootDomain} not yet set in ${__filename}`);

  }
}

function getAuth0ReactClientId(account) {
  // Client Ids are meant to be exposed in the browser
  // They are not secrets, so it's ok to commit this to git

  // Each client application corresponds to an AWS account, and
  // was created manually in Auth0:
  switch (account) {
    case 'prod': return 'Hv6ObVE8fAxZfADFpaI75B2TCngXuwgz';
    case 'beta': return 'MU1uYoV04NCFFyXBoiJhDm3zYnbNYppw';
    case 'offline':
    case 'dev': return 'yrNpYsLHFQ4mBHsP4rqDC8LNPLaOZDS4';
    default: throw new Error(`No auth0 client id for account "${account}"`);
  }
}

function getCertificateArn(certificateName) {
  switch(certificateName) {
    case '*.codeprecisely.net': return 'arn:aws:acm:us-east-1:416000760642:certificate/f44b4ee7-b4cb-4d32-9c19-58ca6a97b42d';
    default: throw new Error(`Certificate ARN for ${certificateName} must be set in ${__filename}`);
  }
}