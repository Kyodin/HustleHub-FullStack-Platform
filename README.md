# HustleHub

## INSY7314 - Final POE: Secure Full-Stack Marketplace

HustleHub is a web-based marketplace designed to connect clients and freelancers in one place.

The Final POE builds on the secure backend and marketplace functionality completed during Part 1 and Part 2.

The system now includes the full React frontend, role-based access control, freelancer gigs, client bookings, transactions, income and tax information, administration functionality, automated testing, Docker containerisation, security logging, CI testing and additional security controls.

The system supports three user roles:

* Client
* Freelancer
* Admin

Each role has different permissions and access to different parts of the application.

The main focus of the Final POE is to provide a complete working full-stack application while maintaining strong security, testing and application structure.

---

# Project Objectives

The main objectives of the Final POE were to:

* Build a complete React frontend for HustleHub.
* Allow users to register as clients or freelancers.
* Allow users to securely log into their accounts.
* Use JWT authentication to protect the application.
* Implement role-based access control.
* Allow freelancers to create and manage their own gigs.
* Prevent freelancers from managing gigs that do not belong to them.
* Allow clients to browse available gigs.
* Allow clients to create bookings.
* Automatically create transaction records when bookings are created.
* Keep booking information available even if the original gig is later deleted.
* Allow freelancers to cancel bookings with a reason.
* Refund the related transaction when a booking is cancelled.
* Allow freelancers to view income information.
* Add estimated tax information using the current SARS individual tax brackets.
* Display monthly income information.
* Add a complete administrator dashboard.
* Allow administrators to view users, gigs, bookings and transactions.
* Protect backend routes using authentication and role middleware.
* Protect frontend routes according to the user's role.
* Validate and sanitise information sent to the API.
* Apply rate limiting to sensitive routes.
* Use Helmet and Content Security Policy.
* Add frontend Content Security Policy protection.
* Add account lockout protection.
* Add application and security logging.
* Add centralised error handling.
* Test the React frontend using Vitest and React Testing Library.
* Test the backend using Jest and Supertest.
* Test the complete API using Postman and Newman.
* Add static code analysis using ESLint.
* Add automated testing, security checks and builds using GitHub Actions.
* Containerise the application using Docker.
* Use Docker Compose to run the frontend and backend together.
* Maintain a secure and organised project structure.

---

# Technology Used

## Node.js

Node.js is used as the runtime environment for the HustleHub backend.

## Express.js

Express.js is used to create the REST API, define routes and manage middleware.

## React

React is used to build the HustleHub frontend.

The frontend provides the public homepage, login page, registration page and dashboards used by clients, freelancers and administrators.

## React Router

React Router is used for frontend navigation and role-specific protected routes.

## Vite

Vite is used to run and build the React frontend during development.

## MongoDB Atlas

MongoDB Atlas is used as the cloud database for HustleHub.

The database stores:

* Users
* Gigs
* Bookings
* Transactions

## Mongoose

Mongoose is used to connect the Node.js backend to MongoDB Atlas and manage application data through models.

Mongoose sessions and transactions are also used for operations that must complete together.

## bcrypt

bcrypt is used to hash user passwords before they are stored.

Passwords are never stored as plain text.

## JSON Web Token

JSON Web Tokens are used to authenticate users after they successfully log in.

The token contains information required to identify the authenticated user and their role.

## express-validator

express-validator is used to validate and sanitise information supplied to the API.

## Helmet

Helmet is used to add security-related HTTP headers to the Express application.

Content Security Policy is also applied through Helmet.

## CORS

CORS is configured so the React frontend can communicate with the backend while preventing unrestricted browser access from other origins.

## express-rate-limit

express-rate-limit is used to reduce excessive requests to sensitive routes.

Rate limiting is applied to authentication and booking functionality.

## Winston

Winston is used for application, audit and security logging.

Security-related events and application errors are written to dedicated log files.

## dotenv

dotenv is used to load sensitive configuration values through environment variables.

## HTTPS and SSL

The HustleHub backend runs using HTTPS during local development.

A locally generated SSL certificate and private key are used to encrypt communication with the backend.

## Axios

Axios is used by the React frontend to communicate with the HustleHub API.

The JWT is automatically added to authenticated requests using an Axios interceptor.

## Vitest

Vitest is used to run automated frontend unit and component tests.

## React Testing Library

React Testing Library is used to test frontend behaviour from the user's perspective.

## Jest

Jest is used for automated backend testing.

## Supertest

Supertest is used with Jest to make test requests against the Express application.

## Postman

Postman was used throughout development to manually test API requests.

## Newman

Newman is used to execute the Postman API test collection from the command line and through the CI workflow.

## ESLint

ESLint is used for static code analysis.

It checks the backend code for common programming errors and code quality problems.

## npm audit

npm audit is used to check application dependencies for known security vulnerabilities.

Production backend dependencies and frontend dependencies are checked as part of the security testing process.

## Docker

Docker is used to containerise the backend and frontend.

The backend and frontend each have their own Dockerfile.

## Docker Compose

Docker Compose is used to build and run the backend and frontend services together.

## Nginx

