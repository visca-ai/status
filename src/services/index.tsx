import useServices from './hooks/useServices';
import type { NextPage } from 'next'
import Service from './types/Service';
import ServiceItem from './components/service';
import IncidentsSection from '../incidents';
import useSystemStatus from './hooks/useSystemStatus';
import { Status } from '../utils/constants';


const ServicesSection: NextPage = () => {
    const [data, isServicesLoading] = useServices();
    const {systemStatus, isLoading} = useSystemStatus();

    const Icon = () => {
        if (systemStatus?.status === Status.OPERATIONAL) {
            return <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
        } else if(systemStatus?.status === Status.PARTIAL_OUTAGE) {
            return <svg  className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="orange">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else if(systemStatus?.status === Status.OUTAGE) {
            return <svg className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else {
            return <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
        }
    }

    return (
        <div className='space-y-12'>
            {/* System Status Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black p-8">
                <div className="relative z-10">
                    <div className='flex items-center gap-4 mb-2'>
                        <Icon />
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{systemStatus?.title}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Last checked {systemStatus?.datetime || 'just now'}</p>
                </div>
            </div>

            {/* Services Grid */}
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Services</h3>
                {
                    isServicesLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white"></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {
                                (data as Service[]).map(service => (
                                    <ServiceItem key={service.id} item={service} />
                                ))
                            }
                        </div>
                    )
                }
            </div>

            {/* Recent Incidents */}
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Incident History</h3>
                <IncidentsSection />
            </div>
        </div >
    )
}

export default ServicesSection;
