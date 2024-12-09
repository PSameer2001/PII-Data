# PII-Data

User: 
1. Register using name, email and password
2. login using email and password
3. After login it stores the token in cookie for authentication
4. Access the Home page for add the personal information 
5. For Now No document upload is implemented.
6. Logout Functionality


Admin :
1. login using email and password
2. Access the Home page for view all data
3. logout


Flow of the backend:
1. In index.js hapi Server is created 
2. In config/conn , db connected with the sequelize to do operations
3. Created models in models folder which is like a table and column to be sync with database and syncing logic is added in config/sync file.
4. In routers folder all routes are added for user and admin.
5. For validation and authorization added in routerOption folder which is linked to routes in routers folder.
6. All handler function is added in controller folder which is linked to routes in routers folder.