Nginx is used inside the frontend Docker container to serve the built React application.

It also provides additional frontend security headers.

## GitHub Actions

GitHub Actions is used to automate testing, static analysis, security checks, Newman testing and application builds when changes are pushed to the repository.

---

# System Architecture

HustleHub uses a MERN-style full-stack application structure.

The React frontend communicates with the Express backend through HTTPS.

The backend processes requests through middleware, validators, controllers and Mongoose models before communicating with MongoDB Atlas.

A normal request follows this process:

1. The user interacts with the React frontend.
2. Axios sends a request to the backend.
3. Express receives the request.
4. Security middleware is applied.
5. Authentication is checked where required.
6. Role permissions are checked where required.
7. Submitted information is validated.
8. The relevant controller processes the request.
9. Mongoose communicates with MongoDB Atlas.
10. The backend returns a controlled JSON response.
11. The React frontend updates the interface.

---

# User Roles

HustleHub uses three separate roles.

## Client

Clients can:

* Register and log in.
* Browse available gigs.
* Search gigs.
* View gig information.
* Create bookings.
* View their booking history.
* View cancellation information.

Clients cannot create or manage freelancer gigs.

## Freelancer

Freelancers can:

* Register and log in.
* Create gigs.
* View their gigs.
* Edit their gigs.
* Delete their gigs.
* View bookings received from clients.
* Cancel confirmed bookings.
* View total income.
* View current-month income.
* View estimated tax information.
* View estimated after-tax income.
* View monthly income information.
* View transaction and refund history.

Freelancers cannot manage gigs belonging to other freelancers.

## Admin

Administrators have access to a separate admin dashboard.

Administrators can view:

* Platform statistics.
* Registered users.
* Clients and freelancers.
* Marketplace gigs.
* Bookings.
* Cancelled bookings.
* Transactions.
* Completed transaction value.
* Refund information.

The admin role is not available through public registration.

This prevents a normal user from registering themselves as an administrator.

---

# Authentication and Security

Security is an important part of HustleHub because the system handles user accounts, passwords, authentication tokens, bookings and transaction information.

## User Registration

Users can register using:

POST /api/auth/register

Users may register as either:

* Client
* Freelancer

Public registration does not allow users to register as administrators.

During registration:

1. Submitted information is validated.
2. Unexpected fields are rejected.
3. The email address is checked.
4. The password is validated.
5. The password is checked against bcrypt's supported byte limit.
6. The password is hashed using bcrypt.
7. The user is stored in MongoDB.
8. A controlled response is returned.

A successful registration returns:

201 Created

---

# bcrypt Password Limit

bcrypt only processes the first 72 bytes of a password.

HustleHub checks the UTF-8 byte length of a password before hashing.

Passwords larger than 72 bytes are rejected instead of allowing the extra bytes to be silently ignored.

This follows the documented limitation of bcrypt and improves password-handling safety.

---

# User Login

Users can log in using:

POST /api/auth/login

The login process works as follows:

1. The email address and password are submitted.
2. Input is validated.
3. The system searches for the user.
4. Account lockout status is checked.
5. bcrypt compares the submitted password with the stored hash.
6. Failed login attempts are tracked.
7. A JWT is generated when the details are correct.
8. The JWT and user information are returned to the frontend.

---

# Own Security Features

The Final POE required additional security functionality beyond the minimum application requirements.

Two main additional security features were implemented.

## 1. Account Lockout Protection

HustleHub tracks unsuccessful login attempts.

After:

5 failed login attempts

the account is temporarily locked for:

15 minutes

While the account is locked, further login attempts are rejected using a controlled:

423 Locked

response.

A successful login resets the failed login counter.

This helps reduce repeated password guessing and brute-force authentication attempts.

## 2. Security and Audit Logging

HustleHub uses Winston to record application and security activity.

The logging system records events such as:

* Login failures.
* Authentication activity.
* Account lockouts.
* Booking events.
* Transaction events.
* Refund activity.
* Application errors.
* Security-related events.

Security logs and error logs are stored separately.

The log directory is excluded from GitHub so runtime information is not committed to the repository.

---

# JWT Authentication

JWT authentication protects restricted API routes.

Authenticated requests use:

Authorization: Bearer \<JWT>

The authentication middleware checks for a strict Bearer token format.

Incorrectly formatted authentication headers are rejected.

---

# Role-Based Access Control

Role-based access control is used throughout the backend and frontend.

The backend remains responsible for the actual security decision.

Examples include:

* Clients cannot create gigs.
* Freelancers cannot create client bookings.
* Clients cannot access admin endpoints.
* Freelancers cannot access admin endpoints.
* Public users cannot access protected resources.
* Freelancers cannot edit gigs belonging to another freelancer.

Unauthorised role access normally returns:

403 Forbidden

---

# Frontend Protected Routes

The React frontend also protects dashboard routes.

Main role-specific routes include:

/client

/client/bookings

/freelancer

/admin

If a user is not logged in and attempts to open a protected route, they are redirected to:

/login

If a logged-in user attempts to open another role's dashboard, they are redirected according to their own role.

