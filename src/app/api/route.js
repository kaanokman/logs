import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {

        // Folder for logs in the public directory
        const logsDirectory = path.join(process.cwd(), 'public', 'logs');
        // const logsDirectory = '/var/log/';

        // Read the contents of the 'logs' directory
        const files = fs.readdirSync(logsDirectory);

        // Filter out only .log files and avoid directories
        const logFiles = files.filter((file) => {
            const filePath = path.join(logsDirectory, file);
            return fs.statSync(filePath).isFile() && file.endsWith('.log');
        });

        return NextResponse.json({ logFiles });
    } catch (error) {
        console.error('Error reading log directory:', error); // Log the exact error

        return NextResponse.json({ error: 'Unable to list log files' }, { status: 500 });
    }
}

export async function POST(request) {

    try {
        const { filename, numEntries, keyword } = await request.json();

        // Only allow log files within the /var/log directory
        // const logFilePath = '/var/log/' + filename;
        const logFilePath = path.join(process.cwd(), 'public', 'logs', filename);

        // Read the file and split by lines
        const logContent = fs.readFileSync(logFilePath, 'utf-8');

        const lines = logContent.split('\n').filter(line => line);

        // Filter by keyword and limit to the last numEntries
        const filteredLines = lines
            .filter(line => line.toLowerCase().includes(keyword.toLowerCase()))
            .slice(-numEntries)
            .reverse();

        return NextResponse.json({ logs: filteredLines });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
    }
}
