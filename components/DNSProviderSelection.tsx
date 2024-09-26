import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CloudIcon, GlobeIcon } from "lucide-react"

interface Provider {
    name: string;
    description: string;
    icon: React.ElementType;
}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: string;
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, ...props }) => {
    return (
        <label htmlFor={htmlFor} {...props}>
            {children}
        </label>
    );
};



interface DNSProviderSelectionProps {
    onSubmit: (provider: string, apiKey: string, username?: string) => void;
}

export default function DNSProviderSelection({ onSubmit }: DNSProviderSelectionProps) {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const [cloudflareApiKey, setCloudflareApiKey] = useState('')
    const [namecomUsername, setNamecomUsername] = useState('')
    const [namecomApiKey, setNamecomApiKey] = useState('')

    const providers: Provider[] = [
        {
            name: 'Cloudflare',
            description: 'Global cloud platform with advanced security features',
            icon: CloudIcon,
        },
        {
            name: 'Name.com',
            description: 'Domain registrar and web hosting company',
            icon: GlobeIcon,
        },
    ]

    const handleContinue = () => {
        if (selectedProvider === 'Cloudflare' && cloudflareApiKey) {
            onSubmit(selectedProvider, cloudflareApiKey)
        } else if (selectedProvider === 'Name.com' && namecomUsername && namecomApiKey) {
            onSubmit(selectedProvider, namecomApiKey, namecomUsername)
        }
    }

    const isSubmitDisabled = () => {
        if (!selectedProvider) return true
        if (selectedProvider === 'Cloudflare' && !cloudflareApiKey) return true
        if (selectedProvider === 'Name.com' && (!namecomUsername || !namecomApiKey)) return true
        return false
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Select DNS Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                    <Card
                        key={provider.name}
                        className={`cursor-pointer transition-all duration-300 ease-in-out ${
                            selectedProvider === provider.name
                                ? 'border-primary shadow-lg'
                                : 'hover:border-primary/50'
                        } ${
                            selectedProvider && selectedProvider !== provider.name
                                ? 'opacity-50'
                                : ''
                        }`}
                        style={{
                            height: selectedProvider === provider.name ? 'auto' : '140px',
                            overflow: 'hidden'
                        }}
                        onClick={() => setSelectedProvider(provider.name)}
                    >
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <provider.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>{provider.name}</CardTitle>
                                    <CardDescription>{provider.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        {selectedProvider === 'Cloudflare' && provider.name === 'Cloudflare' && (
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cloudflareApiKey">API Key</Label>
                                        <Input
                                            id="cloudflareApiKey"
                                            type="password"
                                            value={cloudflareApiKey}
                                            onChange={(e) => setCloudflareApiKey(e.target.value)}
                                            placeholder="Enter your Cloudflare API key"
                                        />
                                    </div>
                                </form>
                            </CardContent>
                        )}
                        {selectedProvider === 'Name.com' && provider.name === 'Name.com' && (
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="namecomUsername">Username</Label>
                                        <Input
                                            id="namecomUsername"
                                            value={namecomUsername}
                                            onChange={(e) => setNamecomUsername(e.target.value)}
                                            placeholder="Enter your Name.com username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="namecomApiKey">API Key</Label>
                                        <Input
                                            id="namecomApiKey"
                                            type="password"
                                            value={namecomApiKey}
                                            onChange={(e) => setNamecomApiKey(e.target.value)}
                                            placeholder="Enter your Name.com API key"
                                        />
                                    </div>
                                </form>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
            <div className="flex justify-center mt-6">
                <Button
                    disabled={isSubmitDisabled()}
                    onClick={handleContinue}
                >
                    Continue with {selectedProvider || 'selected provider'}
                </Button>
            </div>
        </div>
    )
}