Frontend route protection improves user experience while backend access control remains responsible for enforcing security.

---

# Freelancer Gigs

Freelancers can create and manage services through the gig system.

A gig contains information such as:

* Title
* Description
* Category
* Price
* Freelancer
* Availability

## Create Gig

POST /api/gigs

Only freelancers may access this endpoint.

## View Own Gigs

GET /api/gigs/mine

## Update Gig

PUT /api/gigs/:id

A freelancer may only update a gig that belongs to them.

## Delete Gig

DELETE /api/gigs/:id

A freelancer may only delete a gig that belongs to them.

## Gig Ownership

Gig ownership is checked using the authenticated user's ID.

This prevents one freelancer from editing or deleting another freelancer's listing.

---

# Client Gig Browsing

Authenticated clients can browse available gigs using:

GET /api/gigs

Individual gigs can also be retrieved using:

GET /api/gigs/:id

---

# Booking System

Clients can create bookings for available gigs.

The booking endpoint is:

POST /api/bookings

The client only sends the selected gig ID.

Important information such as the freelancer and agreed price is retrieved by the backend.

This prevents a client from manually changing the booking value.

---

# Booking Snapshots

When a booking is created, important gig information is saved directly onto the booking.

This includes:

* Gig title.
* Gig category.
* Agreed price.

This allows booking history to remain readable even if the original gig is deleted later.

This change was made in response to previous assessment feedback.

---

# Atomic Booking Transactions

Booking creation and transaction creation are completed inside a MongoDB transaction.

Both operations must succeed together.

If transaction creation fails, the database transaction is rolled back and the booking is not left behind as incomplete data.

This improves data consistency and replaces the earlier manual rollback approach.

---

# Booking Cancellation and Refunds

Freelancers can cancel confirmed bookings.

The cancellation route is:

PATCH /api/bookings/:id/cancel

The freelancer provides a cancellation reason.

When a booking is cancelled:

* The booking remains stored for history.
* The status changes to cancelled.
* The cancellation reason is stored.
* The user responsible for the cancellation is stored.
* The cancellation date is stored.
* The related transaction is changed to refunded.

The booking is not deleted.

This keeps a clear history for the client, freelancer and administrator.

---

# Client Bookings

Clients can retrieve their bookings using:

GET /api/bookings/mine

---

# Freelancer Received Bookings

Freelancers can retrieve bookings for their services using:

GET /api/bookings/received

---

# Transactions and Income

When a valid booking is created, a corresponding transaction is created.

The transaction uses information from the backend rather than transaction values supplied directly by the client.

Freelancers can view income using:

GET /api/transactions/income

---

# Tax and Income Dashboard

The freelancer dashboard provides a financial overview.

It includes:

* Total completed income.
* Current-month income.
* Completed transaction count.
* Refunded transaction count.
* Refunded amount.
* Estimated tax.
* Estimated after-tax income.
* Monthly income.
* Monthly income visualisation.
* Transaction history.

The tax estimate is based on the SARS 2027 individual income tax rates for the tax year:

1 March 2026 to 28 February 2027.

The calculation uses progressive tax brackets rather than applying one flat percentage to all income.

The brackets used by the application are:

* Up to R245,100 - 18%.
* R245,101 to R383,100 - R44,118 plus 26% of the amount above R245,100.
* R383,101 to R530,200 - R79,998 plus 31% of the amount above R383,100.
* R530,201 to R695,800 - R125,599 plus 36% of the amount above R530,200.
* R695,801 to R887,000 - R185,215 plus 39% of the amount above R695,800.
* R887,001 to R1,878,600 - R259,783 plus 41% of the amount above R887,000.
* R1,878,601 and above - R666,339 plus 45% of the amount above R1,878,600.

For an individual under 65, HustleHub also applies the SARS 2027 primary rebate of:

R17,820.

The tax threshold for an individual under 65 is:

R99,000.

The estimated tax displayed by HustleHub is still an estimate.

HustleHub only knows about income earned through the platform.

The calculation does not include:

* Income earned outside HustleHub.
* Business expenses or deductions.
* Medical tax credits.
* Retirement deductions.
* Other tax credits.
* Additional age-related rebates.
* Individual tax circumstances.

The dashboard therefore provides a useful planning estimate but does not replace an official SARS assessment or professional tax advice.

---

# Admin Functionality

HustleHub includes a separate administrator role.

Administrator endpoints include:

GET /api/admin/summary

GET /api/admin/users

GET /api/admin/gigs

GET /api/admin/bookings

GET /api/admin/transactions

Only authenticated administrators may access these routes.

Clients and freelancers are rejected with:

403 Forbidden

The admin dashboard provides a central view of platform activity.

---

# Input Validation

User input is validated before it reaches the main application logic.

Validation is used for:

* Registration.
* Login.
* Gigs.
* Bookings.
* MongoDB Object IDs.

Unexpected fields are rejected where required.

Incorrect data types are also rejected.

---

# Error Handling

HustleHub uses centralised error handling.

This helps the API return controlled responses instead of exposing unnecessary internal information.

The error handler also writes application errors to the logging system.

Common response codes include:

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

