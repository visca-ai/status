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
        let successCount = item.logs.filter((item)=> item.status === Status.OPERATIONAL).length
        return Math.round((successCount * 100) / 90);
    }

    return (
        <div className='group rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-black p-6 transition-all'>
            <div className='flex items-center justify-between mb-4'>
                <div className="flex items-center gap-3">
                    <Icon />
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                </div>
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>{calculateUpTime()}% uptime</span>
            </div>
            <div className='flex gap-0.5'>
                {
                    ((item.logs || []) as LogDaySummary[]).map((log) => (
                        <ServiceLog key={log.date} item={log} />
                    ))
                }
            </div>
        </div>
    )
}

export default ServiceItem;