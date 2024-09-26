"use client";
import DNSProviderSelection from "@/components/DNSProviderSelection";
import { useRouter } from "next/navigation";  // Import Next.js router

export default function Page() {
    const router = useRouter();

    const handleSubmit = (provider: string, apiKey: string, username?: string) => {
        localStorage.setItem(`dnsProvider`, provider);
        localStorage.setItem("apiKey", apiKey);
        if (username) {
            localStorage.setItem("username", username);
        }
            router.push("/domains");
    };

    return (
        <>
            <DNSProviderSelection onSubmit={handleSubmit} />
        </>
    );
}
