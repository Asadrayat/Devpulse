import type { IssueFilters } from "./issue.interface";
export declare const issueService: {
    createIssueIntoDb: (payload: {
        title: string;
        description: string;
        type: "bug" | "feature_request";
        reporter_id: number;
    }) => Promise<import("pg").QueryResult<any>>;
    getAllIssuesFromDb: (filters: IssueFilters) => Promise<any[]>;
    getSingleIssueFromDb: (id: string) => Promise<any>;
    updateIssueIntoDb: (id: string, payload: Partial<{
        title: string;
        description: string;
        type: "bug" | "feature_request";
    }>) => Promise<any>;
    deleteIssueFromDb: (id: string) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=issues.service.d.ts.map