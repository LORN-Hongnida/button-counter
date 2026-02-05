# BUTTON-COUNTER APP FOR MR. IWASAKI CLASS
This is a simple app that will increase your counter by one every time someone presses a button. 
This project is for practicing the usage of TypeScript and DB integration.

# HOW TO SETUP THE DEVELOPMENT ENVIRONMENT AND DEPENDENCIES ON YOUR COMPUTER:

### 0. Prerequisites:
Ensure that you have these prerequisites installed and set up on your computer:
- Node.js
- Node Package Manager (npm)
  
### 1. Cloning the repository:
```bash
git clone https://github.com/LORN-Hongnida/button-counter.git
cd button-counter
```
### 2. Installing the repository:
```bash
npm install
```
### 3. Compiling the TypeScript files (Optional):
```bash
npx tsc
```
It's okay if you skip this step, this is only for checking if there is any errors in the code.
We will use Step 5 to run our app on your browser.
### 4. Configuring the .env file:
- For Windows Users:
```bash
copy .env.example .env
```
- For MacOS/Linux Users:
```bash
cp .env.example .env
```
After you run the command, input your database URL and Auth Token into your .env file. 
(If you are my teammates, I have provided our team's Turso DB URL and Auth Token).

### 5. Running the app:
```bash
npm run dev
```
After that your code should run on http://localhost:5173



