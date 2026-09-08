/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by scripts/generate-operations.ts from the OpenAPI documents in spec/.
 * To refresh: pnpm spec:fetch && pnpm generate
 *
 * 321 operations across 38 groups
 * (157 read, 128 write, 36 destructive).
 */

export type OperationRisk = "read" | "write" | "destructive";

export interface QueryParam {
	name: string;
	description: string;
	type: string;
	enum?: string[];
}

export interface OperationBody {
	required: boolean;
	properties: string[];
	requiredProperties: string[];
}

export interface Operation {
	/** Vanta's own operationId, e.g. "ListVendors". */
	id: string;
	/** CLI command group, from the OpenAPI tag, e.g. "vendors". */
	group: string;
	/** CLI subcommand, from the operationId, e.g. "list-vendors". */
	command: string;
	method: "get" | "post" | "put" | "patch" | "delete";
	/** Request path relative to the /v1 prefix the client adds. */
	path: string;
	summary: string;
	risk: OperationRisk;
	pathParams: string[];
	queryParams: QueryParam[];
	body?: OperationBody;
	deprecated?: boolean;
}

export const OPERATIONS: readonly Operation[] = [
	{
		"id": "get-ApiEndpointVulnerabilityConnectors",
		"group": "api-endpoint-vulnerabilities",
		"command": "get-api-endpoint-vulnerability-connectors",
		"method": "get",
		"path": "/resources/api_endpoint_vulnerability_connectors",
		"summary": "List all API Endpoint Vulnerabilities",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-ApiEndpointVulnerabilityConnectors",
		"group": "api-endpoint-vulnerabilities",
		"command": "put-api-endpoint-vulnerability-connectors",
		"method": "put",
		"path": "/resources/api_endpoint_vulnerability_connectors",
		"summary": "Sync all API Endpoint Vulnerabilities",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "CreateAuditor",
		"group": "auditors",
		"command": "create-auditor",
		"method": "post",
		"path": "/auditors",
		"summary": "Create an auditor",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email",
				"givenName",
				"familyName"
			],
			"requiredProperties": [
				"email",
				"givenName",
				"familyName"
			]
		}
	},
	{
		"id": "AcceptInformationRequestEvidence",
		"group": "audits",
		"command": "accept-information-request-evidence",
		"method": "post",
		"path": "/audits/{auditId}/information-requests/{requestId}/accept-evidence",
		"summary": "Accept evidence for an information request",
		"risk": "write",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"auditorEmail"
			],
			"requiredProperties": [
				"auditorEmail"
			]
		}
	},
	{
		"id": "CreateCommentForAuditEvidence",
		"group": "audits",
		"command": "create-comment-for-audit-evidence",
		"method": "post",
		"path": "/audits/{auditId}/evidence/{auditEvidenceId}/comments",
		"summary": "Create a comment for audit evidence",
		"risk": "write",
		"pathParams": [
			"auditId",
			"auditEvidenceId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"text",
				"email",
				"creationDate"
			],
			"requiredProperties": [
				"text",
				"email",
				"creationDate"
			]
		}
	},
	{
		"id": "CreateCommentForControl",
		"group": "audits",
		"command": "create-comment-for-control",
		"method": "post",
		"path": "/audits/{auditId}/controls/{controlId}/comments",
		"summary": "Create a comment for a control within an audit",
		"risk": "write",
		"pathParams": [
			"auditId",
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"text",
				"email",
				"creationDate"
			],
			"requiredProperties": [
				"text",
				"email",
				"creationDate"
			]
		}
	},
	{
		"id": "CreateCommentForInformationRequest",
		"group": "audits",
		"command": "create-comment-for-information-request",
		"method": "post",
		"path": "/audits/{auditId}/information-requests/{requestId}/comments",
		"summary": "Create a comment for an information request",
		"risk": "write",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"text",
				"email",
				"creationDate"
			],
			"requiredProperties": [
				"text",
				"email",
				"creationDate"
			]
		}
	},
	{
		"id": "CreateCustomControl",
		"group": "audits",
		"command": "create-custom-control",
		"method": "post",
		"path": "/audits/{auditId}/controls/custom-controls",
		"summary": "Create a custom control for an audit",
		"risk": "write",
		"pathParams": [
			"auditId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"externalId",
				"name",
				"description",
				"effectiveDate",
				"category",
				"sections",
				"role"
			],
			"requiredProperties": [
				"externalId",
				"name",
				"description",
				"effectiveDate",
				"category"
			]
		}
	},
	{
		"id": "CreateCustomEvidenceRequest",
		"group": "audits",
		"command": "create-custom-evidence-request",
		"method": "post",
		"path": "/audits/{auditId}/evidence/custom-evidence-requests",
		"summary": "Create a custom evidence request for an audit",
		"risk": "write",
		"pathParams": [
			"auditId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlIds",
				"title",
				"description",
				"cadence",
				"reminderWindow",
				"isRestricted",
				"auditorEmail"
			],
			"requiredProperties": [
				"controlIds",
				"title",
				"description",
				"cadence",
				"reminderWindow",
				"isRestricted",
				"auditorEmail"
			]
		}
	},
	{
		"id": "CreateInformationRequest",
		"group": "audits",
		"command": "create-information-request",
		"method": "post",
		"path": "/audits/{auditId}/information-requests",
		"summary": "Create a new information request",
		"risk": "write",
		"pathParams": [
			"auditId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"uniqueId",
				"title",
				"requestType",
				"description",
				"frameworkCodes",
				"cadence",
				"dueDate",
				"evidenceCaptureDate",
				"additionalControlIds"
			],
			"requiredProperties": [
				"uniqueId",
				"title",
				"requestType",
				"frameworkCodes"
			]
		}
	},
	{
		"id": "DeleteCommentForControl",
		"group": "audits",
		"command": "delete-comment-for-control",
		"method": "delete",
		"path": "/audits/{auditId}/controls/{controlId}/comments/{commentId}",
		"summary": "Delete a comment for a control within an audit",
		"risk": "destructive",
		"pathParams": [
			"auditId",
			"controlId",
			"commentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email"
			],
			"requiredProperties": [
				"email"
			]
		}
	},
	{
		"id": "DeleteCommentForInformationRequest",
		"group": "audits",
		"command": "delete-comment-for-information-request",
		"method": "delete",
		"path": "/audits/{auditId}/information-requests/{requestId}/comments/{commentId}",
		"summary": "Delete a comment for an information request",
		"risk": "destructive",
		"pathParams": [
			"auditId",
			"requestId",
			"commentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email"
			],
			"requiredProperties": [
				"email"
			]
		}
	},
	{
		"id": "DeleteInformationRequest",
		"group": "audits",
		"command": "delete-information-request",
		"method": "delete",
		"path": "/audits/{auditId}/information-requests/{requestId}",
		"summary": "Delete an information request for an audit",
		"risk": "destructive",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": []
	},
	{
		"id": "Duplicate",
		"group": "audits",
		"command": "duplicate",
		"method": "post",
		"path": "/audits/duplicate",
		"summary": "Duplicate an IRL audit",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"sourceAuditId",
				"displayName",
				"auditStartDate",
				"auditEndDate",
				"earlyAccessStartsAt",
				"allowAuditorEmails"
			],
			"requiredProperties": [
				"sourceAuditId",
				"displayName",
				"auditStartDate",
				"auditEndDate",
				"earlyAccessStartsAt",
				"allowAuditorEmails"
			]
		}
	},
	{
		"id": "FlagInformationRequestEvidence",
		"group": "audits",
		"command": "flag-information-request-evidence",
		"method": "post",
		"path": "/audits/{auditId}/information-requests/{requestId}/flag-evidence",
		"summary": "Flag evidence for an information request",
		"risk": "write",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"auditorEmail",
				"reason"
			],
			"requiredProperties": [
				"auditorEmail",
				"reason"
			]
		}
	},
	{
		"id": "GetAudit",
		"group": "audits",
		"command": "get-audit",
		"method": "get",
		"path": "/audits/{auditId}",
		"summary": "Get audit by ID",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": []
	},
	{
		"id": "GetAuditEvidence",
		"group": "audits",
		"command": "get-audit-evidence",
		"method": "get",
		"path": "/audits/{auditId}/evidence/{auditEvidenceId}",
		"summary": "Get an audit evidence item by ID",
		"risk": "read",
		"pathParams": [
			"auditId",
			"auditEvidenceId"
		],
		"queryParams": []
	},
	{
		"id": "GetAuditEvidenceComment",
		"group": "audits",
		"command": "get-audit-evidence-comment",
		"method": "get",
		"path": "/audits/{auditId}/evidence/{auditEvidenceId}/comments/{commentId}",
		"summary": "Get an audit evidence comment by ID",
		"risk": "read",
		"pathParams": [
			"auditId",
			"auditEvidenceId",
			"commentId"
		],
		"queryParams": []
	},
	{
		"id": "GetCommentForInformationRequest",
		"group": "audits",
		"command": "get-comment-for-information-request",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/comments/{commentId}",
		"summary": "Get an information request comment by ID",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId",
			"commentId"
		],
		"queryParams": []
	},
	{
		"id": "GetFrameworkCodes",
		"group": "audits",
		"command": "get-framework-codes",
		"method": "get",
		"path": "/audits/{auditId}/framework-codes",
		"summary": "Get framework codes for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": []
	},
	{
		"id": "GetInformationRequest",
		"group": "audits",
		"command": "get-information-request",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}",
		"summary": "Get an information request by ID",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": []
	},
	{
		"id": "GetInformationRequestEvidence",
		"group": "audits",
		"command": "get-information-request-evidence",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/evidence/{evidenceId}",
		"summary": "Get information request evidence by ID",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId",
			"evidenceId"
		],
		"queryParams": []
	},
	{
		"id": "GetInformationRequestTestSnapshotEvidenceDetail",
		"group": "audits",
		"command": "get-information-request-test-snapshot-evidence-detail",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/evidence/{evidenceId}/test-snapshot",
		"summary": "Get test snapshot detail for an evidence row",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId",
			"evidenceId"
		],
		"queryParams": []
	},
	{
		"id": "GetOrganizationInformation",
		"group": "audits",
		"command": "get-organization-information",
		"method": "get",
		"path": "/audits/{auditId}/organization/information",
		"summary": "Get organization information for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": []
	},
	{
		"id": "GetOrganizationNotifications",
		"group": "audits",
		"command": "get-organization-notifications",
		"method": "get",
		"path": "/audits/{auditId}/organization/notifications",
		"summary": "Get organization notification settings for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": []
	},
	{
		"id": "GetVulnerableAssets",
		"group": "audits",
		"command": "get-vulnerable-assets",
		"method": "get",
		"path": "/audits/{auditId}/vulnerable-assets",
		"summary": "List assets associated with vulnerabilities",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "query",
				"description": "Filter vulnerable assets by search query.",
				"type": "string"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerable assets by specific vulnerability scanner.",
				"type": "string"
			},
			{
				"name": "assetType",
				"description": "Filter vulnerable assets by asset type. Possible values: CODE_REPOSITORY, CONTAINER_REPOSITORY, CONTAINER_REPOSITORY_IMA",
				"type": "string"
			},
			{
				"name": "assetExternalAccountId",
				"description": "Filter vulnerable assets by...",
				"type": "string"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListAccountAccessServices",
		"group": "audits",
		"command": "list-account-access-services",
		"method": "get",
		"path": "/audits/{auditId}/personnel/account-access/services",
		"summary": "List account access services for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditComments",
		"group": "audits",
		"command": "list-audit-comments",
		"method": "get",
		"path": "/audits/{auditId}/comments",
		"summary": "List audit comments",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all comments that have changed since changedSinceDate.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditControls",
		"group": "audits",
		"command": "list-audit-controls",
		"method": "get",
		"path": "/audits/{auditId}/controls",
		"summary": "List audit controls",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "externalIdMatchesAny",
				"description": "Filter controls whose externalId matches any of the provided values (exact, case-sensitive match).",
				"type": "array"
			}
		]
	},
	{
		"id": "ListAuditEvidence",
		"group": "audits",
		"command": "list-audit-evidence",
		"method": "get",
		"path": "/audits/{auditId}/evidence",
		"summary": "List audit evidence",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all audit evidence that have changed since changedSinceDate.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditEvidenceUrls",
		"group": "audits",
		"command": "list-audit-evidence-urls",
		"method": "get",
		"path": "/audits/{auditId}/evidence/{auditEvidenceId}/urls",
		"summary": "List audit evidence url",
		"risk": "read",
		"pathParams": [
			"auditId",
			"auditEvidenceId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditIssues",
		"group": "audits",
		"command": "list-audit-issues",
		"method": "get",
		"path": "/audits/{auditId}/issues/items",
		"summary": "List snapshotted issues for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by issue title and description",
				"type": "string"
			},
			{
				"name": "snapshotIdMatchesAny",
				"description": "Filter issues to specific snapshots by snapshot ID",
				"type": "array"
			},
			{
				"name": "createdAfterDate",
				"description": "Filter to issues created on or after this date (ISO 8601)",
				"type": "string"
			},
			{
				"name": "createdBeforeDate",
				"description": "Filter to issues created on or before this date (ISO 8601)",
				"type": "string"
			},
			{
				"name": "detectedAfterDate",
				"description": "Filter to issues detected on or after this date (ISO 8601)",
				"type": "string"
			},
			{
				"name": "detectedBeforeDate",
				"description": "Filter to issues detected on or before this date (ISO 8601)",
				"type": "string"
			},
			{
				"name": "orderBy",
				"description": "Field to sort results by. Allowed: \"createdAt\", \"lastModifiedAt\", \"detectedAt\". Default: \"createdAt\"",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Sort direction: \"asc\" or \"desc\". Default: \"desc\"",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditRisks",
		"group": "audits",
		"command": "list-audit-risks",
		"method": "get",
		"path": "/audits/{auditId}/risks/{snapshotId}",
		"summary": "List risks for an audit",
		"risk": "read",
		"pathParams": [
			"auditId",
			"snapshotId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by risk scenario description",
				"type": "string"
			},
			{
				"name": "orderBy",
				"description": "Field to sort results by. Allowed: \"riskId\", \"riskScenario\", \"inherentRisk\", \"treatment\", \"residualRisk\", \"reviewStatus\"",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Sort direction: \"asc\" or \"desc\". Default: \"desc\"",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAuditSnapshots",
		"group": "audits",
		"command": "list-audit-snapshots",
		"method": "get",
		"path": "/audits/{auditId}/issues/snapshots",
		"summary": "List snapshotted issues for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by snapshot title and description",
				"type": "string"
			}
		]
	},
	{
		"id": "ListAudits",
		"group": "audits",
		"command": "list-audits",
		"method": "get",
		"path": "/audits",
		"summary": "List audits",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all audits that have changed since changedSinceDate.",
				"type": "string"
			},
			{
				"name": "isActiveAudit",
				"description": "Includes only audits with no audit report uploaded",
				"type": "boolean"
			}
		]
	},
	{
		"id": "ListCodeChanges",
		"group": "audits",
		"command": "list-code-changes",
		"method": "get",
		"path": "/audits/{auditId}/assets/code-changes",
		"summary": "List code changes for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by code change title or repository name",
				"type": "string"
			},
			{
				"name": "sourcesMatchesAny",
				"description": "Filter code changes by version control source (accepted values: github, gitlab, bitbucket, azuredevops)",
				"type": "array"
			},
			{
				"name": "closedAfterDate",
				"description": "Filter code changes closed on or after this date (ISO 8601)",
				"type": "string"
			},
			{
				"name": "closedBeforeDate",
				"description": "Filter code changes closed on or before this date (ISO 8601)",
				"type": "string"
			}
		]
	},
	{
		"id": "ListCommentsForControl",
		"group": "audits",
		"command": "list-comments-for-control",
		"method": "get",
		"path": "/audits/{auditId}/controls/{controlId}/comments",
		"summary": "List comments for a control within an audit",
		"risk": "read",
		"pathParams": [
			"auditId",
			"controlId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of comments to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of comments.",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all comments that have changed since changedSinceDate. Considers creationDate, modificationDate, and deletionDa",
				"type": "string"
			}
		]
	},
	{
		"id": "ListCommentsForInformationRequest",
		"group": "audits",
		"command": "list-comments-for-information-request",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/comments",
		"summary": "List comments for an information request",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of comments to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of comments.",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all comments that have changed since changedSinceDate. Considers creationDate, modificationDate, and deletionDa",
				"type": "string"
			}
		]
	},
	{
		"id": "ListInformationRequestActivity",
		"group": "audits",
		"command": "list-information-request-activity",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/activity",
		"summary": "List information request activity",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of activity entries to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of activity logs.",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes activity logs that have changed since changedSinceDate.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListInformationRequestEvidence",
		"group": "audits",
		"command": "list-information-request-evidence",
		"method": "get",
		"path": "/audits/{auditId}/information-requests/{requestId}/evidence",
		"summary": "List evidence for an information request",
		"risk": "read",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of evidence entries to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of evidence.",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all evidence that have changed since changedSinceDate. Considers creationDate, modificationDate, deletionDate, ",
				"type": "string"
			},
			{
				"name": "evidenceTypeMatchesAny",
				"description": "Limits results to the provided evidence types. Must include at least one of: UPLOADED_DOCUMENT, OBSERVATION, LINK, VANTA",
				"type": "array"
			}
		]
	},
	{
		"id": "ListInformationRequests",
		"group": "audits",
		"command": "list-information-requests",
		"method": "get",
		"path": "/audits/{auditId}/information-requests",
		"summary": "List information requests for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of information requests to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of results.",
				"type": "string"
			},
			{
				"name": "changedSinceDate",
				"description": "Includes all information requests that have changed since changedSinceDate. Considers creationDate, modificationDate, an",
				"type": "string"
			},
			{
				"name": "segmentIdsMatchesAny",
				"description": "Return requests whose stored segment assignment includes any of these IDs (OR). Omit to return all. A match can still co",
				"type": "array"
			}
		]
	},
	{
		"id": "ListInformationRequestsForControl",
		"group": "audits",
		"command": "list-information-requests-for-control",
		"method": "get",
		"path": "/audits/{auditId}/controls/{controlId}/information-requests",
		"summary": "List information requests linked to a control within an audit",
		"risk": "read",
		"pathParams": [
			"auditId",
			"controlId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of information requests to return per page.",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from a previous response. Provide to fetch the next page of results.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListIntegrations",
		"group": "audits",
		"command": "list-integrations",
		"method": "get",
		"path": "/audits/{auditId}/integrations",
		"summary": "List integrations for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by integration name",
				"type": "string"
			},
			{
				"name": "tagsMatchesAny",
				"description": "Filter integrations by tag values",
				"type": "array"
			},
			{
				"name": "categoriesMatchesAny",
				"description": "Filter integrations by category values",
				"type": "array"
			}
		]
	},
	{
		"id": "ListMonitoredComputersInAuditScope",
		"group": "audits",
		"command": "list-monitored-computers-in-audit-scope",
		"method": "get",
		"path": "/audits/{auditId}/monitored-computers",
		"summary": "List monitored computers",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "complianceStatusFilterMatchesAny",
				"description": "Filters for monitored computers matching any status declared in the filter.",
				"type": "array"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListPeopleInAuditScope",
		"group": "audits",
		"command": "list-people-in-audit-scope",
		"method": "get",
		"path": "/audits/{auditId}/people",
		"summary": "List of people who are in scope for this audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "tasksSummaryStatusMatchesAny",
				"description": "Filter individuals by those whose tasksSummary status is any of the provided values.",
				"type": "array"
			},
			{
				"name": "taskTypeMatchesAny",
				"description": "Requires taskStatusMatchesAny. Includes all people for whom any of the provided taskType values in taskTypeMatchesAny is",
				"type": "array"
			},
			{
				"name": "taskStatusMatchesAny",
				"description": "Requires taskTypeMatchesAny. Includes all people for whom any of the provided taskType values in taskTypeMatchesAny is a",
				"type": "array"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListPersonnelAccountAccess",
		"group": "audits",
		"command": "list-personnel-account-access",
		"method": "get",
		"path": "/audits/{auditId}/personnel/account-access/{serviceId}",
		"summary": "List account access records for an audit",
		"risk": "read",
		"pathParams": [
			"auditId",
			"serviceId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by account name or email",
				"type": "string"
			},
			{
				"name": "status",
				"description": "Filter by account status",
				"type": "string"
			}
		]
	},
	{
		"id": "ListPersonnelGroups",
		"group": "audits",
		"command": "list-personnel-groups",
		"method": "get",
		"path": "/audits/{auditId}/personnel/groups",
		"summary": "List groups for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by group name",
				"type": "string"
			},
			{
				"name": "sourcesMatchesAny",
				"description": "Filter groups by IDP source service names",
				"type": "array"
			},
			{
				"name": "orderBy",
				"description": "Field to sort results by. Allowed: \"name\", \"members\", \"source\", \"tasksLastUpdated\", \"pointOfContact\". Default: \"name\"",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Sort direction: \"asc\" or \"desc\". Default: \"asc\"",
				"type": "string"
			}
		]
	},
	{
		"id": "ListPersonnelPeople",
		"group": "audits",
		"command": "list-personnel-people",
		"method": "get",
		"path": "/audits/{auditId}/personnel/people",
		"summary": "List people for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by name or email",
				"type": "string"
			},
			{
				"name": "status",
				"description": "Employment status filter",
				"type": "string"
			},
			{
				"name": "groupsMatchesAny",
				"description": "Filter people by group IDs",
				"type": "array"
			},
			{
				"name": "orderBy",
				"description": "Field to sort results by. Allowed: \"name\", \"employmentStatus\". Default: \"name\"",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Sort direction: \"asc\" or \"desc\". Default: \"asc\"",
				"type": "string"
			}
		]
	},
	{
		"id": "ListRiskSnapshots",
		"group": "audits",
		"command": "list-risk-snapshots",
		"method": "get",
		"path": "/audits/{auditId}/risks/snapshots",
		"summary": "List risk snapshots for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			}
		]
	},
	{
		"id": "ListVendors",
		"group": "audits",
		"command": "list-vendors",
		"method": "get",
		"path": "/audits/{auditId}/managed-vendors",
		"summary": "List vendors for an audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "Maximum number of results per page (1-100, default 10)",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "Pagination cursor from previous response",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Search term for filtering by vendor name",
				"type": "string"
			},
			{
				"name": "vendorStatusesMatchesAny",
				"description": "Filter vendors by status values",
				"type": "array"
			},
			{
				"name": "inherentRiskMatchesAny",
				"description": "Filter vendors by inherent risk level values",
				"type": "array"
			},
			{
				"name": "orderBy",
				"description": "Field to sort results by. Allowed: \"name\", \"inherentRisk\". Default: \"name\"",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Sort direction: \"asc\" or \"desc\". Default: \"asc\"",
				"type": "string"
			}
		]
	},
	{
		"id": "ListVendorsInAuditScope",
		"group": "audits",
		"command": "list-vendors-in-audit-scope",
		"method": "get",
		"path": "/audits/{auditId}/vendors",
		"summary": "List of vendors who are in scope for this audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListVulnerabilities",
		"group": "audits",
		"command": "list-vulnerabilities",
		"method": "get",
		"path": "/audits/{auditId}/vulnerabilities",
		"summary": "List vulnerabilities within the scope of a given audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "query",
				"description": "Filter vulnerabilities by search query",
				"type": "string"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "isDeactivated",
				"description": "Filter vulnerabilities by deactivation status.",
				"type": "boolean"
			},
			{
				"name": "externalVulnerabilityId",
				"description": "Filter vulnerabilities based on a specific external ID.",
				"type": "string"
			},
			{
				"name": "isFixAvailable",
				"description": "Filter vulnerabilities that have an available fix.",
				"type": "boolean"
			},
			{
				"name": "packageIdentifier",
				"description": "Filter vulnerabilities that are from a specific package.",
				"type": "string"
			},
			{
				"name": "slaDeadlineAfterDate",
				"description": "Filter vulnerabilities with a fix due after a specific timestamp",
				"type": "string"
			},
			{
				"name": "slaDeadlineBeforeDate",
				"description": "Filter vulnerabilities with a fix due before a specific timestamp",
				"type": "string"
			},
			{
				"name": "severity",
				"description": "Filter vulnerabilities by severity. Possible values: CRITICAL, HIGH, MEDIUM, LOW.",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerabilities by the vulnerability scanner that detected them.",
				"type": "string"
			},
			{
				"name": "includeVulnerabilitiesWithoutSlas",
				"description": "Filter vulnerabilities without an SLA due date.",
				"type": "boolean"
			},
			{
				"name": "vulnerableAssetId",
				"description": "Filter vulnerabilities by a specific asset ID.",
				"type": "string"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListVulnerabilityRemediationsInAuditScope",
		"group": "audits",
		"command": "list-vulnerability-remediations-in-audit-scope",
		"method": "get",
		"path": "/audits/{auditId}/vulnerability-remediations",
		"summary": "List vulnerability remediations that are in scope for this audit",
		"risk": "read",
		"pathParams": [
			"auditId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerability remediations based on a specific scanner integration.",
				"type": "string"
			},
			{
				"name": "severity",
				"description": "Filter vulnerability remediations by severity. Possible values: CRITICAL, HIGH, MEDIUM, LOW.",
				"type": "string"
			},
			{
				"name": "isRemediatedOnTime",
				"description": "Filter vulnerability remediations by remediation status.",
				"type": "boolean"
			},
			{
				"name": "remediatedAfterDate",
				"description": "Filter vulnerability remediations that occurred after a specific timestamp.",
				"type": "string"
			},
			{
				"name": "remediatedBeforeDate",
				"description": "Filter vulnerability remediations that occurred before a specific timestamp.",
				"type": "string"
			}
		],
		"deprecated": true
	},
	{
		"id": "ShareInformationRequestList",
		"group": "audits",
		"command": "share-information-request-list",
		"method": "post",
		"path": "/audits/{auditId}/share-information-request-list",
		"summary": "Share information request list with customer",
		"risk": "write",
		"pathParams": [
			"auditId"
		],
		"queryParams": []
	},
	{
		"id": "UpdateAuditEvidence",
		"group": "audits",
		"command": "update-audit-evidence",
		"method": "patch",
		"path": "/audits/{auditId}/evidence/{auditEvidenceId}",
		"summary": "Update audit evidence",
		"risk": "write",
		"pathParams": [
			"auditId",
			"auditEvidenceId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"statusUpdate"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateCommentForControl",
		"group": "audits",
		"command": "update-comment-for-control",
		"method": "patch",
		"path": "/audits/{auditId}/controls/{controlId}/comments/{commentId}",
		"summary": "Update a comment for a control within an audit",
		"risk": "write",
		"pathParams": [
			"auditId",
			"controlId",
			"commentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"text",
				"email"
			],
			"requiredProperties": [
				"text",
				"email"
			]
		}
	},
	{
		"id": "UpdateCommentForInformationRequest",
		"group": "audits",
		"command": "update-comment-for-information-request",
		"method": "patch",
		"path": "/audits/{auditId}/information-requests/{requestId}/comments/{commentId}",
		"summary": "Update a comment for an information request",
		"risk": "write",
		"pathParams": [
			"auditId",
			"requestId",
			"commentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"text",
				"email"
			],
			"requiredProperties": [
				"text",
				"email"
			]
		}
	},
	{
		"id": "UpdateInformationRequest",
		"group": "audits",
		"command": "update-information-request",
		"method": "patch",
		"path": "/audits/{auditId}/information-requests/{requestId}",
		"summary": "Update an information request for an audit",
		"risk": "write",
		"pathParams": [
			"auditId",
			"requestId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"frameworkCodes",
				"description",
				"dueDate",
				"evidenceCaptureDate",
				"requestType",
				"title",
				"cadence",
				"additionalControlIds"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpsertAssessmentForControl",
		"group": "audits",
		"command": "upsert-assessment-for-control",
		"method": "put",
		"path": "/audits/{auditId}/controls/{controlId}/assessment",
		"summary": "Upsert a control's assessment within an audit",
		"risk": "write",
		"pathParams": [
			"auditId",
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"segmentId",
				"assessmentState",
				"justification",
				"auditorEmail"
			],
			"requiredProperties": [
				"assessmentState",
				"justification",
				"auditorEmail"
			]
		}
	},
	{
		"id": "get-BackgroundCheckConnector",
		"group": "background-checks",
		"command": "get-background-check-connector",
		"method": "get",
		"path": "/resources/background_check_connector",
		"summary": "List all Background Checks",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-BackgroundCheckConnector",
		"group": "background-checks",
		"command": "put-background-check-connector",
		"method": "put",
		"path": "/resources/background_check_connector",
		"summary": "Sync all Background Checks",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "DeleteContract",
		"group": "contracts",
		"command": "delete-contract",
		"method": "delete",
		"path": "/contracts/{contractId}",
		"summary": "Delete contract",
		"risk": "destructive",
		"pathParams": [
			"contractId"
		],
		"queryParams": []
	},
	{
		"id": "GetContract",
		"group": "contracts",
		"command": "get-contract",
		"method": "get",
		"path": "/contracts/{contractId}",
		"summary": "Get contract",
		"risk": "read",
		"pathParams": [
			"contractId"
		],
		"queryParams": []
	},
	{
		"id": "ListContracts",
		"group": "contracts",
		"command": "list-contracts",
		"method": "get",
		"path": "/contracts",
		"summary": "List contracts",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "UploadContract",
		"group": "contracts",
		"command": "upload-contract",
		"method": "post",
		"path": "/contracts",
		"summary": "Upload contract",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "AddControlFromLibrary",
		"group": "controls",
		"command": "add-control-from-library",
		"method": "post",
		"path": "/controls/add-from-library",
		"summary": "Add control from Vanta library",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlId"
			],
			"requiredProperties": [
				"controlId"
			]
		}
	},
	{
		"id": "AddDocumentToControl",
		"group": "controls",
		"command": "add-document-to-control",
		"method": "post",
		"path": "/controls/{controlId}/add-document-to-control",
		"summary": "Add control to document mapping",
		"risk": "write",
		"pathParams": [
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"documentId"
			],
			"requiredProperties": [
				"documentId"
			]
		}
	},
	{
		"id": "AddTestToControl",
		"group": "controls",
		"command": "add-test-to-control",
		"method": "post",
		"path": "/controls/{controlId}/add-test-to-control",
		"summary": "Add control to test mapping",
		"risk": "write",
		"pathParams": [
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"testId"
			],
			"requiredProperties": [
				"testId"
			]
		}
	},
	{
		"id": "CreateCustomControl",
		"group": "controls",
		"command": "create-custom-control",
		"method": "post",
		"path": "/controls",
		"summary": "Create custom control",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"externalId",
				"name",
				"description",
				"effectiveDate",
				"domain",
				"sections",
				"role",
				"customFields"
			],
			"requiredProperties": [
				"externalId",
				"name",
				"description",
				"effectiveDate",
				"domain"
			]
		}
	},
	{
		"id": "DeleteControl",
		"group": "controls",
		"command": "delete-control",
		"method": "delete",
		"path": "/controls/{controlId}",
		"summary": "Deactivates a control",
		"risk": "destructive",
		"pathParams": [
			"controlId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteDocumentForcontrol",
		"group": "controls",
		"command": "delete-document-forcontrol",
		"method": "delete",
		"path": "/controls/{controlId}/documents/{documentId}",
		"summary": "Remove control from document mapping",
		"risk": "destructive",
		"pathParams": [
			"controlId",
			"documentId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTestForControl",
		"group": "controls",
		"command": "delete-test-for-control",
		"method": "delete",
		"path": "/controls/{controlId}/tests/{testId}",
		"summary": "Remove control from test mapping",
		"risk": "destructive",
		"pathParams": [
			"controlId",
			"testId"
		],
		"queryParams": []
	},
	{
		"id": "GetControl",
		"group": "controls",
		"command": "get-control",
		"method": "get",
		"path": "/controls/{controlId}",
		"summary": "Get control by an ID",
		"risk": "read",
		"pathParams": [
			"controlId"
		],
		"queryParams": []
	},
	{
		"id": "ListControls",
		"group": "controls",
		"command": "list-controls",
		"method": "get",
		"path": "/controls",
		"summary": "List controls",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "frameworkMatchesAny",
				"description": "Includes all controls belonging to one of the provided framework values in frameworkMatchesAny.",
				"type": "array"
			}
		]
	},
	{
		"id": "ListDeactivatedControls",
		"group": "controls",
		"command": "list-deactivated-controls",
		"method": "get",
		"path": "/controls/deactivated-controls",
		"summary": "List deactivated controls",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListDocumentsForControl",
		"group": "controls",
		"command": "list-documents-for-control",
		"method": "get",
		"path": "/controls/{controlId}/documents",
		"summary": "List a control's documents",
		"risk": "read",
		"pathParams": [
			"controlId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListLibraryControls",
		"group": "controls",
		"command": "list-library-controls",
		"method": "get",
		"path": "/controls/controls-library",
		"summary": "List Vanta controls from the library",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		],
		"deprecated": true
	},
	{
		"id": "ListTestsForControl",
		"group": "controls",
		"command": "list-tests-for-control",
		"method": "get",
		"path": "/controls/{controlId}/tests",
		"summary": "List a control's tests",
		"risk": "read",
		"pathParams": [
			"controlId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "SetOwnerForControl",
		"group": "controls",
		"command": "set-owner-for-control",
		"method": "post",
		"path": "/controls/{controlId}/set-owner",
		"summary": "Set owner of a control",
		"risk": "write",
		"pathParams": [
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"userId"
			],
			"requiredProperties": [
				"userId"
			]
		}
	},
	{
		"id": "UpdateControlMetadata",
		"group": "controls",
		"command": "update-control-metadata",
		"method": "patch",
		"path": "/controls/{controlId}",
		"summary": "Update a control's metadata",
		"risk": "write",
		"pathParams": [
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"externalId",
				"description",
				"domain",
				"note",
				"customFields"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "get-CustomResource",
		"group": "custom-resources",
		"command": "get-custom-resource",
		"method": "get",
		"path": "/resources/custom_resource",
		"summary": "List all Custom Resources",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-CustomResource",
		"group": "custom-resources",
		"command": "put-custom-resource",
		"method": "put",
		"path": "/resources/custom_resource",
		"summary": "Sync all Custom Resources",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "AddTagCategoryProductContext",
		"group": "customer-trust",
		"command": "add-tag-category-product-context",
		"method": "post",
		"path": "/customer-trust/tag-categories/{tagCategoryId}/product-contexts",
		"summary": "Enable tag category for product context",
		"risk": "write",
		"pathParams": [
			"tagCategoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"productContextId"
			],
			"requiredProperties": [
				"productContextId"
			]
		}
	},
	{
		"id": "ApproveQuestionnaire",
		"group": "customer-trust",
		"command": "approve-questionnaire",
		"method": "post",
		"path": "/customer-trust/questionnaires/{questionnaireId}/approve",
		"summary": "Approve questionnaire",
		"risk": "write",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"statusChangeMessage"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "CompleteQuestionnaire",
		"group": "customer-trust",
		"command": "complete-questionnaire",
		"method": "post",
		"path": "/customer-trust/questionnaires/{questionnaireId}/complete",
		"summary": "Complete questionnaire",
		"risk": "write",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"shouldSyncApprovedToAnswerLibrary"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "CreateCustomerTrustAccount",
		"group": "customer-trust",
		"command": "create-customer-trust-account",
		"method": "post",
		"path": "/customer-trust/accounts",
		"summary": "Create customer trust account",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"emailDomain",
				"ndaDetails",
				"accessConfig",
				"customFields",
				"tagsByCategory"
			],
			"requiredProperties": [
				"name",
				"emailDomain"
			]
		}
	},
	{
		"id": "CreateDeletionRequest",
		"group": "customer-trust",
		"command": "create-deletion-request",
		"method": "post",
		"path": "/customer-trust/deletion-requests",
		"summary": "Create data deletion request",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email"
			],
			"requiredProperties": [
				"email"
			]
		}
	},
	{
		"id": "CreateFileQuestionnaire",
		"group": "customer-trust",
		"command": "create-file-questionnaire",
		"method": "post",
		"path": "/customer-trust/questionnaires/file",
		"summary": "Create file questionnaire",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "CreateQuestionnaireExport",
		"group": "customer-trust",
		"command": "create-questionnaire-export",
		"method": "post",
		"path": "/customer-trust/questionnaires/exports",
		"summary": "Create questionnaire export",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"questionnaireId",
				"format"
			],
			"requiredProperties": [
				"questionnaireId",
				"format"
			]
		}
	},
	{
		"id": "CreateWebsiteQuestionnaire",
		"group": "customer-trust",
		"command": "create-website-questionnaire",
		"method": "post",
		"path": "/customer-trust/questionnaires/website",
		"summary": "Create website questionnaire",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"displayName",
				"url",
				"ownerAssignment",
				"approverAssignment",
				"companyUrl",
				"customerTrustAccountId",
				"description",
				"dueDate",
				"metadata",
				"includeUntaggedEntitiesForCategoryIds",
				"tagAndCategoryIds"
			],
			"requiredProperties": [
				"displayName",
				"url"
			]
		}
	},
	{
		"id": "DeleteCustomerTrustAccount",
		"group": "customer-trust",
		"command": "delete-customer-trust-account",
		"method": "delete",
		"path": "/customer-trust/accounts/{accountId}",
		"summary": "Delete customer trust account",
		"risk": "destructive",
		"pathParams": [
			"accountId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteQuestionnaire",
		"group": "customer-trust",
		"command": "delete-questionnaire",
		"method": "delete",
		"path": "/customer-trust/questionnaires/{questionnaireId}",
		"summary": "Delete questionnaire",
		"risk": "destructive",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": []
	},
	{
		"id": "GetCustomerTrustAccount",
		"group": "customer-trust",
		"command": "get-customer-trust-account",
		"method": "get",
		"path": "/customer-trust/accounts/{accountId}",
		"summary": "Get customer trust account",
		"risk": "read",
		"pathParams": [
			"accountId"
		],
		"queryParams": []
	},
	{
		"id": "GetQuestionnaire",
		"group": "customer-trust",
		"command": "get-questionnaire",
		"method": "get",
		"path": "/customer-trust/questionnaires/{questionnaireId}",
		"summary": "Get questionnaire by ID",
		"risk": "read",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": []
	},
	{
		"id": "GetQuestionnaireExport",
		"group": "customer-trust",
		"command": "get-questionnaire-export",
		"method": "get",
		"path": "/customer-trust/questionnaires/exports/{id}",
		"summary": "Get questionnaire export status",
		"risk": "read",
		"pathParams": [
			"id"
		],
		"queryParams": []
	},
	{
		"id": "GetQuestionnaireResponse",
		"group": "customer-trust",
		"command": "get-questionnaire-response",
		"method": "get",
		"path": "/customer-trust/questionnaires/{questionnaireId}/responses/{responseId}",
		"summary": "Get questionnaire response",
		"risk": "read",
		"pathParams": [
			"questionnaireId",
			"responseId"
		],
		"queryParams": []
	},
	{
		"id": "GetTagsForCategory",
		"group": "customer-trust",
		"command": "get-tags-for-category",
		"method": "get",
		"path": "/customer-trust/tag-categories/{tagCategoryId}",
		"summary": "Get tags for category",
		"risk": "read",
		"pathParams": [
			"tagCategoryId"
		],
		"queryParams": []
	},
	{
		"id": "ListAssignableUsers",
		"group": "customer-trust",
		"command": "list-assignable-users",
		"method": "get",
		"path": "/customer-trust/questionnaires/assignable-users",
		"summary": "List assignable users",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "role",
				"description": "Filter by role: \"owner\" or \"approver\".",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Optional search string to filter users by name or email.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListCustomerTrustAccounts",
		"group": "customer-trust",
		"command": "list-customer-trust-accounts",
		"method": "get",
		"path": "/customer-trust/accounts",
		"summary": "List customer trust accounts",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "searchString",
				"description": "",
				"type": "string"
			},
			{
				"name": "isAutoApprovalEnabled",
				"description": "",
				"type": "boolean"
			},
			{
				"name": "customFieldsFilter",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListQuestionnaireResponses",
		"group": "customer-trust",
		"command": "list-questionnaire-responses",
		"method": "get",
		"path": "/customer-trust/questionnaires/{questionnaireId}/responses",
		"summary": "List questionnaire responses",
		"risk": "read",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Filter responses by question text (case-insensitive, partial match).",
				"type": "string"
			}
		]
	},
	{
		"id": "ListQuestionnaires",
		"group": "customer-trust",
		"command": "list-questionnaires",
		"method": "get",
		"path": "/customer-trust/questionnaires",
		"summary": "List questionnaires",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Filter questionnaires by display name (case-insensitive, partial match).",
				"type": "string"
			},
			{
				"name": "statusMatchesAny",
				"description": "Filter questionnaires matching any of the provided statuses.",
				"type": "array"
			},
			{
				"name": "typeMatchesAny",
				"description": "Filter questionnaires matching any of the provided types.",
				"type": "array"
			},
			{
				"name": "createdAfter",
				"description": "Filter to questionnaires created after this date (ISO 8601 string).",
				"type": "string"
			},
			{
				"name": "createdBefore",
				"description": "Filter to questionnaires created before this date (ISO 8601 string).",
				"type": "string"
			},
			{
				"name": "ownerIdMatchesAny",
				"description": "Filter to questionnaires owned by any of the provided user IDs.",
				"type": "array"
			},
			{
				"name": "approverIdMatchesAny",
				"description": "Filter to questionnaires with an approver matching any of the provided user IDs.",
				"type": "array"
			}
		]
	},
	{
		"id": "ListTagCategories",
		"group": "customer-trust",
		"command": "list-tag-categories",
		"method": "get",
		"path": "/customer-trust/tag-categories",
		"summary": "List tag categories",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "productContextIdsMatchesAny",
				"description": "",
				"type": "array"
			}
		]
	},
	{
		"id": "RemoveTagCategoryProductContext",
		"group": "customer-trust",
		"command": "remove-tag-category-product-context",
		"method": "delete",
		"path": "/customer-trust/tag-categories/{tagCategoryId}/product-contexts/{productContextId}",
		"summary": "Disable tag category for product context",
		"risk": "destructive",
		"pathParams": [
			"tagCategoryId",
			"productContextId"
		],
		"queryParams": []
	},
	{
		"id": "UpdateCustomerTrustAccount",
		"group": "customer-trust",
		"command": "update-customer-trust-account",
		"method": "patch",
		"path": "/customer-trust/accounts/{accountId}",
		"summary": "Update customer trust account",
		"risk": "write",
		"pathParams": [
			"accountId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"emailDomain",
				"customFields",
				"tagsByCategory"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateQuestionnaire",
		"group": "customer-trust",
		"command": "update-questionnaire",
		"method": "patch",
		"path": "/customer-trust/questionnaires/{questionnaireId}",
		"summary": "Update questionnaire",
		"risk": "write",
		"pathParams": [
			"questionnaireId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"displayName",
				"dueDate",
				"status",
				"ownerAssignment",
				"approverAssignment",
				"metadata",
				"tagAndCategoryIds"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateQuestionnaireResponseContent",
		"group": "customer-trust",
		"command": "update-questionnaire-response-content",
		"method": "patch",
		"path": "/customer-trust/questionnaires/{questionnaireId}/responses/{responseId}",
		"summary": "Update questionnaire response content",
		"risk": "write",
		"pathParams": [
			"questionnaireId",
			"responseId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"answerPartsValues"
			],
			"requiredProperties": [
				"answerPartsValues"
			]
		}
	},
	{
		"id": "UpdateQuestionnaireResponseOwner",
		"group": "customer-trust",
		"command": "update-questionnaire-response-owner",
		"method": "patch",
		"path": "/customer-trust/questionnaires/{questionnaireId}/responses/{responseId}/owner",
		"summary": "Update questionnaire response owner",
		"risk": "write",
		"pathParams": [
			"questionnaireId",
			"responseId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"ownerAssignment"
			],
			"requiredProperties": [
				"ownerAssignment"
			]
		}
	},
	{
		"id": "AddDiscoveredVendorToManaged",
		"group": "discovered-vendors",
		"command": "add-discovered-vendor-to-managed",
		"method": "post",
		"path": "/discovered-vendors/{discoveredVendorId}/add-to-managed",
		"summary": "Adds a discovered vendor to managed vendor by ID",
		"risk": "write",
		"pathParams": [
			"discoveredVendorId"
		],
		"queryParams": []
	},
	{
		"id": "ListDiscoveredVendorAccounts",
		"group": "discovered-vendors",
		"command": "list-discovered-vendor-accounts",
		"method": "get",
		"path": "/discovered-vendors/{discoveredVendorId}/accounts",
		"summary": "List of discovered vendor accounts",
		"risk": "read",
		"pathParams": [
			"discoveredVendorId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListDiscoveredVendors",
		"group": "discovered-vendors",
		"command": "list-discovered-vendors",
		"method": "get",
		"path": "/discovered-vendors",
		"summary": "List discovered vendors",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "scope",
				"description": "Defaults to \"NEEDS_REVIEW\" if not provided",
				"type": "string"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "CreateDocument",
		"group": "documents",
		"command": "create-document",
		"method": "post",
		"path": "/documents",
		"summary": "Create a custom document",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"description",
				"timeSensitivity",
				"cadence",
				"reminderWindow",
				"isSensitive"
			],
			"requiredProperties": [
				"title",
				"description",
				"timeSensitivity",
				"cadence",
				"reminderWindow",
				"isSensitive"
			]
		}
	},
	{
		"id": "CreateLinkForDocument",
		"group": "documents",
		"command": "create-link-for-document",
		"method": "post",
		"path": "/documents/{documentId}/links",
		"summary": "Create document link",
		"risk": "write",
		"pathParams": [
			"documentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"url",
				"title",
				"description",
				"effectiveDate"
			],
			"requiredProperties": [
				"url",
				"title"
			]
		}
	},
	{
		"id": "DeleteDocument",
		"group": "documents",
		"command": "delete-document",
		"method": "delete",
		"path": "/documents/{documentId}",
		"summary": "Delete document by ID",
		"risk": "destructive",
		"pathParams": [
			"documentId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteFileForDocument",
		"group": "documents",
		"command": "delete-file-for-document",
		"method": "delete",
		"path": "/documents/{documentId}/uploads/{uploadedFileId}",
		"summary": "Delete file for a document",
		"risk": "destructive",
		"pathParams": [
			"documentId",
			"uploadedFileId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteLinkForDocument",
		"group": "documents",
		"command": "delete-link-for-document",
		"method": "delete",
		"path": "/documents/{documentId}/links/{linkId}",
		"summary": "Remove document link",
		"risk": "destructive",
		"pathParams": [
			"documentId",
			"linkId"
		],
		"queryParams": []
	},
	{
		"id": "GetDocument",
		"group": "documents",
		"command": "get-document",
		"method": "get",
		"path": "/documents/{documentId}",
		"summary": "Get document by ID",
		"risk": "read",
		"pathParams": [
			"documentId"
		],
		"queryParams": []
	},
	{
		"id": "GetUploadedfileMedia",
		"group": "documents",
		"command": "get-uploadedfile-media",
		"method": "get",
		"path": "/documents/{documentId}/uploads/{uploadedFileId}/media",
		"summary": "Download file for document",
		"risk": "read",
		"pathParams": [
			"documentId",
			"uploadedFileId"
		],
		"queryParams": []
	},
	{
		"id": "ListControlsForDocument",
		"group": "documents",
		"command": "list-controls-for-document",
		"method": "get",
		"path": "/documents/{documentId}/controls",
		"summary": "List document's controls",
		"risk": "read",
		"pathParams": [
			"documentId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListDocuments",
		"group": "documents",
		"command": "list-documents",
		"method": "get",
		"path": "/documents",
		"summary": "List documents",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "frameworkMatchesAny",
				"description": "Includes all documents that match one of the provided framework values in frameworkMatchesAny.",
				"type": "array"
			},
			{
				"name": "statusMatchesAny",
				"description": "Includes all documents that match one of the provided status values in statusMatchesAny.",
				"type": "array"
			}
		]
	},
	{
		"id": "ListFilesForDocument",
		"group": "documents",
		"command": "list-files-for-document",
		"method": "get",
		"path": "/documents/{documentId}/uploads",
		"summary": "List document's uploads",
		"risk": "read",
		"pathParams": [
			"documentId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListLinksForDocument",
		"group": "documents",
		"command": "list-links-for-document",
		"method": "get",
		"path": "/documents/{documentId}/links",
		"summary": "List document's links",
		"risk": "read",
		"pathParams": [
			"documentId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "SetOwnerForDocument",
		"group": "documents",
		"command": "set-owner-for-document",
		"method": "post",
		"path": "/documents/{documentId}/set-owner",
		"summary": "Set document owner",
		"risk": "write",
		"pathParams": [
			"documentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"userId"
			],
			"requiredProperties": [
				"userId"
			]
		}
	},
	{
		"id": "SubmitDocumentCollection",
		"group": "documents",
		"command": "submit-document-collection",
		"method": "post",
		"path": "/documents/{documentId}/submit",
		"summary": "Submit document collection",
		"risk": "write",
		"pathParams": [
			"documentId"
		],
		"queryParams": []
	},
	{
		"id": "UploadFileForDocument",
		"group": "documents",
		"command": "upload-file-for-document",
		"method": "post",
		"path": "/documents/{documentId}/uploads",
		"summary": "Upload file for document",
		"risk": "write",
		"pathParams": [
			"documentId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "ListEventLogs",
		"group": "event-logs",
		"command": "list-event-logs",
		"method": "get",
		"path": "/event-logs",
		"summary": "List event logs",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "startDate",
				"description": "Filter to event logs created at or after this ISO 8601 timestamp.",
				"type": "string"
			}
		]
	},
	{
		"id": "GetFramework",
		"group": "frameworks",
		"command": "get-framework",
		"method": "get",
		"path": "/frameworks/{frameworkId}",
		"summary": "Get framework by ID",
		"risk": "read",
		"pathParams": [
			"frameworkId"
		],
		"queryParams": []
	},
	{
		"id": "ListControlsForFramework",
		"group": "frameworks",
		"command": "list-controls-for-framework",
		"method": "get",
		"path": "/frameworks/{frameworkId}/controls",
		"summary": "List a framework's controls",
		"risk": "read",
		"pathParams": [
			"frameworkId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListFrameworks",
		"group": "frameworks",
		"command": "list-frameworks",
		"method": "get",
		"path": "/frameworks",
		"summary": "List available frameworks",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "AddPeopleToGroup",
		"group": "groups",
		"command": "add-people-to-group",
		"method": "post",
		"path": "/groups/{groupId}/add-people",
		"summary": "Add people to group",
		"risk": "write",
		"pathParams": [
			"groupId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "AddPersonToGroup",
		"group": "groups",
		"command": "add-person-to-group",
		"method": "post",
		"path": "/groups/{groupId}/people",
		"summary": "Add person to a group",
		"risk": "write",
		"pathParams": [
			"groupId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"id"
			],
			"requiredProperties": [
				"id"
			]
		}
	},
	{
		"id": "CreateGroup",
		"group": "groups",
		"command": "create-group",
		"method": "post",
		"path": "/groups",
		"summary": "Create group",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"pointOfContactEmail",
				"description",
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "GetGroup",
		"group": "groups",
		"command": "get-group",
		"method": "get",
		"path": "/groups/{groupId}",
		"summary": "Get group by ID",
		"risk": "read",
		"pathParams": [
			"groupId"
		],
		"queryParams": []
	},
	{
		"id": "GetGroupMembers",
		"group": "groups",
		"command": "get-group-members",
		"method": "get",
		"path": "/groups/{groupId}/people",
		"summary": "List people in a group",
		"risk": "read",
		"pathParams": [
			"groupId"
		],
		"queryParams": []
	},
	{
		"id": "ImportIdpGroups",
		"group": "groups",
		"command": "import-idp-groups",
		"method": "post",
		"path": "/groups/import-from-idp",
		"summary": "Import IdP groups",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"idpGroupIds"
			],
			"requiredProperties": [
				"idpGroupIds"
			]
		}
	},
	{
		"id": "ListImportableIdpGroups",
		"group": "groups",
		"command": "list-importable-idp-groups",
		"method": "get",
		"path": "/groups/importable-idp-groups",
		"summary": "List importable IdP groups",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "search",
				"description": "",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "",
				"type": "array"
			}
		]
	},
	{
		"id": "ListPersonGroups",
		"group": "groups",
		"command": "list-person-groups",
		"method": "get",
		"path": "/groups",
		"summary": "List groups",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "RemovePeopleFromGroup",
		"group": "groups",
		"command": "remove-people-from-group",
		"method": "post",
		"path": "/groups/{groupId}/remove-people",
		"summary": "Remove people from group",
		"risk": "destructive",
		"pathParams": [
			"groupId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "RemovePersonFromGroup",
		"group": "groups",
		"command": "remove-person-from-group",
		"method": "delete",
		"path": "/groups/{groupId}/people/{personId}",
		"summary": "Remove person from a group",
		"risk": "destructive",
		"pathParams": [
			"groupId",
			"personId"
		],
		"queryParams": []
	},
	{
		"id": "GetConnectedIntegration",
		"group": "integrations",
		"command": "get-connected-integration",
		"method": "get",
		"path": "/integrations/{integrationId}",
		"summary": "Get a connected integration",
		"risk": "read",
		"pathParams": [
			"integrationId"
		],
		"queryParams": []
	},
	{
		"id": "GetResource",
		"group": "integrations",
		"command": "get-resource",
		"method": "get",
		"path": "/integrations/{integrationId}/resource-kinds/{resourceKind}/resources/{resourceId}",
		"summary": "Get resource by ID",
		"risk": "read",
		"pathParams": [
			"integrationId",
			"resourceKind",
			"resourceId"
		],
		"queryParams": []
	},
	{
		"id": "GetResourceKindDetails",
		"group": "integrations",
		"command": "get-resource-kind-details",
		"method": "get",
		"path": "/integrations/{integrationId}/resource-kinds/{resourceKind}",
		"summary": "Get details for resource kind",
		"risk": "read",
		"pathParams": [
			"integrationId",
			"resourceKind"
		],
		"queryParams": [
			{
				"name": "connectionId",
				"description": "Unique identifier of the integration connection.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListConnectedIntegrations",
		"group": "integrations",
		"command": "list-connected-integrations",
		"method": "get",
		"path": "/integrations",
		"summary": "List connected integrations",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListResourceKindSummaries",
		"group": "integrations",
		"command": "list-resource-kind-summaries",
		"method": "get",
		"path": "/integrations/{integrationId}/resource-kinds",
		"summary": "List integration resource kinds",
		"risk": "read",
		"pathParams": [
			"integrationId"
		],
		"queryParams": []
	},
	{
		"id": "ListResources",
		"group": "integrations",
		"command": "list-resources",
		"method": "get",
		"path": "/integrations/{integrationId}/resource-kinds/{resourceKind}/resources",
		"summary": "List resources",
		"risk": "read",
		"pathParams": [
			"integrationId",
			"resourceKind"
		],
		"queryParams": [
			{
				"name": "connectionId",
				"description": "Unique identifier of the integration connection.",
				"type": "string"
			},
			{
				"name": "hasDescription",
				"description": "Filter resources that have a description. If omitted, this will return resources both with and without a description.",
				"type": "boolean"
			},
			{
				"name": "hasOwner",
				"description": "Filter resources that have an owner. If omitted, this will return resources both with and without an owner.",
				"type": "boolean"
			},
			{
				"name": "isInScope",
				"description": "Filter resources that are in scope. If omitted, this will return resources both in and out of scope.",
				"type": "boolean"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "UpdateResource",
		"group": "integrations",
		"command": "update-resource",
		"method": "patch",
		"path": "/integrations/{integrationId}/resource-kinds/{resourceKind}/resources/{resourceId}",
		"summary": "Update resource metadata",
		"risk": "write",
		"pathParams": [
			"integrationId",
			"resourceKind",
			"resourceId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"inScope",
				"description",
				"ownerId"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateResources",
		"group": "integrations",
		"command": "update-resources",
		"method": "patch",
		"path": "/integrations/{integrationId}/resource-kinds/{resourceKind}/resources",
		"summary": "Update resource metadata",
		"risk": "write",
		"pathParams": [
			"integrationId",
			"resourceKind"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "GetIssue",
		"group": "issues",
		"command": "get-issue",
		"method": "get",
		"path": "/issues/{issueId}",
		"summary": "Get issue by ID",
		"risk": "read",
		"pathParams": [
			"issueId"
		],
		"queryParams": []
	},
	{
		"id": "List",
		"group": "issues",
		"command": "list",
		"method": "get",
		"path": "/issues",
		"summary": "List issues",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "search",
				"description": "Full-text search across issue title and description.",
				"type": "string"
			},
			{
				"name": "readableIssueIdMatchesAny",
				"description": "Filter to issues matching any of the provided readable issue IDs.",
				"type": "array"
			},
			{
				"name": "statusMatchesAny",
				"description": "Filter to issues matching any of the provided statuses.",
				"type": "array"
			},
			{
				"name": "severityMatchesAny",
				"description": "Filter to issues matching any of the provided severities.",
				"type": "array"
			},
			{
				"name": "sourceMatchesAny",
				"description": "Filter to issues matching any of the provided sources.",
				"type": "array"
			},
			{
				"name": "typeMatchesAny",
				"description": "Filter to issues matching any of the provided types.",
				"type": "array"
			},
			{
				"name": "ownerIdMatchesAny",
				"description": "Filter to issues owned by any of the provided owner IDs.",
				"type": "array"
			},
			{
				"name": "templateMatchesAny",
				"description": "Filter to issues matching any of the provided templates.",
				"type": "array"
			},
			{
				"name": "closeReasonMatchesAny",
				"description": "Filter to issues closed for any of the provided reasons. Only applies to issues with a CLOSED status.",
				"type": "array"
			},
			{
				"name": "closedAfterDate",
				"description": "Filter to issues closed on or after this date.",
				"type": "string"
			},
			{
				"name": "closedBeforeDate",
				"description": "Filter to issues closed on or before this date.",
				"type": "string"
			},
			{
				"name": "includeIssuesWithoutDueDate",
				"description": "Include issues without a due date. This is functionally a no-op if dueBeforeDate or dueAfterDate are not provided.",
				"type": "boolean"
			},
			{
				"name": "includeOnlyIssuesWithoutDueDate",
				"description": "Only include issues without a due date. This filter cannot be used in conjunction with dueBeforeDate or dueAfterDate.",
				"type": "boolean"
			},
			{
				"name": "dueAfterDate",
				"description": "Filter to issues with a due date on or after this date.",
				"type": "string"
			},
			{
				"name": "dueBeforeDate",
				"description": "Filter to issues with a due date on or before this date.",
				"type": "string"
			},
			{
				"name": "detectedAfterDate",
				"description": "Filter to issues detected on or after this date.",
				"type": "string"
			},
			{
				"name": "detectedBeforeDate",
				"description": "Filter to issues detected on or before this date.",
				"type": "string"
			},
			{
				"name": "createdAfterDate",
				"description": "Filter to issues created on or after this date.",
				"type": "string"
			},
			{
				"name": "createdBeforeDate",
				"description": "Filter to issues created on or before this date.",
				"type": "string"
			},
			{
				"name": "auditIdMatchesAny",
				"description": "Filter to issues sourced from any of the provided audit IDs.",
				"type": "array"
			},
			{
				"name": "controlIdMatchesAny",
				"description": "Filter to issues mapped to any of the provided control IDs.",
				"type": "array"
			},
			{
				"name": "orderBy",
				"description": "Field to sort the results by.",
				"type": "string"
			},
			{
				"name": "orderDirection",
				"description": "Direction to sort the results in. One of `asc` or `desc`. Defaults to `asc`.",
				"type": "string"
			}
		]
	},
	{
		"id": "CreateAnswerLibraryEntry",
		"group": "knowledge-base",
		"command": "create-answer-library-entry",
		"method": "post",
		"path": "/knowledge-base/answer-library",
		"summary": "Create Answer Library entry",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"question",
				"answer",
				"ownerAssignment",
				"expirationDate",
				"tags"
			],
			"requiredProperties": [
				"question",
				"answer"
			]
		}
	},
	{
		"id": "CreateDocumentResource",
		"group": "knowledge-base",
		"command": "create-document-resource",
		"method": "post",
		"path": "/knowledge-base/resources/documents",
		"summary": "Create document resource",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "CreateWebpageResource",
		"group": "knowledge-base",
		"command": "create-webpage-resource",
		"method": "post",
		"path": "/knowledge-base/resources/webpages",
		"summary": "Create webpage resource",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"url",
				"description",
				"ownerAssignment",
				"customerVisibility",
				"includeSubPages",
				"isUsedInQuestionnaires",
				"expirationDate",
				"tags",
				"categoryId"
			],
			"requiredProperties": [
				"title",
				"url"
			]
		}
	},
	{
		"id": "DeleteAnswerLibraryEntryRoute",
		"group": "knowledge-base",
		"command": "delete-answer-library-entry-route",
		"method": "delete",
		"path": "/knowledge-base/answer-library/{id}",
		"summary": "Delete Answer Library entry",
		"risk": "destructive",
		"pathParams": [
			"id"
		],
		"queryParams": []
	},
	{
		"id": "DeleteKnowledgeBaseResource",
		"group": "knowledge-base",
		"command": "delete-knowledge-base-resource",
		"method": "delete",
		"path": "/knowledge-base/resources/{id}",
		"summary": "Delete Knowledge Base resource",
		"risk": "destructive",
		"pathParams": [
			"id"
		],
		"queryParams": []
	},
	{
		"id": "GetAnswerLibraryEntry",
		"group": "knowledge-base",
		"command": "get-answer-library-entry",
		"method": "get",
		"path": "/knowledge-base/answer-library/{id}",
		"summary": "Get Answer Library entry",
		"risk": "read",
		"pathParams": [
			"id"
		],
		"queryParams": []
	},
	{
		"id": "GetKnowledgeBaseResource",
		"group": "knowledge-base",
		"command": "get-knowledge-base-resource",
		"method": "get",
		"path": "/knowledge-base/resources/{id}",
		"summary": "Get Knowledge Base resource",
		"risk": "read",
		"pathParams": [
			"id"
		],
		"queryParams": []
	},
	{
		"id": "ListAnswerLibraryEntries",
		"group": "knowledge-base",
		"command": "list-answer-library-entries",
		"method": "get",
		"path": "/knowledge-base/answer-library",
		"summary": "List Answer Library entries",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Full-text search across question and answer.",
				"type": "string"
			},
			{
				"name": "lastUpdatedAfter",
				"description": "Only include entries updated at or after this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "lastUpdatedBefore",
				"description": "Only include entries updated at or before this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "matchesTags",
				"description": "JSON-encoded array of `{categoryId, tagId}` pairs. Entries matching any of the given tags are returned (OR filter). Disc",
				"type": "string"
			},
			{
				"name": "expiresBefore",
				"description": "Only include entries expiring at or before this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "expiresAfter",
				"description": "Only include entries expiring at or after this ISO 8601 timestamp.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListKnowledgeBaseResources",
		"group": "knowledge-base",
		"command": "list-knowledge-base-resources",
		"method": "get",
		"path": "/knowledge-base/resources",
		"summary": "List Knowledge Base resources",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Full-text search across resource titles.",
				"type": "string"
			},
			{
				"name": "typeMatchesAny",
				"description": "Filter to FILE and/or URL resources. Repeat the param to allow either.",
				"type": "array"
			},
			{
				"name": "lastUpdatedAfter",
				"description": "Only include resources updated at or after this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "lastUpdatedBefore",
				"description": "Only include resources updated at or before this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "matchesTags",
				"description": "JSON-encoded array of `{categoryId, tagId}` pairs. Tags within the same category are OR'd together; tags across differen",
				"type": "string"
			},
			{
				"name": "expiresBefore",
				"description": "Only include resources expiring at or before this ISO 8601 timestamp.",
				"type": "string"
			},
			{
				"name": "expiresAfter",
				"description": "Only include resources expiring at or after this ISO 8601 timestamp.",
				"type": "string"
			}
		]
	},
	{
		"id": "ReplaceDocumentResourceFile",
		"group": "knowledge-base",
		"command": "replace-document-resource-file",
		"method": "post",
		"path": "/knowledge-base/resources/documents/{id}/upload",
		"summary": "Replace document resource file",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateAnswerLibraryEntryRoute",
		"group": "knowledge-base",
		"command": "update-answer-library-entry-route",
		"method": "patch",
		"path": "/knowledge-base/answer-library/{id}",
		"summary": "Update Answer Library entry",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"question",
				"answer",
				"ownerAssignment",
				"expirationDate",
				"tags"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateDocumentResource",
		"group": "knowledge-base",
		"command": "update-document-resource",
		"method": "patch",
		"path": "/knowledge-base/resources/documents/{id}",
		"summary": "Update document resource",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"description",
				"ownerAssignment",
				"customerVisibility",
				"downloadPermission",
				"isUsedInQuestionnaires",
				"expirationDate",
				"tags",
				"categoryId"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateWebpageResource",
		"group": "knowledge-base",
		"command": "update-webpage-resource",
		"method": "patch",
		"path": "/knowledge-base/resources/webpages/{id}",
		"summary": "Update webpage resource",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"description",
				"ownerAssignment",
				"customerVisibility",
				"includeSubPages",
				"isUsedInQuestionnaires",
				"expirationDate",
				"tags",
				"categoryId"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "VerifyAnswerLibraryEntryRoute",
		"group": "knowledge-base",
		"command": "verify-answer-library-entry-route",
		"method": "post",
		"path": "/knowledge-base/answer-library/{id}/verify",
		"summary": "Verify Answer Library entry",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": false,
			"properties": [
				"expirationDate"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "VerifyKnowledgeBaseResource",
		"group": "knowledge-base",
		"command": "verify-knowledge-base-resource",
		"method": "post",
		"path": "/knowledge-base/resources/{id}/verify",
		"summary": "Verify Knowledge Base resource",
		"risk": "write",
		"pathParams": [
			"id"
		],
		"queryParams": [],
		"body": {
			"required": false,
			"properties": [
				"expirationDate"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "get-MacosUserComputer",
		"group": "mac-os-user-computers",
		"command": "get-macos-user-computer",
		"method": "get",
		"path": "/resources/macos_user_computer",
		"summary": "List all MacOS User Computers",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-MacosUserComputer",
		"group": "mac-os-user-computers",
		"command": "put-macos-user-computer",
		"method": "put",
		"path": "/resources/macos_user_computer",
		"summary": "Sync all MacOS User Computers",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "GetMonitoredComputer",
		"group": "monitored-computers",
		"command": "get-monitored-computer",
		"method": "get",
		"path": "/monitored-computers/{computerId}",
		"summary": "Get monitored computer by ID",
		"risk": "read",
		"pathParams": [
			"computerId"
		],
		"queryParams": []
	},
	{
		"id": "ListMonitoredComputers",
		"group": "monitored-computers",
		"command": "list-monitored-computers",
		"method": "get",
		"path": "/monitored-computers",
		"summary": "List monitored computers",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "complianceStatusFilterMatchesAny",
				"description": "Filters for monitored computers matching any status declared in the filter.",
				"type": "array"
			}
		]
	},
	{
		"id": "get-PackageVulnerabilityConnectors",
		"group": "package-vulnerabilities",
		"command": "get-package-vulnerability-connectors",
		"method": "get",
		"path": "/resources/package_vulnerability_connectors",
		"summary": "List all Package Vulnerabilities",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-PackageVulnerabilityConnectors",
		"group": "package-vulnerabilities",
		"command": "put-package-vulnerability-connectors",
		"method": "put",
		"path": "/resources/package_vulnerability_connectors",
		"summary": "Sync all Package Vulnerabilities",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "ClearLeaveForPerson",
		"group": "people",
		"command": "clear-leave-for-person",
		"method": "post",
		"path": "/people/{personId}/clear-leave",
		"summary": "Remove leave information",
		"risk": "write",
		"pathParams": [
			"personId"
		],
		"queryParams": []
	},
	{
		"id": "GetPerson",
		"group": "people",
		"command": "get-person",
		"method": "get",
		"path": "/people/{personId}",
		"summary": "Get person by ID",
		"risk": "read",
		"pathParams": [
			"personId"
		],
		"queryParams": []
	},
	{
		"id": "ListPeople",
		"group": "people",
		"command": "list-people",
		"method": "get",
		"path": "/people",
		"summary": "List people",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "tasksSummaryStatusMatchesAny",
				"description": "Filter individuals by those whose tasksSummary status is any of the provided values.",
				"type": "array"
			},
			{
				"name": "taskTypeMatchesAny",
				"description": "Requires taskStatusMatchesAny. Includes all people for whom any of the provided taskType values in taskTypeMatchesAny is",
				"type": "array"
			},
			{
				"name": "taskStatusMatchesAny",
				"description": "Requires taskTypeMatchesAny. Includes all people for whom any of the provided taskType values in taskTypeMatchesAny is a",
				"type": "array"
			},
			{
				"name": "emailAndNameFilter",
				"description": "Filter people by email address, first name, or last name (partial match, case-insensitive).",
				"type": "string"
			},
			{
				"name": "groupIdsMatchesAny",
				"description": "Filter people matching any of the given group IDs.",
				"type": "array"
			},
			{
				"name": "employmentStatus",
				"description": "Filter people matching the given employment status.",
				"type": "string"
			}
		]
	},
	{
		"id": "MarkAsNotPeople",
		"group": "people",
		"command": "mark-as-not-people",
		"method": "post",
		"path": "/people/mark-as-not-people",
		"summary": "Mark as not people",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "MarkAsPeople",
		"group": "people",
		"command": "mark-as-people",
		"method": "post",
		"path": "/people/mark-as-people",
		"summary": "Mark as people",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "OffboardPeople",
		"group": "people",
		"command": "offboard-people",
		"method": "post",
		"path": "/people/offboard",
		"summary": "Offboard people",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "SetLeaveForPerson",
		"group": "people",
		"command": "set-leave-for-person",
		"method": "post",
		"path": "/people/{personId}/set-leave",
		"summary": "Set leave information",
		"risk": "write",
		"pathParams": [
			"personId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"endDate",
				"startDate"
			],
			"requiredProperties": [
				"endDate",
				"startDate"
			]
		}
	},
	{
		"id": "UpdatePerson",
		"group": "people",
		"command": "update-person",
		"method": "patch",
		"path": "/people/{personId}",
		"summary": "Update person metadata",
		"risk": "write",
		"pathParams": [
			"personId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"employment"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "GetPolicy",
		"group": "policies",
		"command": "get-policy",
		"method": "get",
		"path": "/policies/{policyId}",
		"summary": "Get policy by ID",
		"risk": "read",
		"pathParams": [
			"policyId"
		],
		"queryParams": []
	},
	{
		"id": "ListPolicies",
		"group": "policies",
		"command": "list-policies",
		"method": "get",
		"path": "/policies",
		"summary": "List policies",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "CancelRiskScenarioApprovalRequest",
		"group": "risk-scenarios",
		"command": "cancel-risk-scenario-approval-request",
		"method": "post",
		"path": "/risk-scenarios/{riskScenarioId}/cancel-approval-request",
		"summary": "Cancel risk scenario approval request",
		"risk": "write",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": []
	},
	{
		"id": "CreateRiskScenario",
		"group": "risk-scenarios",
		"command": "create-risk-scenario",
		"method": "post",
		"path": "/risk-scenarios",
		"summary": "Create risk scenario",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"description",
				"detailedDescription",
				"riskId",
				"isSensitive",
				"likelihood",
				"impact",
				"residualLikelihood",
				"residualImpact",
				"categories",
				"ciaCategories",
				"treatment",
				"owner",
				"note",
				"riskRegister",
				"customFields",
				"type",
				"identificationDate"
			],
			"requiredProperties": [
				"description"
			]
		}
	},
	{
		"id": "CreateRiskScenarioControl",
		"group": "risk-scenarios",
		"command": "create-risk-scenario-control",
		"method": "post",
		"path": "/risk-scenarios/{riskScenarioId}/controls",
		"summary": "Add a control to a risk scenario",
		"risk": "write",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlId",
				"controlType"
			],
			"requiredProperties": [
				"controlId"
			]
		}
	},
	{
		"id": "DeleteRiskScenarioControl",
		"group": "risk-scenarios",
		"command": "delete-risk-scenario-control",
		"method": "delete",
		"path": "/risk-scenarios/{riskScenarioId}/controls/{controlId}",
		"summary": "Remove a control from a risk scenario",
		"risk": "destructive",
		"pathParams": [
			"riskScenarioId",
			"controlId"
		],
		"queryParams": []
	},
	{
		"id": "GetRiskScenario",
		"group": "risk-scenarios",
		"command": "get-risk-scenario",
		"method": "get",
		"path": "/risk-scenarios/{riskScenarioId}",
		"summary": "Get risk scenario by ID",
		"risk": "read",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": []
	},
	{
		"id": "ListRiskScenario",
		"group": "risk-scenarios",
		"command": "list-risk-scenario",
		"method": "get",
		"path": "/risk-scenarios",
		"summary": "List risk scenarios",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "includeIgnored",
				"description": "",
				"type": "boolean"
			},
			{
				"name": "ownerMatchesAny",
				"description": "Use \"No owner\" to filter scenarios without owner assigned.",
				"type": "array"
			},
			{
				"name": "searchString",
				"description": "",
				"type": "string"
			},
			{
				"name": "categoryMatchesAny",
				"description": "Use \"Uncategorized\" to filter scenarios without any category.",
				"type": "array"
			},
			{
				"name": "ciaCategoryMatchesAny",
				"description": "Use \"Uncategorized\" to filter scenarios with none of Confidentiality, Integrity or Availability assigned.",
				"type": "array"
			},
			{
				"name": "treatmentTypeMatchesAny",
				"description": "Use \"No treatment type\" to filter scenarios without treatment specified.",
				"type": "array"
			},
			{
				"name": "inherentScoreGroupMatchesAny",
				"description": "",
				"type": "array"
			},
			{
				"name": "residualScoreGroupMatchesAny",
				"description": "",
				"type": "array"
			},
			{
				"name": "reviewStatusMatchesAny",
				"description": "",
				"type": "array"
			},
			{
				"name": "type",
				"description": "Filter by risk scenario type. Defaults to \"Risk Scenario\". Only returns enterprise risks when explicitly set to \"Enterpr",
				"type": "string"
			},
			{
				"name": "orderBy",
				"description": "Default to order by description alphabetically.",
				"type": "string",
				"enum": [
					"description",
					"createdAt"
				]
			}
		]
	},
	{
		"id": "ListRiskScenarioControls",
		"group": "risk-scenarios",
		"command": "list-risk-scenario-controls",
		"method": "get",
		"path": "/risk-scenarios/{riskScenarioId}/controls",
		"summary": "List risk scenario controls",
		"risk": "read",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "SubmitRiskForApproval",
		"group": "risk-scenarios",
		"command": "submit-risk-for-approval",
		"method": "post",
		"path": "/risk-scenarios/{riskScenarioId}/submit-for-approval",
		"summary": "Submit risk scenario for approval",
		"risk": "write",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"comment"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateRiskScenario",
		"group": "risk-scenarios",
		"command": "update-risk-scenario",
		"method": "patch",
		"path": "/risk-scenarios/{riskScenarioId}",
		"summary": "Update risk scenario",
		"risk": "write",
		"pathParams": [
			"riskScenarioId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"description",
				"detailedDescription",
				"isSensitive",
				"likelihood",
				"impact",
				"residualLikelihood",
				"residualImpact",
				"categories",
				"ciaCategories",
				"treatment",
				"owner",
				"note",
				"riskRegister",
				"customFields",
				"type",
				"identificationDate"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateRiskScenarioControl",
		"group": "risk-scenarios",
		"command": "update-risk-scenario-control",
		"method": "patch",
		"path": "/risk-scenarios/{riskScenarioId}/controls/{controlId}",
		"summary": "Change a risk scenario control's controlType",
		"risk": "write",
		"pathParams": [
			"riskScenarioId",
			"controlId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlType"
			],
			"requiredProperties": [
				"controlType"
			]
		}
	},
	{
		"id": "get-Secret",
		"group": "secrets",
		"command": "get-secret",
		"method": "get",
		"path": "/resources/secret",
		"summary": "List all secrets",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-Secret",
		"group": "secrets",
		"command": "put-secret",
		"method": "put",
		"path": "/resources/secret",
		"summary": "Sync all secrets",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "get-SecurityTask",
		"group": "security-tasks",
		"command": "get-security-task",
		"method": "get",
		"path": "/resources/security_task",
		"summary": "List all security tasks",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-SecurityTask",
		"group": "security-tasks",
		"command": "put-security-task",
		"method": "put",
		"path": "/resources/security_task",
		"summary": "Sync all security tasks",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "get-StaticAnalysisCodeVulnerabilityConnectors",
		"group": "static-code-analysis-vulnerabilities",
		"command": "get-static-analysis-code-vulnerability-connectors",
		"method": "get",
		"path": "/resources/static_analysis_code_vulnerability_connectors",
		"summary": "List all Static Code Analysis Vulnerabilities",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-StaticAnalysisCodeVulnerabilityConnectors",
		"group": "static-code-analysis-vulnerabilities",
		"command": "put-static-analysis-code-vulnerability-connectors",
		"method": "put",
		"path": "/resources/static_analysis_code_vulnerability_connectors",
		"summary": "Sync all Static Code Analysis Vulnerabilities",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "DeactivateTestEntity",
		"group": "tests",
		"command": "deactivate-test-entity",
		"method": "post",
		"path": "/tests/{testId}/entities/{entityId}/deactivate",
		"summary": "Deactivate test entity",
		"risk": "destructive",
		"pathParams": [
			"testId",
			"entityId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"deactivateReason",
				"deactivateUntilDate"
			],
			"requiredProperties": [
				"deactivateReason"
			]
		}
	},
	{
		"id": "GetTest",
		"group": "tests",
		"command": "get-test",
		"method": "get",
		"path": "/tests/{testId}",
		"summary": "Get test by ID",
		"risk": "read",
		"pathParams": [
			"testId"
		],
		"queryParams": []
	},
	{
		"id": "GetTestEntities",
		"group": "tests",
		"command": "get-test-entities",
		"method": "get",
		"path": "/tests/{testId}/entities",
		"summary": "Get test entities by test ID",
		"risk": "read",
		"pathParams": [
			"testId"
		],
		"queryParams": [
			{
				"name": "entityStatus",
				"description": "The status of the test entities. Defaults to FAILING. Possible values: FAILING, DEACTIVATED",
				"type": "string"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTests",
		"group": "tests",
		"command": "list-tests",
		"method": "get",
		"path": "/tests",
		"summary": "List tests",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "statusFilter",
				"description": "Filter tests by test status. Possible values: OK (Test passed), DEACTIVATED (Test is deactivated), NEEDS_ATTENTION (Test",
				"type": "string"
			},
			{
				"name": "frameworkFilter",
				"description": "Filter tests by framework.",
				"type": "string"
			},
			{
				"name": "integrationFilter",
				"description": "Filter tests by integration.",
				"type": "string"
			},
			{
				"name": "controlFilter",
				"description": "Filter tests by control ID.",
				"type": "string"
			},
			{
				"name": "ownerFilter",
				"description": "Filter tests by owner ID.",
				"type": "string"
			},
			{
				"name": "categoryFilter",
				"description": "Filter tests by category.",
				"type": "string"
			},
			{
				"name": "isInRollout",
				"description": "Filter tests by rollout status. A test in rollout is an upcoming test that does not have its history tracked yet.",
				"type": "boolean"
			}
		]
	},
	{
		"id": "ReactivateTestEntity",
		"group": "tests",
		"command": "reactivate-test-entity",
		"method": "post",
		"path": "/tests/{testId}/entities/{entityId}/reactivate",
		"summary": "Reactivate test entity",
		"risk": "write",
		"pathParams": [
			"testId",
			"entityId"
		],
		"queryParams": []
	},
	{
		"id": "AddControlToTrustCenter",
		"group": "trust-centers",
		"command": "add-control-to-trust-center",
		"method": "post",
		"path": "/trust-centers/{slugId}/controls",
		"summary": "Add Trust Center control",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlId",
				"categoryIds"
			],
			"requiredProperties": [
				"controlId",
				"categoryIds"
			]
		}
	},
	{
		"id": "AddTrustCenterControlCategory",
		"group": "trust-centers",
		"command": "add-trust-center-control-category",
		"method": "post",
		"path": "/trust-centers/{slugId}/control-categories",
		"summary": "Add Trust Center control category",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "AddTrustCenterFaqCategory",
		"group": "trust-centers",
		"command": "add-trust-center-faq-category",
		"method": "post",
		"path": "/trust-centers/{slugId}/faq-categories",
		"summary": "Add Trust Center FAQ category",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "AddTrustCenterResourceCategory",
		"group": "trust-centers",
		"command": "add-trust-center-resource-category",
		"method": "post",
		"path": "/trust-centers/{slugId}/resource-categories",
		"summary": "Add Trust Center resource category",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "AddTrustCenterViewer",
		"group": "trust-centers",
		"command": "add-trust-center-viewer",
		"method": "post",
		"path": "/trust-centers/{slugId}/viewers",
		"summary": "Add Trust Center viewer",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email",
				"name",
				"companyName",
				"isNdaRequired",
				"expirationDate",
				"resourceIds",
				"accessLevel",
				"customerTrustAccountId"
			],
			"requiredProperties": [
				"email",
				"name",
				"companyName",
				"isNdaRequired",
				"accessLevel"
			]
		}
	},
	{
		"id": "ApproveTrustCenterAccessRequest",
		"group": "trust-centers",
		"command": "approve-trust-center-access-request",
		"method": "post",
		"path": "/trust-centers/{slugId}/access-requests/{accessRequestId}/approve",
		"summary": "Approve Trust Center access request",
		"risk": "write",
		"pathParams": [
			"slugId",
			"accessRequestId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"expirationDate",
				"isNdaRequired",
				"resourceIds",
				"accessLevel"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "BulkAddTagsToControls",
		"group": "trust-centers",
		"command": "bulk-add-tags-to-controls",
		"method": "post",
		"path": "/trust-centers/{slugId}/controls/tags",
		"summary": "Bulk add tags to Trust Center controls",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlIds",
				"tagCategory",
				"tags"
			],
			"requiredProperties": [
				"controlIds",
				"tagCategory",
				"tags"
			]
		}
	},
	{
		"id": "BulkRemoveTagsFromControls",
		"group": "trust-centers",
		"command": "bulk-remove-tags-from-controls",
		"method": "delete",
		"path": "/trust-centers/{slugId}/controls/tags",
		"summary": "Bulk remove tags from Trust Center controls",
		"risk": "destructive",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlIds",
				"tagCategory",
				"tags"
			],
			"requiredProperties": [
				"controlIds",
				"tagCategory",
				"tags"
			]
		}
	},
	{
		"id": "CreateComplianceFramework",
		"group": "trust-centers",
		"command": "create-compliance-framework",
		"method": "post",
		"path": "/trust-centers/{slugId}/compliance-frameworks",
		"summary": "Create Trust Center compliance framework",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"standard",
				"description"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "CreateTrustCenterFaq",
		"group": "trust-centers",
		"command": "create-trust-center-faq",
		"method": "post",
		"path": "/trust-centers/{slugId}/faqs",
		"summary": "Create Trust Center FAQ",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"question",
				"answer",
				"categoryId"
			],
			"requiredProperties": [
				"question",
				"answer"
			]
		}
	},
	{
		"id": "CreateTrustCenterResource",
		"group": "trust-centers",
		"command": "create-trust-center-resource",
		"method": "post",
		"path": "/trust-centers/{slugId}/resources",
		"summary": "Create Trust Center document",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "CreateTrustCenterSubprocessor",
		"group": "trust-centers",
		"command": "create-trust-center-subprocessor",
		"method": "post",
		"path": "/trust-centers/{slugId}/subprocessors",
		"summary": "Create Trust Center subprocessor",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"url",
				"description",
				"location",
				"purpose"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "CreateTrustCenterSubscriber",
		"group": "trust-centers",
		"command": "create-trust-center-subscriber",
		"method": "post",
		"path": "/trust-centers/{slugId}/subscribers",
		"summary": "Create Trust Center subscriber",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"email",
				"customerTrustAccountId",
				"shouldSkipEmailVerification"
			],
			"requiredProperties": [
				"email"
			]
		}
	},
	{
		"id": "CreateTrustCenterSubscriberGroup",
		"group": "trust-centers",
		"command": "create-trust-center-subscriber-group",
		"method": "post",
		"path": "/trust-centers/{slugId}/subscriber-groups",
		"summary": "Create Trust Center subscriber group",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"subscriberIds"
			],
			"requiredProperties": [
				"name",
				"subscriberIds"
			]
		}
	},
	{
		"id": "CreateTrustCenterUpdate",
		"group": "trust-centers",
		"command": "create-trust-center-update",
		"method": "post",
		"path": "/trust-centers/{slugId}/updates",
		"summary": "Create Trust Center update",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"description",
				"category",
				"visibilityType",
				"notifiedEmails",
				"notificationTarget",
				"subscriberGroupIds"
			],
			"requiredProperties": [
				"title",
				"description",
				"category"
			]
		}
	},
	{
		"id": "DeleteComplianceFramework",
		"group": "trust-centers",
		"command": "delete-compliance-framework",
		"method": "delete",
		"path": "/trust-centers/{slugId}/compliance-frameworks/{frameworkId}",
		"summary": "Delete Trust Center compliance framework",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"frameworkId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterControl",
		"group": "trust-centers",
		"command": "delete-trust-center-control",
		"method": "delete",
		"path": "/trust-centers/{slugId}/controls/{controlId}",
		"summary": "Delete Trust Center control",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"controlId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterControlCategory",
		"group": "trust-centers",
		"command": "delete-trust-center-control-category",
		"method": "delete",
		"path": "/trust-centers/{slugId}/control-categories/{categoryId}",
		"summary": "Delete Trust Center control category",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterFaq",
		"group": "trust-centers",
		"command": "delete-trust-center-faq",
		"method": "delete",
		"path": "/trust-centers/{slugId}/faqs/{faqId}",
		"summary": "Delete Trust Center FAQ",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"faqId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterFaqCategory",
		"group": "trust-centers",
		"command": "delete-trust-center-faq-category",
		"method": "delete",
		"path": "/trust-centers/{slugId}/faq-categories/{categoryId}",
		"summary": "Delete Trust Center FAQ category",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterResource",
		"group": "trust-centers",
		"command": "delete-trust-center-resource",
		"method": "delete",
		"path": "/trust-centers/{slugId}/resources/{resourceId}",
		"summary": "Delete Trust Center document",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"resourceId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterResourceCategory",
		"group": "trust-centers",
		"command": "delete-trust-center-resource-category",
		"method": "delete",
		"path": "/trust-centers/{slugId}/resource-categories/{categoryId}",
		"summary": "Delete Trust Center resource category",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterSubprocessor",
		"group": "trust-centers",
		"command": "delete-trust-center-subprocessor",
		"method": "delete",
		"path": "/trust-centers/{slugId}/subprocessors/{subprocessorId}",
		"summary": "Delete Trust Center subprocessor",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"subprocessorId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterSubscriber",
		"group": "trust-centers",
		"command": "delete-trust-center-subscriber",
		"method": "delete",
		"path": "/trust-centers/{slugId}/subscribers/{subscriberId}",
		"summary": "Delete Trust Center subscriber",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"subscriberId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterSubscriberGroup",
		"group": "trust-centers",
		"command": "delete-trust-center-subscriber-group",
		"method": "delete",
		"path": "/trust-centers/{slugId}/subscriber-groups/{subscriberGroupId}",
		"summary": "Delete Trust Center subscriber group",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"subscriberGroupId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteTrustCenterUpdate",
		"group": "trust-centers",
		"command": "delete-trust-center-update",
		"method": "delete",
		"path": "/trust-centers/{slugId}/updates/{updateId}",
		"summary": "Delete Trust Center update",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"updateId"
		],
		"queryParams": []
	},
	{
		"id": "DenyTrustCenterAccessRequest",
		"group": "trust-centers",
		"command": "deny-trust-center-access-request",
		"method": "post",
		"path": "/trust-centers/{slugId}/access-requests/{accessRequestId}/deny",
		"summary": "Deny Trust Center access request",
		"risk": "write",
		"pathParams": [
			"slugId",
			"accessRequestId"
		],
		"queryParams": [],
		"body": {
			"required": false,
			"properties": [
				"reason"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "GetChatbotConversationMessages",
		"group": "trust-centers",
		"command": "get-chatbot-conversation-messages",
		"method": "get",
		"path": "/trust-centers/{slugId}/chatbot/conversations/{conversationId}",
		"summary": "Get Trust Center chatbot conversation messages",
		"risk": "read",
		"pathParams": [
			"slugId",
			"conversationId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenter",
		"group": "trust-centers",
		"command": "get-trust-center",
		"method": "get",
		"path": "/trust-centers/{slugId}",
		"summary": "Get Trust Center",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterAccessRequest",
		"group": "trust-centers",
		"command": "get-trust-center-access-request",
		"method": "get",
		"path": "/trust-centers/{slugId}/access-requests/{accessRequestId}",
		"summary": "Get Trust Center access request",
		"risk": "read",
		"pathParams": [
			"slugId",
			"accessRequestId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterControl",
		"group": "trust-centers",
		"command": "get-trust-center-control",
		"method": "get",
		"path": "/trust-centers/{slugId}/controls/{controlId}",
		"summary": "Get Trust Center control",
		"risk": "read",
		"pathParams": [
			"slugId",
			"controlId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterControlCategories",
		"group": "trust-centers",
		"command": "get-trust-center-control-categories",
		"method": "get",
		"path": "/trust-centers/{slugId}/control-categories",
		"summary": "List Trust Center control categories",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterControlCategory",
		"group": "trust-centers",
		"command": "get-trust-center-control-category",
		"method": "get",
		"path": "/trust-centers/{slugId}/control-categories/{categoryId}",
		"summary": "Get Trust Center control category",
		"risk": "read",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterFaq",
		"group": "trust-centers",
		"command": "get-trust-center-faq",
		"method": "get",
		"path": "/trust-centers/{slugId}/faqs/{faqId}",
		"summary": "Get Trust Center FAQ",
		"risk": "read",
		"pathParams": [
			"slugId",
			"faqId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterResource",
		"group": "trust-centers",
		"command": "get-trust-center-resource",
		"method": "get",
		"path": "/trust-centers/{slugId}/resources/{resourceId}",
		"summary": "Get Trust Center document",
		"risk": "read",
		"pathParams": [
			"slugId",
			"resourceId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterResourceMedia",
		"group": "trust-centers",
		"command": "get-trust-center-resource-media",
		"method": "get",
		"path": "/trust-centers/{slugId}/resources/{resourceId}/media",
		"summary": "Get uploaded media for Trust Center document",
		"risk": "read",
		"pathParams": [
			"slugId",
			"resourceId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterSubprocessor",
		"group": "trust-centers",
		"command": "get-trust-center-subprocessor",
		"method": "get",
		"path": "/trust-centers/{slugId}/subprocessors/{subprocessorId}",
		"summary": "Get Trust Center subprocessor",
		"risk": "read",
		"pathParams": [
			"slugId",
			"subprocessorId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterSubscriber",
		"group": "trust-centers",
		"command": "get-trust-center-subscriber",
		"method": "get",
		"path": "/trust-centers/{slugId}/subscribers/{subscriberId}",
		"summary": "Get Trust Center subscriber",
		"risk": "read",
		"pathParams": [
			"slugId",
			"subscriberId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterSubscriberGroup",
		"group": "trust-centers",
		"command": "get-trust-center-subscriber-group",
		"method": "get",
		"path": "/trust-centers/{slugId}/subscriber-groups/{subscriberGroupId}",
		"summary": "Get Trust Center subscriber group",
		"risk": "read",
		"pathParams": [
			"slugId",
			"subscriberGroupId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterUpdate",
		"group": "trust-centers",
		"command": "get-trust-center-update",
		"method": "get",
		"path": "/trust-centers/{slugId}/updates/{updateId}",
		"summary": "Get Trust Center update",
		"risk": "read",
		"pathParams": [
			"slugId",
			"updateId"
		],
		"queryParams": []
	},
	{
		"id": "GetTrustCenterViewer",
		"group": "trust-centers",
		"command": "get-trust-center-viewer",
		"method": "get",
		"path": "/trust-centers/{slugId}/viewers/{viewerId}",
		"summary": "Get Trust Center viewer",
		"risk": "read",
		"pathParams": [
			"slugId",
			"viewerId"
		],
		"queryParams": []
	},
	{
		"id": "ListChatbotConversations",
		"group": "trust-centers",
		"command": "list-chatbot-conversations",
		"method": "get",
		"path": "/trust-centers/{slugId}/chatbot/conversations",
		"summary": "List Trust Center chatbot conversations",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "searchString",
				"description": "Search conversations by message content.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListComplianceFrameworks",
		"group": "trust-centers",
		"command": "list-compliance-frameworks",
		"method": "get",
		"path": "/trust-centers/{slugId}/compliance-frameworks",
		"summary": "List Trust Center compliance frameworks",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterAccessRequests",
		"group": "trust-centers",
		"command": "list-trust-center-access-requests",
		"method": "get",
		"path": "/trust-centers/{slugId}/access-requests",
		"summary": "List Trust Center access requests",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterActivityEvents",
		"group": "trust-centers",
		"command": "list-trust-center-activity-events",
		"method": "get",
		"path": "/trust-centers/{slugId}/activity",
		"summary": "List Trust Center viewer activity events",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "eventTypesMatchesAny",
				"description": "",
				"type": "array"
			},
			{
				"name": "afterDate",
				"description": "Only include activity events that occurred on or after the specified date and time.",
				"type": "string"
			},
			{
				"name": "beforeDate",
				"description": "Only include activity events that occurred before the specified date and time.",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterControls",
		"group": "trust-centers",
		"command": "list-trust-center-controls",
		"method": "get",
		"path": "/trust-centers/{slugId}/controls",
		"summary": "List Trust Center controls",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterDataCollected",
		"group": "trust-centers",
		"command": "list-trust-center-data-collected",
		"method": "get",
		"path": "/trust-centers/{slugId}/data-collected",
		"summary": "List Trust Center data collected",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterFaqCategories",
		"group": "trust-centers",
		"command": "list-trust-center-faq-categories",
		"method": "get",
		"path": "/trust-centers/{slugId}/faq-categories",
		"summary": "List Trust Center FAQ categories",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterFaqs",
		"group": "trust-centers",
		"command": "list-trust-center-faqs",
		"method": "get",
		"path": "/trust-centers/{slugId}/faqs",
		"summary": "List Trust Center FAQs",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterHistoricalAccessRequests",
		"group": "trust-centers",
		"command": "list-trust-center-historical-access-requests",
		"method": "get",
		"path": "/trust-centers/{slugId}/historical-access-requests",
		"summary": "List historical Trust Center access requests",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterResourceCategories",
		"group": "trust-centers",
		"command": "list-trust-center-resource-categories",
		"method": "get",
		"path": "/trust-centers/{slugId}/resource-categories",
		"summary": "List Trust Center resource categories",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterResources",
		"group": "trust-centers",
		"command": "list-trust-center-resources",
		"method": "get",
		"path": "/trust-centers/{slugId}/resources",
		"summary": "List Trust Center resources",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterSubprocessors",
		"group": "trust-centers",
		"command": "list-trust-center-subprocessors",
		"method": "get",
		"path": "/trust-centers/{slugId}/subprocessors",
		"summary": "List Trust Center subprocessors",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": []
	},
	{
		"id": "ListTrustCenterSubscriberGroups",
		"group": "trust-centers",
		"command": "list-trust-center-subscriber-groups",
		"method": "get",
		"path": "/trust-centers/{slugId}/subscriber-groups",
		"summary": "List Trust Center subscriber groups",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterSubscribers",
		"group": "trust-centers",
		"command": "list-trust-center-subscribers",
		"method": "get",
		"path": "/trust-centers/{slugId}/subscribers",
		"summary": "List Trust Center subscribers",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "customerTrustAccountId",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterUpdates",
		"group": "trust-centers",
		"command": "list-trust-center-updates",
		"method": "get",
		"path": "/trust-centers/{slugId}/updates",
		"summary": "List Trust Center updates",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListTrustCenterViewers",
		"group": "trust-centers",
		"command": "list-trust-center-viewers",
		"method": "get",
		"path": "/trust-centers/{slugId}/viewers",
		"summary": "List Trust Center viewers",
		"risk": "read",
		"pathParams": [
			"slugId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "includeRemoved",
				"description": "",
				"type": "boolean"
			}
		]
	},
	{
		"id": "RemoveTrustCenterViewer",
		"group": "trust-centers",
		"command": "remove-trust-center-viewer",
		"method": "delete",
		"path": "/trust-centers/{slugId}/viewers/{viewerId}",
		"summary": "Remove Trust Center viewer",
		"risk": "destructive",
		"pathParams": [
			"slugId",
			"viewerId"
		],
		"queryParams": []
	},
	{
		"id": "SendNotificationsToAllSubscribers",
		"group": "trust-centers",
		"command": "send-notifications-to-all-subscribers",
		"method": "post",
		"path": "/trust-centers/{slugId}/updates/{updateId}/notify-all-subscribers",
		"summary": "Send Trust Center update notifications to all subscribers",
		"risk": "write",
		"pathParams": [
			"slugId",
			"updateId"
		],
		"queryParams": []
	},
	{
		"id": "SendTrustCenterUpdateNotifications",
		"group": "trust-centers",
		"command": "send-trust-center-update-notifications",
		"method": "post",
		"path": "/trust-centers/{slugId}/updates/{updateId}/notify-specific-subscribers",
		"summary": "Send Trust Center update notifications to specific subscribers",
		"risk": "write",
		"pathParams": [
			"slugId",
			"updateId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"emails",
				"subscriberGroupIds",
				"customerTrustAccounts"
			],
			"requiredProperties": [
				"emails",
				"subscriberGroupIds"
			]
		}
	},
	{
		"id": "SendTrustCenterViewerInviteReminder",
		"group": "trust-centers",
		"command": "send-trust-center-viewer-invite-reminder",
		"method": "post",
		"path": "/trust-centers/{slugId}/viewers/{viewerId}/send-invite-reminder",
		"summary": "Send Trust Center viewer invite reminder",
		"risk": "write",
		"pathParams": [
			"slugId",
			"viewerId"
		],
		"queryParams": []
	},
	{
		"id": "UpdateComplianceFramework",
		"group": "trust-centers",
		"command": "update-compliance-framework",
		"method": "patch",
		"path": "/trust-centers/{slugId}/compliance-frameworks/{frameworkId}",
		"summary": "Update Trust Center compliance framework",
		"risk": "write",
		"pathParams": [
			"slugId",
			"frameworkId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"standard",
				"description"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateTrustCenter",
		"group": "trust-centers",
		"command": "update-trust-center",
		"method": "patch",
		"path": "/trust-centers/{slugId}",
		"summary": "Update Trust Center",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"companyDescription",
				"bannerSetting",
				"customTheme",
				"privacyPolicy",
				"awsMarketplaceListing",
				"isPublic",
				"contactEmail",
				"customHeading",
				"controlVisibilityMode"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateTrustCenterControlCategory",
		"group": "trust-centers",
		"command": "update-trust-center-control-category",
		"method": "patch",
		"path": "/trust-centers/{slugId}/control-categories/{categoryId}",
		"summary": "Update Trust Center control category",
		"risk": "write",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"visibility",
				"statusVisibilityOverride"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateTrustCenterControlsInCategory",
		"group": "trust-centers",
		"command": "update-trust-center-controls-in-category",
		"method": "patch",
		"path": "/trust-centers/{slugId}/control-categories/{categoryId}/controls",
		"summary": "Bulk edit controls in a category",
		"risk": "write",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"controlsToAdd",
				"controlsToRemove"
			],
			"requiredProperties": [
				"controlsToAdd",
				"controlsToRemove"
			]
		}
	},
	{
		"id": "UpdateTrustCenterFaq",
		"group": "trust-centers",
		"command": "update-trust-center-faq",
		"method": "patch",
		"path": "/trust-centers/{slugId}/faqs/{faqId}",
		"summary": "Update Trust Center FAQ",
		"risk": "write",
		"pathParams": [
			"slugId",
			"faqId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"question",
				"answer",
				"categoryId"
			],
			"requiredProperties": [
				"question",
				"answer"
			]
		}
	},
	{
		"id": "UpdateTrustCenterFaqCategory",
		"group": "trust-centers",
		"command": "update-trust-center-faq-category",
		"method": "patch",
		"path": "/trust-centers/{slugId}/faq-categories/{categoryId}",
		"summary": "Update Trust Center FAQ category",
		"risk": "write",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "UpdateTrustCenterResource",
		"group": "trust-centers",
		"command": "update-trust-center-resource",
		"method": "patch",
		"path": "/trust-centers/{slugId}/resources/{resourceId}",
		"summary": "Update Trust Center document",
		"risk": "write",
		"pathParams": [
			"slugId",
			"resourceId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"isPublic",
				"description"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateTrustCenterResourceCategory",
		"group": "trust-centers",
		"command": "update-trust-center-resource-category",
		"method": "patch",
		"path": "/trust-centers/{slugId}/resource-categories/{categoryId}",
		"summary": "Update Trust Center resource category",
		"risk": "write",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "UpdateTrustCenterSubprocessor",
		"group": "trust-centers",
		"command": "update-trust-center-subprocessor",
		"method": "patch",
		"path": "/trust-centers/{slugId}/subprocessors/{subprocessorId}",
		"summary": "Update Trust Center subprocessor",
		"risk": "write",
		"pathParams": [
			"slugId",
			"subprocessorId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"description",
				"location",
				"purpose"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateTrustCenterSubscriberGroup",
		"group": "trust-centers",
		"command": "update-trust-center-subscriber-group",
		"method": "patch",
		"path": "/trust-centers/{slugId}/subscriber-groups/{subscriberGroupId}",
		"summary": "Edit Trust Center subscriber group",
		"risk": "write",
		"pathParams": [
			"slugId",
			"subscriberGroupId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "UpdateTrustCenterUpdate",
		"group": "trust-centers",
		"command": "update-trust-center-update",
		"method": "patch",
		"path": "/trust-centers/{slugId}/updates/{updateId}",
		"summary": "Update Trust Center update",
		"risk": "write",
		"pathParams": [
			"slugId",
			"updateId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"title",
				"description",
				"category",
				"visibilityType"
			],
			"requiredProperties": [
				"title",
				"description",
				"category"
			]
		}
	},
	{
		"id": "UpdateTrustCenterViewer",
		"group": "trust-centers",
		"command": "update-trust-center-viewer",
		"method": "patch",
		"path": "/trust-centers/{slugId}/viewers/{viewerId}",
		"summary": "Update Trust Center viewer",
		"risk": "write",
		"pathParams": [
			"slugId",
			"viewerId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"accessLevel",
				"resourceIds",
				"expirationDate",
				"isNdaRequired",
				"customerTrustAccountId"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UploadComplianceFrameworkBadge",
		"group": "trust-centers",
		"command": "upload-compliance-framework-badge",
		"method": "post",
		"path": "/trust-centers/{slugId}/compliance-frameworks/{frameworkId}/badge",
		"summary": "Upload Trust Center compliance framework badge",
		"risk": "write",
		"pathParams": [
			"slugId",
			"frameworkId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "UploadTrustCenterFavicon",
		"group": "trust-centers",
		"command": "upload-trust-center-favicon",
		"method": "post",
		"path": "/trust-centers/{slugId}/favicon",
		"summary": "Upload Trust Center favicon",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "UpsertGroupsForTrustCenterSubscriber",
		"group": "trust-centers",
		"command": "upsert-groups-for-trust-center-subscriber",
		"method": "put",
		"path": "/trust-centers/{slugId}/subscribers/{subscriberId}/groups",
		"summary": "Set groups for a Trust Center subscriber",
		"risk": "write",
		"pathParams": [
			"slugId",
			"subscriberId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"groupIds"
			],
			"requiredProperties": [
				"groupIds"
			]
		}
	},
	{
		"id": "UpsertTrustCenterControlCategoriesOrder",
		"group": "trust-centers",
		"command": "upsert-trust-center-control-categories-order",
		"method": "put",
		"path": "/trust-centers/{slugId}/control-categories/order",
		"summary": "Reorder Trust Center control categories",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"orderedCategoryIds"
			],
			"requiredProperties": [
				"orderedCategoryIds"
			]
		}
	},
	{
		"id": "UpsertTrustCenterControlsInCategoryOrder",
		"group": "trust-centers",
		"command": "upsert-trust-center-controls-in-category-order",
		"method": "put",
		"path": "/trust-centers/{slugId}/control-categories/{categoryId}/controls/order",
		"summary": "Reorder controls in a Trust Center control category",
		"risk": "write",
		"pathParams": [
			"slugId",
			"categoryId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"orderedControlIds"
			],
			"requiredProperties": [
				"orderedControlIds"
			]
		}
	},
	{
		"id": "UpsertTrustCenterDataCollected",
		"group": "trust-centers",
		"command": "upsert-trust-center-data-collected",
		"method": "put",
		"path": "/trust-centers/{slugId}/data-collected",
		"summary": "Set Trust Center data collected",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"dataCollected",
				"dataCollectedHeading"
			],
			"requiredProperties": [
				"dataCollected"
			]
		}
	},
	{
		"id": "UpsertTrustCenterResourceCategoriesOrder",
		"group": "trust-centers",
		"command": "upsert-trust-center-resource-categories-order",
		"method": "put",
		"path": "/trust-centers/{slugId}/resource-categories/order",
		"summary": "Reorder Trust Center resource categories",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"categoryIds"
			],
			"requiredProperties": [
				"categoryIds"
			]
		}
	},
	{
		"id": "UpsertTrustCenterVideos",
		"group": "trust-centers",
		"command": "upsert-trust-center-videos",
		"method": "put",
		"path": "/trust-centers/{slugId}/videos",
		"summary": "Set Trust Center videos",
		"risk": "write",
		"pathParams": [
			"slugId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"videos"
			],
			"requiredProperties": [
				"videos"
			]
		}
	},
	{
		"id": "get-UserAccount",
		"group": "user-accounts",
		"command": "get-user-account",
		"method": "get",
		"path": "/resources/user_account",
		"summary": "List all user accounts",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-UserAccount",
		"group": "user-accounts",
		"command": "put-user-account",
		"method": "put",
		"path": "/resources/user_account",
		"summary": "Sync all user accounts",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "get-UserSecurityTrainingStatus",
		"group": "user-security-training-statuses",
		"command": "get-user-security-training-status",
		"method": "get",
		"path": "/resources/user_security_training_status",
		"summary": "List all user security training statuses",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-UserSecurityTrainingStatus",
		"group": "user-security-training-statuses",
		"command": "put-user-security-training-status",
		"method": "put",
		"path": "/resources/user_security_training_status",
		"summary": "Sync all user security training statuses",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "GetUser",
		"group": "users",
		"command": "get-user",
		"method": "get",
		"path": "/users/{userId}",
		"summary": "Get user by ID",
		"risk": "read",
		"pathParams": [
			"userId"
		],
		"queryParams": []
	},
	{
		"id": "ListUsers",
		"group": "users",
		"command": "list-users",
		"method": "get",
		"path": "/users",
		"summary": "List active users",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "GetVendorAssessmentTypeById",
		"group": "vendor-assessment-types",
		"command": "get-vendor-assessment-type-by-id",
		"method": "get",
		"path": "/vendor-assessment-types/{assessmentTypeId}",
		"summary": "Get assessment type by ID",
		"risk": "read",
		"pathParams": [
			"assessmentTypeId"
		],
		"queryParams": []
	},
	{
		"id": "ListVendorAssessmentTypes",
		"group": "vendor-assessment-types",
		"command": "list-vendor-assessment-types",
		"method": "get",
		"path": "/vendor-assessment-types",
		"summary": "List assessment types",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "status",
				"description": "Filter assessment types to a single lifecycle status",
				"type": "string"
			}
		]
	},
	{
		"id": "ListVendorRiskAttributes",
		"group": "vendor-risk-attributes",
		"command": "list-vendor-risk-attributes",
		"method": "get",
		"path": "/vendor-risk-attributes",
		"summary": "List vendor risk attributes",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "CreateVendor",
		"group": "vendors",
		"command": "create-vendor",
		"method": "post",
		"path": "/vendors",
		"summary": "Create a vendor",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"websiteUrl",
				"accountManagerName",
				"accountManagerEmail",
				"securityOwnerUserId",
				"servicesProvided",
				"additionalNotes",
				"businessOwnerUserId",
				"contractStartDate",
				"contractRenewalDate",
				"contractTerminationDate",
				"isVisibleToAuditors",
				"authDetails",
				"status",
				"category",
				"inherentRiskLevel",
				"residualRiskLevel",
				"vendorHeadquarters",
				"contractAmount",
				"customFields",
				"frameworkScope"
			],
			"requiredProperties": [
				"name"
			]
		}
	},
	{
		"id": "CreateVendorFinding",
		"group": "vendors",
		"command": "create-vendor-finding",
		"method": "post",
		"path": "/vendors/{vendorId}/findings",
		"summary": "Add a vendor finding",
		"risk": "write",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"content",
				"riskStatus",
				"remediation",
				"securityReviewId",
				"documentId"
			],
			"requiredProperties": [
				"content",
				"riskStatus"
			]
		}
	},
	{
		"id": "DeleteById",
		"group": "vendors",
		"command": "delete-by-id",
		"method": "delete",
		"path": "/vendors/{vendorId}",
		"summary": "Delete vendor by ID",
		"risk": "destructive",
		"pathParams": [
			"vendorId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteFindingById",
		"group": "vendors",
		"command": "delete-finding-by-id",
		"method": "delete",
		"path": "/vendors/{vendorId}/findings/{findingId}",
		"summary": "Delete finding by ID",
		"risk": "destructive",
		"pathParams": [
			"vendorId",
			"findingId"
		],
		"queryParams": []
	},
	{
		"id": "DeleteSecurityReviewDocumentById",
		"group": "vendors",
		"command": "delete-security-review-document-by-id",
		"method": "delete",
		"path": "/vendors/{vendorId}/security-reviews/{securityReviewId}/documents/{documentId}",
		"summary": "Delete a security review document by ID",
		"risk": "destructive",
		"pathParams": [
			"vendorId",
			"securityReviewId",
			"documentId"
		],
		"queryParams": []
	},
	{
		"id": "GetAssessmentById",
		"group": "vendors",
		"command": "get-assessment-by-id",
		"method": "get",
		"path": "/vendors/{vendorId}/assessments/{assessmentId}",
		"summary": "Get assessment by ID",
		"risk": "read",
		"pathParams": [
			"vendorId",
			"assessmentId"
		],
		"queryParams": []
	},
	{
		"id": "GetAssessmentsByVendorId",
		"group": "vendors",
		"command": "get-assessments-by-vendor-id",
		"method": "get",
		"path": "/vendors/{vendorId}/assessments",
		"summary": "List assessments by vendor ID",
		"risk": "read",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "typeIdMatchesAny",
				"description": "Filter assessments to any of the given assessment type IDs",
				"type": "array"
			},
			{
				"name": "statusMatchesAny",
				"description": "Filter assessments to any of the given statuses",
				"type": "array"
			}
		]
	},
	{
		"id": "GetSecurityReviewDocuments",
		"group": "vendors",
		"command": "get-security-review-documents",
		"method": "get",
		"path": "/vendors/{vendorId}/security-reviews/{securityReviewId}/documents",
		"summary": "List security review documents",
		"risk": "read",
		"pathParams": [
			"vendorId",
			"securityReviewId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "GetSecurityReviewsById",
		"group": "vendors",
		"command": "get-security-reviews-by-id",
		"method": "get",
		"path": "/vendors/{vendorId}/security-reviews/{securityReviewId}",
		"summary": "Get security review by ID",
		"risk": "read",
		"pathParams": [
			"vendorId",
			"securityReviewId"
		],
		"queryParams": []
	},
	{
		"id": "GetSecurityReviewsByVendorId",
		"group": "vendors",
		"command": "get-security-reviews-by-vendor-id",
		"method": "get",
		"path": "/vendors/{vendorId}/security-reviews",
		"summary": "List security reviews by vendor ID",
		"risk": "read",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "GetVendor",
		"group": "vendors",
		"command": "get-vendor",
		"method": "get",
		"path": "/vendors/{vendorId}",
		"summary": "Get vendor by ID",
		"risk": "read",
		"pathParams": [
			"vendorId"
		],
		"queryParams": []
	},
	{
		"id": "ListVendorDocuments",
		"group": "vendors",
		"command": "list-vendor-documents",
		"method": "get",
		"path": "/vendors/{vendorId}/documents",
		"summary": "List vendor documents",
		"risk": "read",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			}
		]
	},
	{
		"id": "ListVendorFindings",
		"group": "vendors",
		"command": "list-vendor-findings",
		"method": "get",
		"path": "/vendors/{vendorId}/findings",
		"summary": "List vendor findings",
		"risk": "read",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "securityReviewId",
				"description": "Filter findings by security review ID",
				"type": "string"
			},
			{
				"name": "documentId",
				"description": "Filter findings by document ID",
				"type": "string"
			}
		]
	},
	{
		"id": "ListVendors",
		"group": "vendors",
		"command": "list-vendors",
		"method": "get",
		"path": "/vendors",
		"summary": "List vendors",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "name",
				"description": "Filter vendors by name (case-insensitive, partial match)",
				"type": "string"
			},
			{
				"name": "statusMatchesAny",
				"description": "Filter vendors by status (can specify multiple)",
				"type": "array"
			}
		]
	},
	{
		"id": "SetStatusForVendor",
		"group": "vendors",
		"command": "set-status-for-vendor",
		"method": "post",
		"path": "/vendors/{vendorId}/set-status",
		"summary": "Set vendor status",
		"risk": "write",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateVendor",
		"group": "vendors",
		"command": "update-vendor",
		"method": "patch",
		"path": "/vendors/{vendorId}",
		"summary": "Update vendor by ID",
		"risk": "write",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"name",
				"websiteUrl",
				"accountManagerName",
				"accountManagerEmail",
				"securityOwnerUserId",
				"servicesProvided",
				"additionalNotes",
				"businessOwnerUserId",
				"contractStartDate",
				"contractRenewalDate",
				"contractTerminationDate",
				"isVisibleToAuditors",
				"authDetails",
				"status",
				"category",
				"inherentRiskLevel",
				"residualRiskLevel",
				"riskAttributeIds",
				"vendorHeadquarters",
				"contractAmount",
				"customFields",
				"frameworkScope"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UpdateVendorFinding",
		"group": "vendors",
		"command": "update-vendor-finding",
		"method": "patch",
		"path": "/vendors/{vendorId}/findings/{findingId}",
		"summary": "Update vendor finding",
		"risk": "write",
		"pathParams": [
			"vendorId",
			"findingId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"content",
				"riskStatus",
				"remediation"
			],
			"requiredProperties": []
		}
	},
	{
		"id": "UploadDocumentForSecurityReview",
		"group": "vendors",
		"command": "upload-document-for-security-review",
		"method": "post",
		"path": "/vendors/{vendorId}/security-reviews/{securityReviewId}/documents",
		"summary": "Add document to security review",
		"risk": "write",
		"pathParams": [
			"vendorId",
			"securityReviewId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "UploadDocumentToVendor",
		"group": "vendors",
		"command": "upload-document-to-vendor",
		"method": "post",
		"path": "/vendors/{vendorId}/documents",
		"summary": "Add document to a vendor",
		"risk": "write",
		"pathParams": [
			"vendorId"
		],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [],
			"requiredProperties": []
		}
	},
	{
		"id": "DeactivateVulnerabilities",
		"group": "vulnerabilities",
		"command": "deactivate-vulnerabilities",
		"method": "post",
		"path": "/vulnerabilities/deactivate",
		"summary": "Deactivate vulnerability monitoring for a vulnerability",
		"risk": "destructive",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "GetVulnerability",
		"group": "vulnerabilities",
		"command": "get-vulnerability",
		"method": "get",
		"path": "/vulnerabilities/{vulnerabilityId}",
		"summary": "Get vulnerability by ID",
		"risk": "read",
		"pathParams": [
			"vulnerabilityId"
		],
		"queryParams": []
	},
	{
		"id": "ListVulnerabilities",
		"group": "vulnerabilities",
		"command": "list-vulnerabilities",
		"method": "get",
		"path": "/vulnerabilities",
		"summary": "Get vulnerabilities",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "isDeactivated",
				"description": "Filter vulnerabilities by deactivation status.",
				"type": "boolean"
			},
			{
				"name": "externalVulnerabilityId",
				"description": "Filter vulnerabilities based on a specific external ID.",
				"type": "string"
			},
			{
				"name": "isFixAvailable",
				"description": "Filter vulnerabilities that have an available fix.",
				"type": "boolean"
			},
			{
				"name": "packageIdentifier",
				"description": "Filter vulnerabilities that are from a specific package.",
				"type": "string"
			},
			{
				"name": "slaDeadlineAfterDate",
				"description": "Filter vulnerabilities with a fix due after a specific timestamp.",
				"type": "string"
			},
			{
				"name": "slaDeadlineBeforeDate",
				"description": "Filter vulnerabilities with a fix due before a specific timestamp.",
				"type": "string"
			},
			{
				"name": "severity",
				"description": "Filter vulnerabilities by severity. Possible values: CRITICAL, HIGH, MEDIUM, LOW.",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerabilities by the vulnerability scanner that detected them.",
				"type": "string"
			},
			{
				"name": "includeVulnerabilitiesWithoutSlas",
				"description": "Filter vulnerabilities without an SLA due date.",
				"type": "boolean"
			},
			{
				"name": "vulnerableAssetId",
				"description": "Filter vulnerabilities by a specific asset ID.",
				"type": "string"
			},
			{
				"name": "q",
				"description": "Full-text filter on the vulnerability's name and description.",
				"type": "string"
			}
		]
	},
	{
		"id": "ReactivateVulnerabilities",
		"group": "vulnerabilities",
		"command": "reactivate-vulnerabilities",
		"method": "post",
		"path": "/vulnerabilities/reactivate",
		"summary": "Reactivate vulnerability monitoring",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "AcknowledgeSlaMissVulnerabilityRemediations",
		"group": "vulnerability-remediations",
		"command": "acknowledge-sla-miss-vulnerability-remediations",
		"method": "post",
		"path": "/vulnerability-remediations/acknowledge-sla-miss",
		"summary": "Acknowledge SLA miss",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"updates"
			],
			"requiredProperties": [
				"updates"
			]
		}
	},
	{
		"id": "ListVulnerabilityRemediations",
		"group": "vulnerability-remediations",
		"command": "list-vulnerability-remediations",
		"method": "get",
		"path": "/vulnerability-remediations",
		"summary": "List vulnerability remediations",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerability remediations based on a specific scanner integration.",
				"type": "string"
			},
			{
				"name": "severity",
				"description": "Filter vulnerability remediations by severity. Possible values: CRITICAL, HIGH, MEDIUM, LOW.",
				"type": "string"
			},
			{
				"name": "isRemediatedOnTime",
				"description": "Filter vulnerability remediations by remediation status.",
				"type": "boolean"
			},
			{
				"name": "remediatedAfterDate",
				"description": "Filter vulnerability remediations that occurred after a specific timestamp.",
				"type": "string"
			},
			{
				"name": "remediatedBeforeDate",
				"description": "Filter vulnerability remediations that occurred before a specific timestamp.",
				"type": "string"
			}
		]
	},
	{
		"id": "GetVulnerableAsset",
		"group": "vulnerable-assets",
		"command": "get-vulnerable-asset",
		"method": "get",
		"path": "/vulnerable-assets/{vulnerableAssetId}",
		"summary": "Get vulnerable asset by ID",
		"risk": "read",
		"pathParams": [
			"vulnerableAssetId"
		],
		"queryParams": []
	},
	{
		"id": "ListVulnerableAssets",
		"group": "vulnerable-assets",
		"command": "list-vulnerable-assets",
		"method": "get",
		"path": "/vulnerable-assets",
		"summary": "List assets associated with vulnerabilities",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "q",
				"description": "Filter vulnerable assets by search query.",
				"type": "string"
			},
			{
				"name": "pageSize",
				"description": "",
				"type": "string"
			},
			{
				"name": "pageCursor",
				"description": "",
				"type": "string"
			},
			{
				"name": "integrationId",
				"description": "Filter vulnerable assets by specific vulnerability scanner.",
				"type": "string"
			},
			{
				"name": "assetType",
				"description": "Filter vulnerable assets by asset type. Possible values: CODE_REPOSITORY, CONTAINER_REPOSITORY, CONTAINER_REPOSITORY_IMA",
				"type": "string"
			},
			{
				"name": "assetExternalAccountId",
				"description": "Filter vulnerable assets by...",
				"type": "string"
			}
		]
	},
	{
		"id": "get-VulnerableComponent",
		"group": "vulnerable-components",
		"command": "get-vulnerable-component",
		"method": "get",
		"path": "/resources/vulnerable_component",
		"summary": "List all Vulnerable Components",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-VulnerableComponent",
		"group": "vulnerable-components",
		"command": "put-vulnerable-component",
		"method": "put",
		"path": "/resources/vulnerable_component",
		"summary": "Sync all Vulnerable Components",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	},
	{
		"id": "get-WindowsUserComputer",
		"group": "windows-user-computers",
		"command": "get-windows-user-computer",
		"method": "get",
		"path": "/resources/windows_user_computer",
		"summary": "List all Windows User Computers",
		"risk": "read",
		"pathParams": [],
		"queryParams": [
			{
				"name": "resourceId",
				"description": "Vanta generated identifier for the given resource, and can be found on the developer console page. See the list of regis",
				"type": "string"
			}
		]
	},
	{
		"id": "put-WindowsUserComputer",
		"group": "windows-user-computers",
		"command": "put-windows-user-computer",
		"method": "put",
		"path": "/resources/windows_user_computer",
		"summary": "Sync all Windows User Computers",
		"risk": "write",
		"pathParams": [],
		"queryParams": [],
		"body": {
			"required": true,
			"properties": [
				"resourceId",
				"resources"
			],
			"requiredProperties": [
				"resourceId",
				"resources"
			]
		}
	}
] as const;
