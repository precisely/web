const AWS = require('aws-sdk');
const {CloudFront, SharedIniFileCredentials} = require('aws-sdk');
const credentials = new SharedIniFileCredentials({profile: process.env.PROFILE});
AWS.config.credentials = credentials;

//
// usage: yarn sls invalidate {stage-name} {aws-profile-name}
// 
const stage = process.argv[2];
const profile = process.argv[3];

async function getDistributionIdFromTargetOriginId(targetOriginId) {
  const cf = new CloudFront();

  const distributionList = await cf.listDistributions().promise();
  if (distributionList) {
    for (const distribution of distributionList.Items) {
      if (distribution.DefaultCacheBehavior && distribution.DefaultCacheBehavior.TargetOriginId === targetOriginId) {
        return distribution.Id;
      }
    }
  }
}

async function invalidateDistribution(distributionId) {
  const cf = new CloudFront();
  const timestamp = Math.floor(Date.now() / 1000);
  return await cf.createInvalidation({
    DistributionId: distributionId, 
    InvalidationBatch: { 
      CallerReference: `serverless-invalidate-script-${timestamp}`, /* required */
      Paths: { 
        Quantity: 1,
        Items: [
          '/'
        ]
      }
    }
  }).promise();
}

getDistributionIdFromTargetOriginId(`${stage}-cloudfront`).then(distributionId => {
  if (distributionId) {
    invalidateDistribution(distributionId).then(result => {
      if (result) {
        console.log('CloudFront Invalidation created. Path: "/" InvalidationId: %s DistributionId: %s', result.Invalidation.Id, distributionId);
      }
    }).catch(e => {
      console.log('Error creating CloudFront distribution invalidation for %s in stage %s using profile %s: %s', 
        distributionId, stage, profile, e
      );
    });
  }
}); 
