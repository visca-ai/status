import { FunctionComponent } from "react"
import Log from "../../types/Log"
import LogDaySummary from "../../types/LogDaySummary"

interface ServiceLogProps {
    item: LogDaySummary,
    show: boolean
}

const StatusView: FunctionComponent<ServiceLogProps> = ({ item, show }) => {
    // Format date to readable format (e.g., "Wed, 3 Dec 2025")
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const getStatusDisplay = () => {
        if (item.status === 'operational') {
            return (
                <>
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No incidents</span>
                </>
            );
        } else if (item.status === 'partial_outage') {
            return (
                <>
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Degraded performance</span>
                </>
            );
        } else if (item.status === 'outage') {
            return (
                <>
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Service outage</span>
                </>
            );
        } else {
            return (
                <>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No data</span>
                </>
            );
        }
    };

    return (
        <>
            {
                show &&
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[9999] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 px-5 py-4 pointer-events-none min-w-[200px]">
                    <div className="text-center space-y-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(item.date)}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100 font-medium">
                            {getStatusDisplay()}
                        </div>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-[6px] border-transparent border-t-white dark:border-t-gray-800"></div>
                    </div>
                </div>
            }
        </>
    )
}

export default StatusView;