423 Locked

500 Internal Server Error

---

# Rate Limiting

Rate limiting is used to reduce excessive requests to sensitive parts of the API.

Authentication requests are rate limited.

Booking creation is also protected using a separate rate limiter.

This provides an additional layer of protection against excessive or automated requests.

---

# Helmet and Content Security Policy

Helmet is used to add security-related HTTP headers to the backend.

The API includes security headers such as:

* Content-Security-Policy.
* X-Content-Type-Options.
* X-Frame-Options.

---

# Frontend Content Security Policy

The React frontend also includes Content Security Policy protection.

The policy restricts the types of resources the frontend is allowed to load.

The Docker Nginx configuration also provides security headers including:

* Content-Security-Policy.
* X-Content-Type-Options.
* X-Frame-Options.
* Referrer-Policy.

---

# CORS

CORS is configured to allow the HustleHub frontend to communicate with the backend.

The development frontend normally runs on port 5173.

The backend normally runs on port 3000 using HTTPS.

The frontend origin is controlled instead of allowing unrestricted browser origins.

---

# HTTPS Security

The HustleHub backend runs through HTTPS during local development.

The local development server uses a self-signed SSL certificate.

Because the certificate is locally generated, the browser, curl, Newman or Postman may display a certificate warning unless self-signed certificates are allowed.

The certificate and private key are not committed to the public repository.

---

# Environment Configuration

Sensitive configuration is stored using environment variables.

Environment values include:

PORT=3000

MONGO_URI=\<MongoDB Atlas connection string>

JWT_SECRET=\<JWT secret>

FRONTEND_ORIGIN=\<allowed frontend origin>

SSL_KEY_PATH=\<SSL private key path>

SSL_CERT_PATH=\<SSL certificate path>

Actual credentials are intentionally not included in this README.

The .env file must not be committed to GitHub.

GitHub Actions uses repository secrets for sensitive CI configuration.

---

# React Frontend

The HustleHub frontend was developed using React and Vite.

The frontend contains separate interfaces for each role.

## Homepage

The public homepage introduces HustleHub and directs users to login or registration.

## Login

The login page authenticates the user and redirects them according to their role.

## Registration

The registration page allows users to register as:

* Client.
* Freelancer.

Admin registration is intentionally unavailable.

## Client Dashboard

The client dashboard allows users to:

* Browse gigs.
* Search gigs.
* View gig information.
* Book gigs.
* View bookings.

## My Bookings

The My Bookings page allows clients to:

* View booking history.
* View the saved service title.
* View the freelancer.
* View booking value.
* View booking status.
* View cancellation information.

## Freelancer Dashboard

The freelancer dashboard allows users to:

* View their gigs.
* Create gigs.
* Edit gigs.
* Delete gigs.
* View received bookings.
* Cancel bookings.
* View income.
* View estimated tax.
* View monthly earnings.
* View refunds.
* View transaction history.

## Admin Dashboard

The admin dashboard allows administrators to:

* View platform statistics.
* Search users.
* View users.
* View gigs.
* View bookings.
* View cancellations.
* View transactions.
* View completed transaction value.
* View refund value.

---

# Frontend Testing

The React frontend is tested using:

* Vitest.
* React Testing Library.
* user-event.

## Login Tests

Login tests check that:

* The login form renders correctly.
* Valid login details are submitted.
* Controlled login errors are displayed.

## Registration Tests

Registration tests check that:

* The registration form renders correctly.
* A client account can be submitted.
* A freelancer account submits the correct role.
* Controlled registration errors are displayed.

## Gig and Freelancer Tests

Freelancer tests check that:

* Income information is displayed.
* Tax information is displayed.
* A freelancer can create a gig.
* A confirmed booking can be cancelled with a reason.

## Booking Tests

Booking tests check that:

* Client booking history is displayed.
* Saved gig titles remain visible after a gig is deleted.
* Cancellation information is displayed.
* Empty booking history is handled correctly.

## Frontend Test Result

The final frontend test run completed successfully.

Test Files: 4 passed

Tests: 15 passed

Failures: 0

## Run Frontend Tests

From the frontend folder:

npm test -- --run

---

# Backend Automated Tests

The backend includes automated Jest and Supertest testing.

The backend smoke test confirms that unknown API routes return a controlled:

404 Not Found

Backend tests can be run using:

npm test

---

# Postman and Newman Testing

Postman was used throughout development to manually test the HustleHub API.

A complete Postman collection was created for automated API integration testing using Newman.

---

# Automated API Tests

The Newman collection includes tests for:

* Client registration.
* Freelancer registration.
* Blocking public admin registration.
* Duplicate registration.
* Unexpected registration fields.
* Client login.
* Freelancer login.
* Missing login information.
* Invalid password data types.
* Invalid login credentials.
* Malformed JSON.
* Valid JWT authentication.
* Missing JWT authentication.
* Tampered JWT authentication.
* Strict Bearer token parsing.
* Role-based access control.
* Gig creation.
* Gig retrieval.
* Gig updates.
* Invalid MongoDB IDs.
* Booking role restrictions.
* Booking amount protection.
* Booking creation.
* Duplicate booking protection.
* Client booking retrieval.
* Freelancer received bookings.
* Freelancer income.
* Admin route restrictions.
* Security headers.
* Content Security Policy.
* Gig deletion.

