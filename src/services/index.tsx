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
        <div className='space-y-8'>
            {/* System Status Banner with Status Indicator */}
            <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm">
                {systemStatus?.status === Status.OPERATIONAL && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20" />
                )}
                {systemStatus?.status === Status.PARTIAL_OUTAGE && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20" />
                )}
                {systemStatus?.status === Status.OUTAGE && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20" />
                )}
                <div className="relative p-8 border-l-4 border-gray-200 dark:border-gray-700" style={{
                    borderLeftColor: systemStatus?.status === Status.OPERATIONAL ? '#10b981' : 
                                   systemStatus?.status === Status.PARTIAL_OUTAGE ? '#f59e0b' : 
                                   systemStatus?.status === Status.OUTAGE ? '#ef4444' : '#9ca3af'
                }}>
                    <div className='flex items-start justify-between flex-wrap gap-4'>
                        <div className='flex items-start gap-4'>
                            <Icon />
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-1">{systemStatus?.title}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Last checked {systemStatus?.datetime || 'just now'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{
                            backgroundColor: systemStatus?.status === Status.OPERATIONAL ? '#d1fae5' : 
                                           systemStatus?.status === Status.PARTIAL_OUTAGE ? '#fef3c7' : 
                                           systemStatus?.status === Status.OUTAGE ? '#fee2e2' : '#f3f4f6',
                            color: systemStatus?.status === Status.OPERATIONAL ? '#065f46' : 
                                  systemStatus?.status === Status.PARTIAL_OUTAGE ? '#92400e' : 
                                  systemStatus?.status === Status.OUTAGE ? '#991b1b' : '#374151'
                        }}>
                            {systemStatus?.status === Status.OPERATIONAL && '✓ All Systems Operational'}
                            {systemStatus?.status === Status.PARTIAL_OUTAGE && '⚠ Degraded Performance'}
                            {systemStatus?.status === Status.OUTAGE && '✕ Service Disruption'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Legend:</span>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Operational</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Degraded</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Outage</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Unknown</span>
                </div>
                <a href="https://github.com/visca-ai/status/issues" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View incident history →</a>
            </div>

            {/* Services Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Services</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{(data as Service[]).length} services monitored</span>
                </div>
                {
                    isServicesLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-gray-800 border-t-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
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
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Incident History</h3>
                <IncidentsSection />
            </div>
        </div >
    )
}

export default ServicesSection;
