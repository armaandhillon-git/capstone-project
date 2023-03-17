
**Table of Contents**

[TOCM]

[TOC]


# Share It Wep application
Share It is a web application where students can create an account and share products they no longer need, then other students can contact them through the website.

### Installation
This is a NodeJs web application. Ensure  you have the  latest version installed and NPM. Also you must have a  MySQL   database access. 

**First Clone this repo**
   ```bash
 $ git clone https://github.com/armaandhillon-git/share-it
//Change directory to the share-it folder
$ cd share-it
//install project dependency
$ npm install
```
	

Open the .env file and update with your database credentails and Port number the application will run on.

### Database setup
Download the sql file [here](https://github.com/armaandhillon-git/share-it/blob/main/docs/share_it.sql "here"). Is in the docs folder.
Create your database and import this sql file.

### Permission Setting.
Images are save in the public/uploads folder. ensure this folder allows write and read access. You can do this with the following command in Ubuntu server
```bash
$ cd public
$ sudo chmod -R 775 uploads

```
### Running the  Application
You can simply run the application by the following steps
```bash
$ cd share-it
$ node index.js
// This should start the server and show the following message:
// Running  on port PORT_NUMBER

```
Now you can open your browser and  enter your ip address or localhost and explore the application. Remember to include port number if it is not default http 80

**To daemonize the application, please look at this post **
[How To Use PM2 to Setup a Node.js Production Environment On An Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps "How To Use PM2 to Setup a Node.js Production Environment On An Ubuntu VPS")

**VERY IMPORTANT NOTE:**
The application need an admin user to add item categories, add plocations and manage other users posts. To achieve this, create the user on the website. Then go to your database and update the user. **All you have to do is to chnage the role  attribute  to 1**. 
```sql
UPDATE user SET role = 1 WHERE email = 'admin@example.com';
```
After this, you can now  login as an admin of the application.

## Resources:
**Please look at the docs folder**

### ER Diagram
![Share It ERD](https://github.com/armaandhillon-git/share-it/blob/main/docs/share-it-ERD.png?raw=true "Share It ERD")

### Flow Diagram
![Share It flow](https://github.com/armaandhillon-git/share-it/blob/main/docs/Share-it.png?raw=true "Share It flow")