---

# Newman Test Result

The final Newman run completed successfully.

Requests executed: 33

Requests failed: 0

Assertions executed: 44

Assertions failed: 0

## Run Newman Tests

The backend must be running before executing Newman.

From the project root:

npx newman run postman/HustleHub-Part2.postman_collection.json -e postman/HustleHub-Local.postman_environment.json --insecure

The --insecure option is required because HustleHub uses a locally generated self-signed HTTPS certificate.

---

# Static Code Analysis

ESLint is used for static code analysis.

The ESLint configuration checks for problems such as:

* Undefined variables.
* Unreachable code.
* Duplicate keys.
* Duplicate switch cases.
* Unused variables.
* Constant conditions.

Static analysis can be run using:

npm run lint

The static analysis step is also included in GitHub Actions.

This means serious linting errors can cause the CI job to fail instead of allowing the pipeline to silently report success.

---

# Dependency Security Analysis

npm audit is used to inspect dependencies for known security vulnerabilities.

The frontend dependency audit completed with:

0 vulnerabilities.

The backend production dependency audit also completed with:

0 vulnerabilities.

Development tooling such as testing packages is separated from production dependency checking so that the security check reflects the packages used by the running application.

---

# CI Pipeline

GitHub Actions is used to automatically check HustleHub when code is pushed to the main branch or when a pull request is created.

The workflow contains separate jobs for the backend, frontend, Newman API testing and Docker verification.

The pipeline performs:

1. Repository checkout.
2. Node.js setup.
3. Backend dependency installation.
4. Backend ESLint static analysis.
5. Backend Jest testing.
6. Backend production dependency security auditing.
7. Frontend dependency installation.
8. Frontend Vitest testing.
9. Frontend production build.
10. Frontend dependency security auditing.
11. Backend startup for API integration testing.
12. Automated Newman API testing.
13. Docker configuration and container verification steps.
14. A final CI success job that depends on the required jobs.

The pipeline is configured so that required commands return a failed job when tests, builds or security checks fail.

Sensitive values such as the MongoDB Atlas connection string are supplied through GitHub repository secrets.

The MongoDB URI is not written directly into the workflow file.

Newman has also been successfully executed as part of the GitHub Actions workflow.

Docker works locally using the supplied Dockerfiles and Docker Compose configuration.

---

# Docker

HustleHub can be run using Docker.

Separate Dockerfiles are provided for:

* Backend.
* Frontend.

Docker Compose is used to run both services together.

The frontend container uses Nginx to serve the production React build.

## Build and Start Docker

From the project root:

docker compose up --build

The backend is exposed on port:

3000

The frontend is exposed on port:

5173

## Stop Docker

docker compose down

Local Docker testing confirmed that the backend and frontend containers can run together.

---

# Database

MongoDB Atlas is used as the database for HustleHub.

The main collections include:

* Users.
* Gigs.
* Bookings.
* Transactions.

The MongoDB connection string is loaded through environment configuration rather than being hard-coded into the source code.

---

# Main Project Structure

HustleHub-Part2/

app.js

server.js

src/

    config/

    controllers/

    middleware/

    models/

    routes/

    validators/

    utils/

frontend/

    src/

        components/

        pages/

        services/

        test/

postman/

    HustleHub-Part2.postman_collection.json

    HustleHub-Local.postman_environment.json

    reports/

evidence/

    screenshots/

.github/

    workflows/

Dockerfile

docker-compose.yml

eslint.config.js

package.json

README.md

---

# Installation and Running the Application

## Requirements

The following software is required:

* Node.js.
* npm.
* MongoDB Atlas.
* Git.
* Docker Desktop for Docker testing.
* Postman or Newman for API testing.

## Install Backend Dependencies

From the project root:

npm install

## Install Frontend Dependencies

Open the frontend folder:

cd frontend

Then run:

npm install

---

# SSL Certificate

SSL files are intentionally excluded from GitHub.

Generate the local development certificate before starting the backend using:

npm run cert:generate

The certificate is intended for local development and assessment testing only.

---

# Start the Backend

From the project root:

npm run dev

The backend normally runs on HTTPS port 3000.

---

# Start the Frontend

Open a second terminal.

Move into the frontend folder:

cd frontend

Run:

npm run dev

The frontend normally runs on port 5173.

---

# Build the Frontend

From the frontend folder:

npm run build

---

# Security Review

The HustleHub application was reviewed against security threats that apply to a full-stack marketplace.

## Password Compromise

Threat:

Plain-text or weakly protected passwords could expose user accounts if the database is compromised.

Controls:

* bcrypt password hashing.
* Password validation.
* 72-byte bcrypt limit validation.

Mitigation:

Passwords are not stored as plain text and overly long bcrypt passwords are rejected before hashing.

## Brute-Force Login Attempts

Threat:

An attacker could repeatedly attempt passwords until an account is compromised.

Controls:

