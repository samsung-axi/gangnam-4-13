import { S3 } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

async function fetchEnvFromS3(): Promise<void> {
    console.log('Starting to fetch .env file from S3...');
    
    const bucketName = 'narrativa-develop-store';
    const objectKey = 'config/.env';
    const region = 'ap-northeast-2';
    const outputFilePath = path.join(__dirname, '..', '.env');

    const s3 = new S3({ region });

    try {
        console.log(`Downloading .env from s3://${bucketName}/${objectKey}...`);

        const response = await s3.getObject({
            Bucket: bucketName,
            Key: objectKey,
        });

        if (!response.Body) {
            throw new Error('No content found in the S3 object');
        }

        // 파일 데이터를 읽어서 로컬에 저장
        const fileContent = await response.Body.transformToString();
        fs.writeFileSync(outputFilePath, fileContent);

        console.log('Successfully downloaded and saved .env file at:', outputFilePath);
    } catch (error) {
        console.error('Error occurred while fetching .env from S3:', error);
        process.exit(1);
    }
}

// 직접 실행을 위한 코드 추가
if (require.main === module) {
    fetchEnvFromS3()
        .then(() => console.log('Completed successfully'))
        .catch(error => {
            console.error('Failed to fetch .env file:', error);
            process.exit(1);
        });
}
