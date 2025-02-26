# AWS Full Stack Resume Project

## Project Overview

### Objective:
Developed a professional resume website hosted on AWS, utilizing various AWS services for enhanced performance, scalability, and security.

### Key AWS Services Used:
- **Amazon S3** for static website hosting
- **AWS CloudFront** for content delivery
- **AWS Certificate Manager (ACM)** for SSL/TLS
- **AWS Route 53** for DNS management
- **AWS DynamoDB** for data storage
- **AWS CodePipeline, CodeBuild, and CodeDeploy** for CI/CD automation
- **AWS IAM** for secure access management

## Website Development & Hosting
- Built a static resume website using a Bootstrap template.
- Hosted the static content on an S3 bucket named after the domain.
- Configured static website hosting and uploaded website files.
- **Issue:** Initial 403 error occurred when accessing the website.
  - **Cause:** Missing bucket policy permissions.
  - **Solution:** Defined a bucket policy to allow public read access while noting the security implications.

## CloudFront Integration for Performance & Security
- Integrated AWS CloudFront as a **Content Delivery Network (CDN)** to improve performance through caching at edge locations.
- Generated an **SSL certificate via ACM** (in the N. Virginia region) to enable HTTPS.
- Updated the **S3 bucket policy** to restrict direct access, allowing access only through CloudFront.

## DNS Management with AWS Route 53
- Created a hosted zone for the domain.
- Added name servers to the domain register.
- Created an **A record (Alias)** to point the domain to the CloudFront distribution.

## CI/CD Pipeline for Frontend Deployment
- Configured a **GitHub Actions workflow** to automate website deployment to the S3 bucket.
- Stored AWS credentials as encrypted **GitHub secrets**.

### GitHub Actions Workflow:
```yaml
name: Push to S3
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup AWS CLI
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Sync files to S3
        run: |
          aws s3 sync ./website s3://yourdomain.com --delete
```

## View Tracking API Development
- Developed a **View Tracking API** using Go with the **Gin framework**.
- Integrated **AWS DynamoDB** for storing and retrieving view counts.

### API Functionality:
- On a `GET /` request, the API increments and retrieves the current view count.

### Docker Containerization:
- Containerized the API using **Docker** for easy deployment.

### Dockerfile:
```dockerfile
FROM golang:1.22
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN go build -o /view-tracker
CMD ["/view-tracker"]
```

## BuildSpec.yml File:
```yaml
version: 0.2
env:
  parameter-store:
    DOCKER_USERNAME: docker_username
    DOCKER_PASSWORD: docker_password
    DOCKER_URL: docker_url
phases:
  build:
    commands:
      - cd tracker_api/
      - echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin $DOCKER_URL
      - docker build -t "$DOCKER_USERNAME/view_api_img:latest" .
      - docker push "$DOCKER_USERNAME/view_api_img:latest"
  post_build:
    commands:
      - echo "Successfully pushed to Docker Hub"
artifacts:
  files:
    - '**/*'
  name: my-artifact
```

## Deployment Automation with AWS CodeDeploy
- Created **CodeDeploy applications and deployment groups**.
- Installed the **CodeDeploy agent** on the EC2 instance.
- Utilized **IAM roles** for secure communication between CodeDeploy and EC2.
- Pulls the new **Docker image from Docker Hub**.
- Stops the old container.
- Starts the new container.

### AppSpec.yml File:
```yaml
version: 0.0
os: linux
hooks:
  ApplicationStop:
    - location: scripts/stop_container.sh
      timeout: 300
      runas: root
  AfterInstall:
    - location: scripts/start_container.sh
      timeout: 300
      runas: root
```

## Common Issues & Resolutions
### **CodeDeploy Agent Connection Failure**
- **Error:** CodeDeploy agent couldn't receive lifecycle events.
- **Solution:** Restart the agent and verify IAM role permissions.

### **AWS CodePipeline Role Authorization Failure**
- **Cause:** Insufficient permissions for accessing S3 artifacts.
- **Solution:** Updated IAM policy to allow artifact access.

### **CloudFront Cache Invalidation**
- **Issue:** Website didn't reflect recent changes due to caching.
- **Solution:** Manually invalidated the CloudFront cache.

### **Mixed Content Block (HTTP/HTTPS)**
- **Error:** API requests over HTTP were blocked.
- **Solution:** Implemented **Nginx reverse proxy** with HTTPS.

## Key Learnings & Best Practices
- **S3 Bucket Permissions:** Always re-enable **"Block Public Access"** after configuring CloudFront.
- **Docker:** Understanding the isolation between container and host networks is crucial.
- **CloudFront:** Cache invalidation is essential during website updates.
- **CI/CD:** Parameterizing credentials with AWS **Parameter Store** enhances security.
- **Bash Scripting:** Simplifies Docker container management.

## Unanswered Questions
- Why are **Deployment Groups** necessary?
- Why must **artifacts be uploaded to an S3 bucket** in AWS CodePipeline?

## References:
- [AWS S3 Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
- [AWS Route 53 Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)
- [AWS CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [DynamoDB with Go](https://aws.amazon.com/blogs/developer/using-amazon-dynamodb-with-the-go-sdk/)
