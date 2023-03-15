const { Upload } = require("@aws-sdk/lib-storage"),
      { S3 } = require("@aws-sdk/client-s3/");
const fs = require('fs');

const s3MethodFactor = (fucName) => {
    let s3;
    if (!s3) {
        s3 = new S3({
            region: process.env.AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    } else {
        console.log('Using cached s3 instance')
    }

    const uploadFile = (file) => {

        const fileStream = fs.createReadStream(file.path)
    
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fileStream,
            Key: file.filename
        }
    
        return new Upload({
            client: s3,
            params
        }).done();
    };

    const getFileStream = (filekey) => {
        return s3.getObject({
            Key: filekey,
            Bucket: process.env.AWS_BUCKET_NAME
        })
    };
    

    const mapping = {
        uploadFile,
        getFileStream
    }

    return mapping[fucName];
}

module.exports = {
    s3MethodFactor
}