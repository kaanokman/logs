'use client';

import { useEffect, useState } from 'react';
import "./style.css"

export default function HomePage() {

    // state variables
    const [filename, setFilename] = useState('');
    const [numEntries, setNumEntries] = useState('');
    const [keyword, setKeyword] = useState('');
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logFiles, setLogFiles] = useState([]);

    // fetches all available log files to choose from upon mount
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

    // hanlder for fetching logs from selected file
    const handleFetchLogs = async () => {

        // clear error if any
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
            console.log(data)
            setLogs(data.logs);

        } catch (error) {
            setError(error.message);
            setLogs([]);
        }
    };

    return (
        <div className="wrapper">

            <div className="panel">

                <h1>Logs Viewer</h1>

                <div className="item">

                    <h2> Available Log Files: </h2>

                    <ul className='list'>
                        {logFiles.length === 0 ? (
                            <p className='list-item'
                            style={{
                                color: 'red'
                            }}
                        >
                            No log files found
                        </p>
                        ) : (

                        <>

                        {logFiles.map((file) => (
                            <li className="list-item" key={file}>
                                {file}
                            </li>
                        ))}

                        </>

                        )}
                    </ul>
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

                    <button className='button' disabled={logFiles.length === 0} type="submit">Fetch Logs</button>

                </form>

                <div className="item">
                    <h2>Log Output:</h2>

                    <pre className='logs'
                        style={{
                            color: error ? 'red' : 'inherit'
                        }}
                    >
                        {error ? error : (logs.length > 0 && logs.join('\n'))}
                    </pre>

                </div>
            </div>
        </div>
    );
}
