import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// get endpoint for all log files in log directory
export async function GET() {

    try {
        // unix log directory
        const logsDirectory = '/var/log/';

        // get all files
        const files = fs.readdirSync(logsDirectory);

        // filter out non-log files
        const logFiles = files.filter((file) => {
            const filePath = path.join(logsDirectory, file);
            return fs.statSync(filePath).isFile() && file.endsWith('.log');
        });

        // return list of log files
        return NextResponse.json({ logFiles });

    } catch (error) {

        // log error to console
        console.error('Error reading log directory:', error);

        // return error message
        return NextResponse.json({ error: 'Unable to list log files' }, { status: 500 });
    }
}

// post endpoint for all logs in specified file
export async function POST(request) {

    try {
        // extract query parameters
        const { filename, numEntries, keyword } = await request.json();

        // specify directory
        const logFilePath = '/var/log/' + filename;
        // const logFilePath = path.join(process.cwd(), 'public', 'logs', filename);

        // check if file exists
        if (!fs.existsSync(logFilePath)) {

            // return error message
            return NextResponse.json({ error: 'File does not exist' }, { status: 404 });
        }

        // read the file and split by lines
        const logContent = fs.readFileSync(logFilePath, 'utf-8');
        const lines = logContent.split('\n').filter(line => line);

        // filter by keyword and limit to the last numEntries
        const filteredLines = lines
            .filter(line => line.toLowerCase().includes(keyword.toLowerCase()))
            .slice(-numEntries)
            .reverse();

            // return logs
        return NextResponse.json({ logs: filteredLines });

    } catch (error) {

        // return error message
        return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
    }
}