* Authentication rate limiting.
* Failed login tracking.
* Account lockout after five failed attempts.

Mitigation:

Repeated requests are restricted and the account is temporarily locked after repeated failures.

## Broken Access Control

Threat:

A user could attempt to access functionality belonging to another role or another account.

Controls:

* JWT authentication.
* Role-based access control.
* Ownership checks.
* Protected frontend routes.

Mitigation:

The backend verifies identity, role and resource ownership before allowing protected operations.

## Input Attacks

Threat:

Malformed or unexpected input may cause unwanted application behaviour.

Controls:

* express-validator.
* Input sanitisation.
* Unexpected field rejection.
* MongoDB Object ID validation.

Mitigation:

Invalid input is rejected before reaching important application logic.

## Booking Price Manipulation

Threat:

A client could attempt to submit a lower booking price from the browser.

Controls:

The booking only receives the gig ID from the client.

Price and freelancer information are loaded by the backend.

Mitigation:

The client cannot control the transaction amount directly.

## Incomplete Booking Data

Threat:

A booking could be created successfully while the related transaction fails.

Controls:

MongoDB multi-document transactions.

Mitigation:

Booking and transaction creation either complete together or are rolled back together.

## Cross-Site Scripting and Resource Injection

Threat:

Unexpected scripts or browser resources could be loaded by the application.

Controls:

* Helmet.
* Backend Content Security Policy.
* Frontend Content Security Policy.
* Nginx security headers.

Mitigation:

The browser is restricted to approved resource sources.

## Cross-Origin Browser Access

Threat:

JavaScript running from an unapproved origin could attempt to communicate with the API.

Controls:

CORS configuration.

Mitigation:

Allowed frontend origins are controlled through application configuration.

## Information Disclosure

Threat:

Unexpected errors could reveal stack traces or internal information to users.

Controls:

Centralised error handling and controlled responses.

Mitigation:

Internal error details are logged while the client receives a controlled response.

## Secret Exposure

Threat:

Database credentials, JWT secrets or SSL private keys could be exposed through source control.

Controls:

* Environment variables.
* .gitignore.
* GitHub repository secrets.

Mitigation:

Sensitive configuration is kept outside committed application code.

## Undetected Security Activity

Threat:

Suspicious activity could occur without any audit trail.

Controls:

Winston application, error and security logging.

Mitigation:

Important events are recorded so they can be reviewed later.

---

# Security Measures Implemented

The main security measures implemented in HustleHub include:

* bcrypt password hashing.
* bcrypt 72-byte password validation.
* JWT authentication.
* Strict Bearer token validation.
* Account lockout.
* Role-based access control.
* Frontend protected routes.
* Backend ownership checks.
* Input validation.
* Input sanitisation.
* Unexpected field rejection.
* MongoDB Object ID validation.
* MongoDB transactions.
* HTTPS.
* Helmet.
* Backend Content Security Policy.
* Frontend Content Security Policy.
* CORS configuration.
* Authentication rate limiting.
* Booking rate limiting.
* Environment variables.
* GitHub repository secrets.
* Centralised error handling.
* Controlled API responses.
* Security logging.
* Application logging.
* Dependency security auditing.
* Prevention of public administrator registration.

---

# Limitations

The application is mainly designed for local development and assessment.

The SSL certificate is self-signed and is not intended for a production environment.

The system does not currently use a real payment provider.

Transactions are generated internally when valid bookings are created.

The tax dashboard is an estimate based only on HustleHub income and cannot account for every taxpayer's complete financial situation.

Cloud-based centralised logging was not implemented.

The application uses local Winston log files for assessment evidence.

Docker has been successfully tested locally.

A production version would require additional infrastructure such as:

* Production hosting.
* Production SSL certificates.
* More restrictive production database network rules.
* Secure cloud secret management.
* A real payment provider.
* Cloud monitoring and centralised logging.
* Backup and recovery processes.

---

# Future Improvements

HustleHub could be expanded by adding:

* A real payment gateway.
* Freelancer ratings and reviews.
* Client and freelancer messaging.
* Email notifications.
* Password reset functionality.
* Profile images.
* Gig images.
* Additional booking status options.
* Cloud deployment.
* Production SSL certificates.
* Cloud-based logging and monitoring.
* More automated browser integration tests.
* Backup and disaster recovery functionality.

---

# Conclusion

The Final POE develops HustleHub into a complete secure full-stack marketplace.

Clients can register, log in, browse gigs, create bookings and view booking history.

Freelancers can register, create and manage gigs, receive bookings, cancel bookings and monitor their income.

Freelancers also have access to monthly income information, SARS-based estimated tax information, refund history and transaction history.

Administrators have their own protected control centre for monitoring users, services, bookings and transactions.

Security is applied throughout the application using password hashing, JWT authentication, role-based access control, account lockout, input validation, HTTPS, Helmet, Content Security Policy, CORS, rate limiting, logging, dependency auditing and controlled error handling.

Testing was completed on both the frontend and backend.

The final frontend test suite completed:

15 tests with 0 failures.

The final Newman API collection completed:

33 requests and 44 assertions with 0 failures.

