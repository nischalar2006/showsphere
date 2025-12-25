import Link from "next/link"
import { Film, MonitorPlay, Calendar } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Link href="/admin/movies" className="block group">
                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-border group-hover:border-primary">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-900/30 rounded-full text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Film size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Movies</h2>
                                <p className="text-muted-foreground">Manage database</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/theaters" className="block group">
                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-border group-hover:border-primary">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-900/30 rounded-full text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <MonitorPlay size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Theaters</h2>
                                <p className="text-muted-foreground">Manage locations</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/shows" className="block group">
                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-border group-hover:border-primary">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-900/30 rounded-full text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Shows</h2>
                                <p className="text-muted-foreground">Schedule timings</p>
                            </div>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    )
}
