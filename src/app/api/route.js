import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// get endpoint for all log files in log directory
export async function GET() {

    try {
        // unix log directory
        const logsDirectory = '/var/log/';

        // get all files
        // const files = fs.readdirSync(logsDirectory);
        const files = await fs.promises.readdir(logsDirectory);

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
        // const logFilePath = '/var/log/' + filename;
        const logsDirectory = '/var/log/';
        const logFilePath = path.resolve(logsDirectory, filename);

        if (!logFilePath.startsWith(logsDirectory)) {
            return NextResponse.json({ error: 'Access to this file is restricted' }, { status: 403 });
        }

        // const logFilePath = path.join(process.cwd(), 'public', 'logs', filename);

        // check if file exists
        if (!fs.existsSync(logFilePath)) {

            // return error message
            return NextResponse.json({ error: 'File does not exist' }, { status: 404 });
        }

        // process file line by line using a "stream"
        const stream = fs.createReadStream(logFilePath, 'utf-8');
        const rl = readline.createInterface({ input: stream });

        const matchingLines = [];
        const keywordLower = keyword.toLowerCase();

        for await (const line of rl) {

            if (line.trim() === '') {
                continue;
            }

            if (keyword && !line.toLowerCase().includes(keywordLower)) {
                continue;
            }
            matchingLines.push(line);

            // only keep numEntries in memory to display instead of loading then filtering
            if (matchingLines.length > numEntries) {
                matchingLines.shift();
            }
        }

        rl.close();

        // return logs
        return NextResponse.json({ logs: matchingLines });

    } catch (error) {

        // return error message
        return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
    }
}