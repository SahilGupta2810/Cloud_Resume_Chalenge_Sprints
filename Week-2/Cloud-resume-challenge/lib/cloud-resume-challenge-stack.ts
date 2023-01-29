import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam'; 
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CfnOutput } from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ddb from 'aws-cdk-lib/aws-dynamodb'; 




export class CloudResumeChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create an S3 Bucket with all the required configuration
    const bucket = new s3.Bucket(this, 'sgupta.cloud', {
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

    //Request a certificate from AWS Certificate Manager and validate it using DNS validation method
    //or
    ///Import a certificate from AWS Certificate Manager
    const certificatearn = "arn:aws:acm:us-east-1:160902316896:certificate/2211b5a3-da32-49f2-a469-0ef394c2298c";
    const certificate = acm.Certificate.fromCertificateArn(this, 'Import-Certificate', certificatearn)

    //Create a Hosted Zone for the domain
    const myHostedZone = new route53.PublicHostedZone(this, 'Hosted Zone for the domain sgupta.cloud', {
      zoneName: 'sgupta.cloud',
      comment: 'Hosted Zone for the domain sgupta.cloud'
    });

    //Create an OAI 
    const OAI = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for the domain sgupta.cloud'
    });

    //Create a CloudFront Distribution using OAI , Hosted Zone , Certificate and Bucket as n origin
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: OAI,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              compress: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            }
          ]
        }
      ],
      viewerCertificate: {
        aliases: ['sgupta.cloud'],
        props: {
          acmCertificateArn: certificatearn,  // optional
          sslSupportMethod: 'sni-only', // optional',
          minimumProtocolVersion: 'TLSv1.2_2021', 
          // All `props` options here: https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudfront.CfnDistribution.ViewerCertificateProperty.html
        }
      },
      defaultRootObject: 'index.html',
      comment: "Distributon for Cloud Resume Challenge",
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        }
      ]

    });

    //TEST THIS -------- Create Route53 Records
    // new route53.ARecord(this, 'Alias', {
    //   zone: myHostedZone,
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    // });

    new route53.ARecord(this, 'A-record', {
        zone: myHostedZone,
        recordName: 'sgupta.cloud',
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    })


    //Create API GAteway for GET and POST method
    const api = new apigateway.RestApi(this, 'Cloud-Resume-Challenge-API', {
      restApiName: 'Cloud-Resume-Challenge-API',
      description: 'REST API for Cloud Resume Challenge',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS
        // allowCredentials: true
      },
      deployOptions: {
        stageName: 'dev'
      },
      retainDeployments: false
    });

    //Create Lambda GetFn
    const GetFn = new lambda.Function(this, 'GetFn', {
      functionName: 'GetFn', 
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/Get-data')),
      handler: 'index.getFn',
      environment: {
        'BUCKET_NAME': bucket.bucketName,
        'TABLE_NAME': 'Cloud-Resume-Challenge-Visitor'
      },
      timeout: cdk.Duration.seconds(30)
    })

    //Create methods: GET  
    //Integrate it with Lambda Function
    //Create a resource in api gateway
    const visitor = api.root.addResource('visitor');
    visitor.addMethod(
      'GET', 
      new apigateway.LambdaIntegration(GetFn , {proxy:true}))

    //Create and configure DyanamoDB Table
    const table = new ddb.Table(this, 'Cloud-Resume-Challenge-Visitor', {
      tableName: 'Cloud-Resume-Challenge-Visitor',
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'ID',
        type: ddb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //Grant read permission to GetFn and read / write permission to PostFn
    table.grantFullAccess(GetFn)

    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'Bucket Name'
    });
  }
}
