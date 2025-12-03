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
        let successCount = item.logs.filter((item)=> item.status === Status.OPERATIONAL).length
        return Math.round((successCount * 100) / item.logs.length);
    }

    const getUptimeColor = (uptime: number) => {
        if (uptime >= 99.9) return 'text-emerald-600 dark:text-emerald-400';
        if (uptime >= 99.0) return 'text-green-600 dark:text-green-400';
        if (uptime >= 95.0) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    }

    const uptime = calculateUpTime();

    return (
        <div className='group rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-black p-6 transition-all hover:shadow-md'>
            <div className='flex items-center justify-between mb-4'>
                <div className="flex items-center gap-3">
                    <Icon />
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {uptime !== null ? 'Last 90 days' : 'No data yet'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    {uptime !== null ? (
                        <>
                            <div className={`text-2xl font-bold ${getUptimeColor(uptime)}`}>{uptime}%</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">uptime</p>
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-medium text-gray-400 dark:text-gray-500">—</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">pending</p>
                        </>
                    )}
                </div>
            </div>
            {uptime !== null && item.logs && item.logs.length > 0 && (
                <div className='flex gap-0.5'>
                    {
                        ((item.logs || []) as LogDaySummary[]).map((log) => (
                            <ServiceLog key={log.date} item={log} />
                        ))
                    }
                </div>
            )}
            {(uptime === null || !item.logs || item.logs.length === 0) && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-500">
                    <p>Waiting for first health check...</p>
                </div>
            )}
        </div>
    )
}

export default ServiceItem;