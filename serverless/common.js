module.exports.vars = (sls)=> {
  process.env.IN_SERVERLESS_PROCESS = 'true';
  const optionsValid = sls && sls.processedInput && sls.processedInput.options;
  const opt = optionsValid ? sls.processedInput.options : {};
  const env = process.env;
  const isOffline = !/^(no|0|false|)$/i.test(env.IS_OFFLINE || '');

  sls.cli.consoleLog('Serverless: Generating offline settings');

  const stage = opt.stage || env.STAGE || 'dev';
  const region = opt.region || env.REGION;

  if (!region) {
    throw new Error(`AWS region must be provided as an environment variable REGION or argument to serverless`);
  }
  // Corresponds to an AWS account (dev, beta, prod)
  const account = /^beta|prod$/.test(stage) ? stage : 'dev';
  const defaultProfile = `${account}-profile-precisely`;
  const profile = opt.profile || env.PROFILE || defaultProfile;
  const auth0Tenant = isOffline ? 'dev-precisely' : `${account}-precisely`;
  const auth0ReactClientId = getAuth0ReactClientId(account);
  const rootDomain = isOffline ? 'localhost'
                   : account==='prod' ? 'precise.ly'
                   : account==='beta' ? 'precisionhealth.site'
                   : 'codeprecisely.net';

  // baseDomain = the root domain, taking into account the developer's environment (if any)
  const baseDomain = account==='dev' ? `${stage}.${rootDomain}` : rootDomain;
  const apiDomain = isOffline ? 'localhost'
                  : account==='dev' ? `api-${baseDomain}` // e.g., api-aneil.codeprecisely.net
                  : `api.${baseDomain}`; //  e.g., api.precise.ly or api.precisionhealth.site

  const offlineAPIPort = env.OFFLINE_API_PORT || 3001;
  const apiHost = isOffline ? `${apiDomain}:${offlineAPIPort}` : apiDomain;
  const apiScheme = isOffline ? 'http' : 'https';
  const certificateName = `*.${rootDomain}`;
  const certificateArn = getCertificateArn(certificateName);
  const graphQLAPIPath = 'graphql';
  const graphQLEndpoint = `${apiScheme}://${apiHost}/${graphQLAPIPath}`;
  const bioinformaticsUploadTokenPath = 'bioinformaticsUploadToken';
  const bioinformaticsUploadTokenEndpoint = `${apiScheme}://${apiHost}/${bioinformaticsUploadTokenPath}`;
  
  // manually provisioned bucket avoids stack removal issue:
  // automatically provisioned bucket causes stack delete failure
  const deploymentBucket = `${account}-precisely-deployment-bucket`;

  const s3HostedZoneId = getS3HostedZoneId(region);

  const rootDomainHostedZoneId = getRootDomainHostedZoneId(rootDomain);

  // see https://docs.aws.amazon.com/general/latest/gr/rande.html#cf_region
  const cloudfrontHostedZoneId = 'Z2FDTNDATAQYW2';

  const result = {
    account,
    accountId: { Ref: 'AWS::AccountId' },
    apiDomain,
    apiHost,
    auth0ReactClientId,
    auth0Tenant,
    baseDomain,
    bioinformaticsUploadTokenEndpoint,
    bioinformaticsUploadTokenPath,
    certificateArn,
    certificateName,
    cloudfrontHostedZoneId,
    deploymentBucket,
    graphQLAPIPath,
    graphQLEndpoint,
    isOffline,
    offlineAPIPort,
    profile,
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
    case 'precisionhealth.site': return 'Z1059EDY99U5GK';
    case 'precise.ly': return 'Z1FM1IS2FI7HE3';
    case 'localhost': return 'dummy-localhost-hosted-zoneId';
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
    case 'dev': return 'yrNpYsLHFQ4mBHsP4rqDC8LNPLaOZDS4';
    default:
      if (isOffline) {
        return getAuth0ReactClientId('dev');
      }
      throw new Error(`No auth0 client id for account "${account}"`);
  }
}

function getCertificateArn(certificateName) {
  switch(certificateName) {
    case '*.codeprecisely.net': return 'arn:aws:acm:us-east-1:416000760642:certificate/f44b4ee7-b4cb-4d32-9c19-58ca6a97b42d';
    case '*.precisionhealth.site': return 'arn:aws:acm:us-east-1:370821419022:certificate/c281fb80-ef3e-45ee-be79-61d570ff486e';
    case '*.precise.ly': return 'arn:aws:acm:us-east-1:576199076748:certificate/566cd3b7-0f18-46bb-b61f-ddb4dfd8ed87';
    case '*.localhost': return 'dummy-localhost-certificate-arn';
    default: throw new Error(`Certificate ARN for ${certificateName} must be set in ${__filename}`);
  }
}
