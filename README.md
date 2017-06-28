# Product List Manager 

##Installation

####Required technlogies:
* **NodeJS**
used node version: **v8.1.2** - minimal tested version: **v6.5.0**
* **npm** v3.10.3

####Procedure:
* run npm install at the root of the project :  **./npm install**
* run npm install at the root of the aurelia client project **./server/client//Products List Manage/ npm install**
* ####Install aurelia CLI
  #####build aurelia project
* run aurelia build command from client root directory: **./server/client//Products List Manage/ au build --env prod**

####Edit configuration file to run the node server
* **Copy** ./config.default.js  in ./config.js
* **Edit** ./config.js

  This project **does not** use mySQL server. You can leave the MySQLServer parameters as they are.
  
  You can edit as needed the **host** address and the **port** number. Default are ip 127.0.0.1 on port 8080

###RUN SERVER

**./server/node main.js**

If everything was installed correctly, you should see an output similar to the following:

    INFO: [_Server.js:38]		no mySQL configuration has been passed to constructor. This server will not have a MySQL Database

    INFO: [main.js:41]		Project List Manager - Rest Server started and listening on port 8080!

    LOG: [_Server.js:54]		git version aurelia-client: 382ba6a

**access the application from your browser ** http://hostaddress:8080/
