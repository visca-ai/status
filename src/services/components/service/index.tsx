import { FunctionComponent } from 'react';
import { Status } from '../../../utils/constants';
import Log from '../../types/Log';
import LogDaySummary from '../../types/LogDaySummary';
import Service from "../../types/Service";
import ServiceLog from "../log";

interface ServiceItemProps {
    item: Service
}

const ServiceItem: FunctionComponent<ServiceItemProps> = ({ item }) => {
    const Icon = () => {
        if (item?.status === Status.OPERATIONAL) {
            return <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
        } else if(item?.status === Status.PARTIAL_OUTAGE) {
            return <div className="h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
        } else if(item?.status === Status.OUTAGE) {
            return <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
        } else {
            return <div className="h-2 w-2 rounded-full bg-gray-300 ring-4 ring-gray-300/20"></div>
        }
    }

    const calculateUpTime = () => {
        if (!item.logs || item.logs.length === 0) return null;
        // Only count days with actual data (not unknown status)
        const daysWithData = item.logs.filter((log) => log.status !== "unknown");
        if (daysWithData.length === 0) return null;
        
        let successCount = daysWithData.filter((log) => log.status === Status.OPERATIONAL).length;
        return Math.round((successCount * 100) / daysWithData.length);
    }

    const getUptimeColor = (uptime: number) => {
        if (uptime >= 99.9) return 'text-emerald-600 dark:text-emerald-400';
        if (uptime >= 99.0) return 'text-green-600 dark:text-green-400';
        if (uptime >= 95.0) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    }

    const uptime = calculateUpTime();

    return (
        <div className='rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-700'>
            <div className='flex items-start justify-between mb-4'>
                <div className="flex items-center gap-3">
                    <Icon />
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{item.name}</h4>
                </div>
                <span className={`text-sm font-medium px-2.5 py-1 rounded ${
                    item.status === Status.OPERATIONAL ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' :
                    item.status === Status.PARTIAL_OUTAGE ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' :
                    item.status === Status.OUTAGE ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30' :
                    'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900'
                }`}>
                    {uptime !== null ? `${uptime}% uptime` : 'No data'}
                </span>
            </div>
            <div className='flex gap-[2px] mb-3 h-12 items-end'>
                {
                    ((item.logs || []) as LogDaySummary[]).map((log) => (
                        <ServiceLog key={log.date} item={log} />
                    ))
                }
            </div>
            <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                <span>90 days ago</span>
                <span>Today</span>
            </div>
        </div>
    )
}

export default ServiceItem;