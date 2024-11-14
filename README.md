This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Step 1: 
Navigate to the directory you would like to save the repository in via terminal and clone this repository:

```bash
git clone https://github.com/kaanokman/logs.git
```

## Step 2:
Navigate to the directory of the saved repository:

```bash
cd logs
```

## Step 3:
Make sure you have Node installed:

[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

## Step 4:
Install the dependencies that are required to run the app:

```bash
npm i
```

## Step 5:
Run the app:
```bash
npm run dev
```

Now you can go to [http://localhost:3000](http://localhost:3000) with your browser to open the app and interact with the API.

## Details:
- Assumes the user is on a UNIX system.
- Displays the system's available log files in the directory "/var/log".
- Capitaliazation of the keyword input is ignored.
- User can not fetch logs without specifying at least a filename and a number of entries greater than 0.
- "Fetch Logs" button is disabled if no log files are found or if the directory does not exist.
- Error messages are displayed under either "Available Log Files:" or "Log Output" if:
  - No log files are found in "/var/log" directory or the directory DNE.
  - File does not exist in "/var/log" directory.
  - Log file is empty.
