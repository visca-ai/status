import { FunctionComponent, useState } from 'react';
import { Status } from '../../../utils/constants';
import LogDaySummary from '../../types/LogDaySummary';
import StatusView from './Status';

interface ServiceLogProps {
    item: LogDaySummary
}

const ServiceLog: FunctionComponent<ServiceLogProps> = ({ item }) => {
    const [show, setShow] = useState(false);

    const statusView = (status: string) => {
        switch (status) {
            case 'unknown':
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className='bg-gray-200 dark:bg-gray-700 flex-1 h-full rounded-sm transition-all hover:scale-y-110 hover:shadow-sm cursor-pointer' >
                    <StatusView item={item} show={show} />
                </div>;
            case Status.OUTAGE:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className='bg-red-500 dark:bg-red-600 flex-1 h-full rounded-sm transition-all hover:scale-y-110 hover:shadow-md cursor-pointer shadow-sm' >
                    <StatusView item={item} show={show} />
                </div>;
            case Status.PARTIAL_OUTAGE:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className='bg-amber-400 dark:bg-amber-500 flex-1 h-full rounded-sm transition-all hover:scale-y-110 hover:shadow-md cursor-pointer shadow-sm' >
                    <StatusView item={item} show={show} />
                </div>;                
            default:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className='bg-emerald-500 dark:bg-emerald-600 flex-1 h-full rounded-sm transition-all hover:scale-y-110 hover:shadow-md cursor-pointer shadow-sm' >
                    <StatusView item={item} show={show} />
                </div>;
        }
    }
    return (
        <>
            {
                statusView(item.status)
            }
        </ >
    )
}

export default ServiceLog;