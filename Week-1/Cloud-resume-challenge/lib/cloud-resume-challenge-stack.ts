import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';

export class CloudResumeChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create an S3 Bucket with all the required configuration
    const bucket = new s3.Bucket(this,'sgupta.cloud' , {
      bucketName: "sgupta.cloud",
      //publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: "index.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })
    
    //Create a Bucket Deployment to deploy the website-assets
    new S3Deployment.BucketDeployment(this, "bucket-Deployment", {
        sources: [S3Deployment.Source.asset('../Cloud-resume-challenge/resume-site')],
      destinationBucket: bucket
    });


  }
}
