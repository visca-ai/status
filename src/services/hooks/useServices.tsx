import { useState, useEffect } from "react";
import Service from '../types/Service';
import Log from "../types/Log";
import LogDaySummary from "../types/LogDaySummary";
import { Status } from "../../utils/constants";

export interface ServiceGroup {
    name: string;
    collapsed: boolean;
    description?: string;
    services: Service[];
}

function useServices(dateOffset: number = 0) {
    const [data, setData] = useState<ServiceGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("./urls.cfg");
                const configText = await response.text();
                const configLines = configText.split("\n");

                const groups: ServiceGroup[] = [];
                let currentGroup: ServiceGroup | null = null;
                let serviceId = 0;
                
                for (let ii = 0; ii < configLines.length; ii++) {
                    const configLine = configLines[ii].trim();
                    
                    // Skip empty lines
                    if (!configLine) continue;
                    
                    // Skip any line that starts with [ (group headers)
                    if (configLine.startsWith("[")) {
                        // Check for valid group header [Group Name|collapsed=...]
                        if (configLine.endsWith("]")) {
                            // Save previous group if exists
                            if (currentGroup) {
                                groups.push(currentGroup);
                            }
                            
                            // Parse group metadata
                            const groupContent = configLine.slice(1, -1);
                            const parts = groupContent.split("|");
                            const groupName = parts[0];
                            const collapsed = parts.find(p => p.startsWith("collapsed="))?.split("=")[1] === "true";
                            const description = parts.find(p => p.startsWith("description="))?.split("=")[1];
                            
                            currentGroup = {
                                name: groupName,
                                collapsed: collapsed || false,
                                description: description,
                                services: []
                            };
                        }
                        // Skip this line regardless (valid or malformed group header)
                        continue;
                    }
                    
                    const [key, url] = configLine.split("=");
                    if (!key || !url) {
                        continue;
                    }
                    
                    // If no group defined, create default one
                    if (!currentGroup) {
                        currentGroup = {
                            name: "Services",
                            collapsed: false,
                            services: []
                        };
                    }
                    
                    const log = await logs(key, dateOffset);

                    if (log.length > 0) {
                        currentGroup.services.push({ 
                            id: serviceId++, 
                            name: key, 
                            status: log[log.length - 1].status, 
                            logs: log,
                            url: url
                        })
                    } else {
                        currentGroup.services.push({ 
                            id: serviceId++, 
                            name: key, 
                            status: "unknown", 
                            logs: log,
                            url: url
                        })
                    }
                }
                
                // Add the last group
                if (currentGroup) {
                    groups.push(currentGroup);
                }
                
                setData(groups);
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dateOffset]);

    return [data, isLoading, error];
}

async function logs(key: string, dateOffset: number = 0): Promise<LogDaySummary[]> {
    const response = await fetch(`https://raw.githubusercontent.com/visca-ai/status/main/public/status/${key}_report.log`);

    const text = await response.text();
    const lines = text.split("\n");
    const logs: Log[] = [];
    const logDaySummary: LogDaySummary[] = [];

    lines.forEach((line: string) => {
        const [created_at, status, response_time] = line.split(", ");
        logs.push({ id: created_at, response_time, status, created_at })
    })

    const prepareSummary = Object.values(logs.reduce((r: any, date) => {
        const [year, month, day] = date.created_at.substr(0, 10).split('-');
        const key = `${day}_${month}_${year}`;
        r[key] = r[key] || { date: date.created_at, logs: [] };
        r[key].logs.push(date);
        return r;
    }, {}));


    prepareSummary.forEach((logSummary: any) => {
        var avg_response_time = 0

        logSummary.logs.forEach((log: Log) => {
            if (log.response_time) {
                avg_response_time += Number(log.response_time.replaceAll('s', ''));
            }
        });

        let status = ""
        if (logSummary.logs.length === 0) {
            status = "unknown"
        } else if (logSummary.logs.every((item:any)=> item.status === 'success')) {
            status = Status.OPERATIONAL
        } else if (logSummary.logs.every((item:any)=> item.status === 'failed')) {
            status = Status.OUTAGE
        } else {
            status = Status.PARTIAL_OUTAGE
        }

        logDaySummary.push({
            avg_response_time: avg_response_time / logSummary.logs.length,
            current_status: logSummary.logs[logSummary.logs.length - 1].status,
            date: logSummary.date.substr(0, 10),
            status: status
        })
    })

    return fillData(logDaySummary, dateOffset);
}

function fillData(data: LogDaySummary[], dateOffset: number = 0): LogDaySummary[] {
    const logDaySummary: LogDaySummary[] = [];
    var today = new Date();
    // Apply offset (each offset = 90 days back)
    today.setDate(today.getDate() - (dateOffset * 90));

    // Fill 90 days of data to show complete timeline
    for (var i = 89; i >= 0; i -= 1) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const summary = data.find((item) => item.date === d.toISOString().substr(0, 10));
        logDaySummary.push({
            avg_response_time: summary?.avg_response_time || 0,
            current_status: summary?.current_status || "unknown",
            date: d.toISOString().substr(0, 10),
            status: summary?.status || "unknown"
        })
    }

    return logDaySummary;
}


export default useServices;
