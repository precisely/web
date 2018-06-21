
module.exports.Resources = (sls) => {
//   return {
//     Route53RecordSetGroupReactS3Website: {
//       Type: 'AWS::Route53::RecordSetGroup',
//       Properties: {
//         HostedZoneId: sls.config.custom.common.rootDomainHostedZoneId,
//         RecordSets: [{
//           Name: "boo.codeprecisely.net",
//           Type: "A",
//           AliasTarget: {
//             HostedZoneId: "123",
//             DNSName: "google.com"
//           }
//         }]
//       }
//     }
//   };
// };

  const recordSets = [];
  printKeys({sls: sls}, 'sls');
  printKeys(sls, 'providers');
  printKeys(sls, 'service');
  printKeys(sls, 'variables');
  printKeys(sls, 'config');
  printKeys(sls, 'utils');

  const cloudFrontRecord = {
    Name: `${sls.service.custom.vars.clientDomain}.`,
    Type: 'A',
    AliasTarget: {
      HostedZoneId: sls.config.custom.common.cloudfrontHostedZoneId,
      DNSName: { 'Fn::GetAtt': [ 'CloudFrontDistributionReactClient', 'DomainName' ] }
    }
  };

  if (sls.config.custom.vars.enableUnsecuredReactS3WebsiteDomain) {
    const s3WebsiteRecord = {
      Name: `${sls.config.custom.vars.reactS3BucketName}.`,
      Type: 'A',
      AliasTarget: {
        HostedZoneId: sls.config.custom.common.s3HostedZoneId,
        DNSName: `s3-website-${sls.provider.region}.amazonaws.com`
      }
    };
    recordSets.push(s3WebsiteRecord);
  }

  if (!sls.config.custom.vars.disableReactCloudFrontWebsiteDomain) {
    recordSets.push(cloudFrontRecord);
  }

  if (recordSets.length===0) {
    sls.cli.consoleLog('Warning: no DNS recordsets');
  }

  return {
    Route53RecordSetGroupReactS3Website: {
      Type: 'AWS::Route53::RecordSetGroup',
      Properties: {
        HostedZoneId: sls.config.custom.common.rootDomainHostedZoneId,
        RecordSets: recordSets
      }
    }
  };
}

function printKeys(obj, prop) {
  for (const key of Object.keys(obj[prop])) {
    console.log(`sls.${prop}.${key} = %j`, obj[prop][key]);
  }
}