Backend production dependencies and frontend dependencies were also checked using npm audit.

Both production dependency checks returned:

0 vulnerabilities.

The application also includes static code analysis, GitHub Actions automation and Docker containerisation.

These results demonstrate that the main HustleHub functionality and security controls work together as expected.

---

# Code Attribution and Online Sources

The implementation of HustleHub was completed using the module material, lecturer guidance, official documentation and security guidance.

The following online sources were used as references during development.

## South African Revenue Service - Individual Tax Rates

Used for:

* The 2027 individual income tax brackets.
* The tax year from 1 March 2026 to 28 February 2027.
* The R17,820 primary rebate.
* The R99,000 tax threshold for individuals under 65.
* The progressive tax calculation used by the freelancer tax dashboard.

Source:

South African Revenue Service. 2026. Rates of Tax for Individuals. SARS official website.

## South African Revenue Service - Personal Income Tax

Used for:

* Understanding personal taxable income.
* Confirming the 2027 individual tax threshold.
* Supporting the explanation that actual tax can depend on income outside HustleHub and individual circumstances.

Source:

South African Revenue Service. 2026. Personal Income Tax. SARS official website.

## OWASP Password Storage Cheat Sheet

Used for:

* Password storage security guidance.
* bcrypt password hashing.
* Understanding the bcrypt 72-byte input limitation.
* Supporting the decision to reject passwords above the supported bcrypt byte limit.

Source:

OWASP Foundation. Password Storage Cheat Sheet. OWASP Cheat Sheet Series.

## OWASP Authentication Cheat Sheet

Used for:

* Secure authentication concepts.
* Login security.
* Account lockout considerations.
* Reducing brute-force login risks.

Source:

OWASP Foundation. Authentication Cheat Sheet. OWASP Cheat Sheet Series.

## OWASP Authorization Cheat Sheet

Used for:

* Role-based access control concepts.
* Checking authorisation on protected routes.
* Supporting backend ownership and role checks.

Source:

OWASP Foundation. Authorization Cheat Sheet. OWASP Cheat Sheet Series.

## OWASP Input Validation Cheat Sheet

Used for:

* Input validation practices.
* Rejecting invalid input.
* Sanitising submitted information.
* Reducing malformed or malicious request data.

Source:

OWASP Foundation. Input Validation Cheat Sheet. OWASP Cheat Sheet Series.

## OWASP Error Handling Cheat Sheet

Used for:

* Controlled error responses.
* Preventing unnecessary internal information from being returned to clients.
* Supporting the centralised error-handling approach.

Source:

OWASP Foundation. Error Handling Cheat Sheet. OWASP Cheat Sheet Series.

## OWASP Logging Cheat Sheet

Used for:

* Security logging concepts.
* Recording important security and audit events.
* Supporting the Winston security logging approach.

Source:

OWASP Foundation. Logging Cheat Sheet. OWASP Cheat Sheet Series.

## Node.js Documentation

Used for:

* Node.js runtime functionality.
* Working with the HTTPS server.
* File and environment functionality used by the backend.

Source:

OpenJS Foundation. Node.js Documentation.

## Express.js Documentation

Used for:

* Express application structure.
* REST API routing.
* Middleware.
* Error-handling flow.
* Request and response handling.

Source:

Express.js. Express Documentation.

## Express CORS Middleware Documentation

Used for:

* Configuring CORS response headers.
* Restricting browser access to approved frontend origins.

Source:

Express.js. CORS Middleware Documentation.

## React Documentation

Used for:

* React components.
* Hooks.
* State management.
* Building the frontend user interfaces.

Source:

Meta Platforms. React Documentation.

## React Router Documentation

Used for:

* Client-side routing.
* Dashboard navigation.
* Protected frontend routes.
* Redirect behaviour.

Source:

React Router. React Router Documentation.

## Vite Documentation

Used for:

* React development environment.
* Frontend development server.
* Production frontend builds.

Source:

Vite. Vite Documentation.

## MongoDB Documentation

Used for:

* MongoDB Atlas database concepts.
* MongoDB connections.
* Multi-document transactions.
* Atomic booking and transaction processing.

Source:

MongoDB Inc. MongoDB Documentation.

## Mongoose Documentation

Used for:

* Mongoose schemas and models.
* Database queries.
* Object population.
* MongoDB sessions and transaction handling.

Source:

Mongoose. Mongoose Documentation.

## bcrypt Documentation

Used for:

* Password hashing.
* Password comparison.
* The documented 72-byte bcrypt password limit.

Source:

bcrypt npm package documentation.

## JSON Web Token Documentation

Used for:

* JWT authentication concepts.
* Token signing and verification.
* Protected API access.

Source:

JSON Web Token package and JWT documentation.

## express-validator Documentation

Used for:

* Registration validation.
* Login validation.
* Gig and booking validation.
* Input sanitisation.

Source:

express-validator. Official Documentation.

## express-rate-limit Documentation

Used for:

* Authentication rate limiting.
* Booking request limiting.
* Protecting routes against excessive automated requests.

Source:

express-rate-limit. Official Documentation.

## Helmet Documentation

Used for:

