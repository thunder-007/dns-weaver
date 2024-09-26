"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";

interface Domain {
    domainName: string;
    locked: boolean;
    expireDate: string;
    createDate: string;
}

export default function ManagePage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDomains = async () => {
            const username = localStorage.getItem('username');
            const apiKey = localStorage.getItem('apiKey');
            const provider = localStorage.getItem('dnsProvider');
            if (!username || !apiKey || provider !== 'Name.com') {
                setError('Missing credentials or invalid provider. Please go back and try again.');
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch('/api/domains', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, apiKey , provider }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch domains');
                }

                const data = await response.json();
                setDomains(data.domains);
            } catch (error) {
                const errorMessage = (error as Error).message || 'An error occurred while fetching domains. Please try again.';
                setError(`An error occurred while fetching domains. Please try again. ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, []);

    const handleBack = () => {
        router.push('/');
    };

    const handleCardClick = (domainName: string) => {
        router.push(`/domains/manage/${domainName}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center mb-4">{error}</p>
                        <Button onClick={handleBack} className="w-full">Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Manage Domains</h1>
            {domains.length === 0 ? (
                <p>No domains found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {domains.map((domain) => (
                        <Card
                            key={domain.domainName}
                            className="cursor-pointer"
                            onClick={() => handleCardClick(domain.domainName)}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Globe className="mr-2 h-4 w-4" />
                                    {domain.domainName}
                                </CardTitle>
                                <CardDescription>
                                    Expires: {new Date(domain.expireDate).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Created: {new Date(domain.createDate).toLocaleDateString()}</p>
                                <p>Status: {domain.locked ? 'Locked' : 'Unlocked'}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <Button onClick={handleBack} className="mt-6">Back to Provider Selection</Button>
        </div>
    );
}
