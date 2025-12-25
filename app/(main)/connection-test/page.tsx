'use client';
import { useEffect, useState } from 'react';

export default function ConnectionTest() {
    const [status, setStatus] = useState('Loading...');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Fetch from the backend root endpoint
                const res = await fetch('http://localhost:5000/');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const json = await res.json();
                setData(json);
                setStatus('Backend Connected! ✅');
            } catch (err: any) {
                setStatus(`Connection Failed ❌: ${err.message}`);
                console.error(err);
            }
        };
        checkConnection();
    }, []);

    return (
        <div className="p-10 bg-white min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
            <div className={`text-xl mb-4 font-semibold ${status.includes('Connected') ? 'text-green-600' : 'text-red-600'}`}>
                {status}
            </div>
            {data && (
                <div className="border p-4 rounded bg-gray-50">
                    <h2 className="font-bold mb-2">Response Data:</h2>
                    <pre className="whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
            <p className="mt-6 text-sm text-gray-500">
                Target URL: http://localhost:5000/
            </p>
        </div>
    );
}