* HTTP security headers.
* Content Security Policy.
* Backend browser security configuration.

Source:

Helmet. Official Documentation.

## Axios Documentation

Used for:

* Frontend API requests.
* Axios instance configuration.
* Request interceptors.
* Automatically adding JWT authentication headers.

Source:

Axios. Official Documentation.

## Vitest Documentation

Used for:

* Frontend test configuration.
* Running automated React tests.
* Test environment configuration.

Source:

Vitest. Official Documentation.

## React Testing Library Documentation

Used for:

* Testing frontend behaviour from the user's perspective.
* Rendering React components.
* Querying page content and controls.
* Simulating frontend interactions.

Source:

Testing Library. React Testing Library Documentation.

## Jest Documentation

Used for:

* Backend automated testing.
* Test structure.
* Assertions.
* Running the backend test suite.

Source:

Jest. Official Documentation.

## Supertest Documentation

Used for:

* Sending HTTP requests to the Express application during automated tests.
* Testing API responses without manually starting the production server.

Source:

Supertest. Package Documentation.

## Postman Documentation

Used for:

* Manual API testing.
* Creating the automated Postman collection.
* Environment variables.
* API assertions.

Source:

Postman. Official Documentation.

## Newman Documentation

Used for:

* Running Postman collections through the command line.
* Automated API integration testing.
* Running the Postman tests as part of GitHub Actions.

Source:

Postman. Newman Documentation.

## ESLint Documentation

Used for:

* Static code analysis.
* ESLint flat configuration.
* Configuring rule severity.
* Detecting common JavaScript programming errors.
* Failing CI when configured error-level rules are violated.

Source:

ESLint. Official Documentation.

## npm Documentation

Used for:

* npm dependency installation.
* npm audit.
* Dependency vulnerability checks.
* Security audit behaviour in GitHub Actions.

Source:

npm. npm Documentation.

## GitHub Actions Documentation

Used for:

* Creating the CI workflow.
* Running jobs on GitHub-hosted runners.
* Running tests and builds automatically.
* Repository secrets.
* Pipeline failure behaviour.

Source:

GitHub. GitHub Actions Documentation.

## Docker Documentation

Used for:

* Backend Dockerfile configuration.
* Frontend Dockerfile configuration.
* Building application container images.
* Running containers.

Source:

Docker Inc. Docker Documentation.

## Docker Compose Documentation

Used for:

* Defining the frontend and backend services.
* Building both containers together.
* Starting and stopping the application environment.

Source:

Docker Inc. Docker Compose Documentation.

## Nginx Documentation

Used for:

* Serving the production React build inside the frontend container.
* SPA fallback behaviour.
* Frontend HTTP security headers.

Source:

F5 Nginx. Nginx Documentation.

## Winston Documentation

Used for:

* Application logging.
* Security logging.
* Multiple log transports.
* Error and security log files.

Source:

Winston. Official Project Documentation.

## dotenv Documentation

Used for:

* Loading environment configuration.
* Keeping database credentials and JWT secrets outside application source code.

Source:

dotenv. Package Documentation.

---

# References

Docker Inc. Docker Documentation. Online technical documentation.

Docker Inc. Docker Compose Documentation. Online technical documentation. 

ESLint. Official ESLint Documentation. Online technical documentation. 

Express.js. Express Documentation. Online technical documentation. 

Express.js. CORS Middleware Documentation. Online technical documentation. 

GitHub. GitHub Actions Documentation. Online technical documentation. 

Helmet. Official Documentation. Online technical documentation. 

Jest. Jest Documentation. Online technical documentation. 

Meta Platforms. React Documentation. Online technical documentation. 

MongoDB Inc. MongoDB Documentation. Online technical documentation. 

Mongoose. Mongoose Documentation. Online technical documentation. 

Node.js. Node.js Documentation. OpenJS Foundation. Online technical documentation.
npm. npm Audit Documentation. Online technical documentation. Accessed November 2026.

OWASP Foundation. Error Handling Cheat Sheet. OWASP Cheat Sheet Series. Online security guidance. 

React Router. React Router Documentation. Online technical documentation. 

South African Revenue Service. 2026. Personal Income Tax. SARS official online guidance. 

South African Revenue Service. 2026. Rates of Tax for Individuals. SARS official online tax 

Testing Library. React Testing Library Documentation. Online technical documentation. 

Vite. Vite Documentation. Online technical documentation. 
Vitest. Vitest Documentation. Online technical documentation. 

Winston. Winston Logging Documentation. Online technical documentation. 

bcrypt. bcrypt npm Package Documentation. Online package documentation.
express-rate-limit. Official Documentation. Online technical documentation. 


# AI Declaration

ChatGPT was used as a supporting tool during the HustleHub project.

It was used to assist with:

* Understanding technical concepts.
* Explaining errors.
* Assisting with Docker troubleshooting.
* Researching and explaining the SARS tax calculation used in the Final POE.

A shared ChatGPT conversation link https://chatgpt.com/share/6af22ea5-3008-83e9-bc0e-3d0b7c04d83f 

All lecturer notes, module material and assessment feedback were also used during development.