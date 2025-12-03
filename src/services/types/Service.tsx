import LogDaySummary from "./LogDaySummary";

interface Service {
    id: number;
    name: string;
    status: string;
    logs: LogDaySummary[];
    group?: string;
    url?: string;
}

export default Service;