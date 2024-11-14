'use client';

import { useEffect, useState } from 'react';
import "./style.css"

export default function HomePage() {
    const [filename, setFilename] = useState('');
    const [numEntries, setNumEntries] = useState('');
    const [keyword, setKeyword] = useState('');
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logFiles, setLogFiles] = useState([]);

    // Fetch the list of log files on component mount
    useEffect(() => {
        async function fetchLogFiles() {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                setLogFiles(data.logFiles || []);
            } catch (error) {
                setError('Unable to load log files');
            }
        }

        fetchLogFiles();
    }, []);

    const handleFetchLogs = async () => {
        setError(null);
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename,
                    numEntries: parseInt(numEntries, 10),
                    keyword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred');
            }

            const data = await response.json();
            setLogs(data.logs);
            setError(null);
        } catch (err) {
            setError(err.message);
            setLogs([]);
        }
    };

    return (
        <div className="wrapper">

            <div className="panel">

                <h1>Logs Viewer</h1>

                <div className="item">
                    <h2>Available Log Files</h2>

                    {logFiles.length === 0 ? (
                        <p>No log files found</p>
                    ) : (
                        <ul className='list'>
                            {logFiles.map((file) => (
                                <li className="list-item" key={file}>
                                    {file}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <form className="form" onSubmit={(e) => { e.preventDefault(); handleFetchLogs(); }}>

                    <div className='item'>
                        <label className='label'>Filename:</label>
                        <input
                            className='input'
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            required
                        />
                    </div>
                    <div className='item'>

                        <label className='label'>Number of Entries:</label>
                        <input
                            className='input'
                            type="number"
                            value={numEntries}
                            onChange={(e) => setNumEntries(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    <div className='item'>
                        <label className='label' >Keyword Filter (optional):</label>
                        <input
                            className='input'
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <button className='button' type="submit" onClick={handleFetchLogs}>Fetch Logs</button>

                </form>

                <div className="item">
                    <h2>Log Output:</h2>

                    <pre className='logs'
                        style={{
                            color: error ? 'red' : 'inherit'
                        }}
                    >
                        {error ? error : logs.join('\n')}
                    </pre>

                </div>
            </div>
        </div>
    );
}
