import { CloudIcon } from "lucide-react"

export default function Navbar() {
    return (
        <nav className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <CloudIcon className="h-6 w-6" />
                        <span className="text-lg font-semibold">DNS Weaver</span>
                    </div>
                    <div className="hidden md:block">
                        {/* Add navigation items here if needed */}
                    </div>
                </div>
            </div>
        </nav>
    )
}