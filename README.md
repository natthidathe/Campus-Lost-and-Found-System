# Campus Lost and Found System

The **Campus Lost and Found System** is a centralized web application designed to simplify the process of reporting, tracking, and reclaiming lost belongings on campus. It bridges the gap between students who lose items and the staff who manage found property.

## 🚀 Features

### For Students (Client View)
* **Report Lost Items:** Submit details about lost items including location, time, and category.
* **Browse Items:** View a searchable list of all lost and found items.
* **Real-time Status:** Track the status of items (Lost, Found, Returned).
* **Secure Authentication:** Log in securely using university credentials (via AWS Cognito).

### For Admins & Staff
* **Admin Dashboard:** Visual analytics of lost vs. found items and category breakdowns.
* **Item Management:** Verify submitted claims, delete resolved items, and manage the database.
* **Report Found Items:** Staff interface to log items found on campus.
* **Verification System:** Review proof of ownership (IDs/Photos) uploaded by users before releasing items.
* **Matching:** System suggests potential matches between "Lost" reports and "Found" inventory.

---

## 🏗 Architecture

The system utilizes a robust **serverless architecture** on AWS. This design separates the frontend (Amplify) from the backend logic (Lambda) and storage (DynamoDB/S3), ensuring high scalability and cost-efficiency.

**Cloud Stack:**
* **Frontend:** React.js (Hosted on AWS Amplify)
* **Authentication:** Amazon Cognito
* **API Layer:** Amazon API Gateway
* **Business Logic:** AWS Lambda (Node.js)
* **Database:** Amazon DynamoDB
* **Storage:** Amazon S3 (For item images and ID verification)

---
