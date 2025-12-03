import useServices, { ServiceGroup } from './hooks/useServices';
import type { NextPage } from 'next'
import Service from './types/Service';
import ServiceItem from './components/service';
import IncidentsSection from '../incidents';
import useSystemStatus from './hooks/useSystemStatus';
import { Status } from '../utils/constants';
import { useState } from 'react';


const ServicesSection: NextPage = () => {
    const [data, isServicesLoading] = useServices();
    const {systemStatus, isLoading} = useSystemStatus();
    const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});

    const toggleGroup = (groupName: string, initialState: boolean) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupName]: prev[groupName] !== undefined ? !prev[groupName] : !initialState
        }));
    };

    const isGroupCollapsed = (groupName: string, initialState: boolean) => {
        return collapsedGroups[groupName] !== undefined ? collapsedGroups[groupName] : initialState;
    };

    const totalServices = (data as ServiceGroup[]).reduce((sum, group) => sum + group.services.length, 0);

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
            {/* System Status Banner - Modernized */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="relative px-8 py-6" style={{
                    background: systemStatus?.status === Status.OPERATIONAL 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%)' 
                        : systemStatus?.status === Status.PARTIAL_OUTAGE 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%)'
                        : systemStatus?.status === Status.OUTAGE
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)'
                        : 'transparent'
                }}>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className="flex-shrink-0">
                                {systemStatus?.status === Status.OPERATIONAL && (
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                                {systemStatus?.status === Status.PARTIAL_OUTAGE && (
                                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                )}
                                {systemStatus?.status === Status.OUTAGE && (
                                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{systemStatus?.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Last checked {systemStatus?.datetime || 'just now'}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            systemStatus?.status === Status.OPERATIONAL 
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' 
                                : systemStatus?.status === Status.PARTIAL_OUTAGE 
                                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                                : systemStatus?.status === Status.OUTAGE
                                ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                            {systemStatus?.status === Status.OPERATIONAL && 'All Systems Operational'}
                            {systemStatus?.status === Status.PARTIAL_OUTAGE && 'Degraded Performance'}
                            {systemStatus?.status === Status.OUTAGE && 'Service Disruption'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Legend:</span>
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Operational</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-amber-400"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Degraded</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-red-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Outage</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-gray-300 dark:bg-gray-700"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">No data</span>
                </div>
                <a href="https://github.com/visca-ai/status/issues" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View incident history →</a>
            </div>

            {/* Services Grid */}
            <div>
                <div className="flex items-center justify-end mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uptime over the past 90 days. <a href="https://github.com/visca-ai/status/issues" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline">View historical uptime</a>.
                    </p>
                </div>
                {
                    isServicesLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-gray-800 border-t-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {
                                (data as ServiceGroup[]).map((group) => {
                                    const collapsed = isGroupCollapsed(group.name, group.collapsed);
                                    return (
                                        <div key={group.name} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleGroup(group.name, group.collapsed)}
                                                className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg 
                                                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${collapsed ? '' : 'rotate-90'}`}
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {group.name}
                                                        </h4>
                                                        {group.description && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                {group.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {group.services.filter(s => s.status === Status.OPERATIONAL).length > 0 && (
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                        )}
                                                        {group.services.filter(s => s.status === Status.PARTIAL_OUTAGE).length > 0 && (
                                                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                        )}
                                                        {group.services.filter(s => s.status === Status.OUTAGE).length > 0 && (
                                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                            {!collapsed && (
                                                <div className="p-4 space-y-3 bg-white dark:bg-black">
                                                    {group.services.map(service => (
                                                        <ServiceItem key={service.id} item={service} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
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
