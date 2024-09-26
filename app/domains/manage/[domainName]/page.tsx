'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DNSRecordsTable from '@/components/DNSRecordsTable';
import {Loader2} from "lucide-react";

type DNSRecord = {
    id: string;
    type: string;
    host: string;
    answer: string;
    ttl: number;
    prio: string;
    created: string;
};

const DomainRecords = () => {
    const params = useParams();
    const domainName = params?.domainName as string | '';

    const [records, setRecords] = useState<DNSRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const apiKey = localStorage.getItem('apiKey');
        const provider = localStorage.getItem('dnsProvider');

        const fetchData = async () => {
            if (!domainName) return;

            try {
                const response = await fetch('/api/details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, apiKey, provider, domainName }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setRecords(data.records as DNSRecord[]);
                setIsLoading(false);
            } catch (error) {
                setError((error as Error).message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [domainName]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoading) {
        return (<div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin"/>
        </div>);
    }

    return (
        <div className="mx-4">
            <h1 className="text-center my-4">Manage Records for {domainName}</h1>
            <DNSRecordsTable data={records} domainName={domainName}/>
        </div>
    );
};

export default DomainRecords;
