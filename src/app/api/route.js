import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // unix log directory
        const logsDirectory = '/var/log/';

        // read contents
        const files = fs.readdirSync(logsDirectory);

        // fetch only log files
        const logFiles = files.filter((file) => {
            const filePath = path.join(logsDirectory, file);
            return fs.statSync(filePath).isFile() && file.endsWith('.log');
        });

        // return list of log files
        return NextResponse.json({ logFiles });

    } catch (error) {

        console.error('Error reading log directory:', error);

        return NextResponse.json({ error: 'Unable to list log files' }, { status: 500 });
    }
}

export async function POST(request) {

    try {
        const { filename, numEntries, keyword } = await request.json();

        // only allow log files within the /var/log directory
        const logFilePath = '/var/log/' + filename;
        // const logFilePath = path.join(process.cwd(), 'public', 'logs', filename);

        if (!fs.existsSync(logFilePath)) {
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

        return NextResponse.json({ logs: filteredLines });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
    }
}