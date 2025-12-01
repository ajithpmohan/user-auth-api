import { S3Client } from '@aws-sdk/client-s3';

import ENV from './constants.js';

/**
 * AWS Best Practice:
 * We do NOT use hardcoded access keys. Instead, this application runs on an
 * EC2 instance that has an IAM Role attached with least-privilege S3 permissions.
 *
 * How this works:
 * 1. Create an IAM Role for EC2 (IAM → Roles → Create Role → EC2).
 * 2. Attach the required S3 permissions (e.g., a custom policy or AmazonS3FullAccess).
 * 3. Attach this IAM Role to the EC2 instance (EC2 → Actions → Security → Modify IAM Role).
 * 4. AWS SDK v3 automatically retrieves temporary credentials via the EC2 Instance
 *    Metadata Service (IMDS), so no accessKeyId or secretAccessKey is needed.
 */
export const s3 = new S3Client({
  region: ENV.AWS_REGION
});
