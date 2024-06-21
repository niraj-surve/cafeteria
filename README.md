# Cafeteria
<p>Cafeteria is a web application for the local cafeteria allows user to order the food item from the listed items on the website. This web application is built using MERN Stack. (MongoDB | EXPRESSJS | REACTJS | NODEJS)</p>

---

## Steps to setup the project in Windows
**<p style="text-align: center;">Clone the repository using</p>** 
&emsp;`git clone https://github.com/niraj-surve/Cafeteria`<br>
<p style="text-align: center;">or</p>
<p style="text-align: center;">Download the repository as zip</p>

---
### *Frontend Setup*

**1. Open the project in vscode**

<br>

**2. Open terminal and Go to frontend**
<br>&emsp;`cafeteria > cd frontend`

<br>

**3. Run the following command to install all the frontend dependencies**
<br>&emsp;`cafeteria > frontend > npm install`

<br>

**4. Create .env file in frontend folder and set following variable**
<br>&emsp;`VITE_APP_API_URL = http://localhost:3000/api/v1`

---

### *Backend Setup*

<br>

**1. Open new terminal and Go to backend**
<br>&emsp;`cafeteria > cd backend`

<br>

**3. Run the following command to install all the backend dependencies**
<br>&emsp;`cafeteria > backend > npm install`

<br>

**4. Create .env file in backend folder and set following Variables**
<br>&emsp;`PAYMENT_ID = PGTESTPAYUAT86`
<br>&emsp;`PAYMENT_SECRET = 96434309-7796-489d-8924-ab56988a6076`
<br>&emsp;`API_SECRET = secret1234`
<br>&emsp;`MONGO_URI = <YOUR_MONGO_URL>`
> Replace <YOUR_MONGO_URL> with your mongoDB atlas connection string<br><br>
Go to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) to create mongodb cloud database

<br>

**5. Open the `paymentService.js` file from following path**
<br>&emsp;`backend > src > services > paymentService.js`

<br>

**6. Change the redirectUrl in `createPaymentSession` function**
<br>&emsp;**From** 
```js
redirectUrl: `https://cafeteria-l4ic.onrender.com/api/v1/payment/${merchantTransactionId}`
```
&emsp;**To** 
```js
redirectUrl: `http://localhost:3000/api/v1/payment/${merchantTransactionId}`
```
<br>

**7. Change the res.redirect in `validatePayment` function**
<br>&emsp;**From** 
```js
res.redirect("https://cafeteria-famt.netlify.app/successPayment?status=success");`
```
&emsp;**To** 
```js
res.redirect("http://localhost:5173/successPayment?status=success");`
```
