/**
 * Cursor-based pagination helpers for the Vanta API.
 * All list endpoints return: { results: { data: T[], pageInfo: { endCursor, hasNextPage } } }
 */

import { vantaFetch } from "../client.js";
import { getPageSize } from "../output.js";

interface PageInfo {
	endCursor: string | null;
	hasNextPage: boolean;
}

interface PaginatedResponse<T> {
	results: {
		data: T[];
		pageInfo: PageInfo;
	};
}

export interface PaginateOptions {
	pageSize?: number;
	limit?: number;
}

const MAX_PAGES = 500; // Safety limit to prevent infinite pagination

export async function fetchAllPages<T>(
	endpoint: string,
	params?: Record<string, string>,
	options?: PaginateOptions,
): Promise<T[]> {
	const pageSize = options?.pageSize ?? getPageSize();
	const limit = options?.limit;
	const allItems: T[] = [];
	let cursor: string | undefined;
	let pageCount = 0;

	do {
		pageCount++;
		if (pageCount > MAX_PAGES) {
			throw new Error(
				`Pagination safety limit reached (${MAX_PAGES} pages) for ${endpoint}. ` +
					`Collected ${allItems.length} items so far.`,
			);
		}

		const queryParams = new URLSearchParams({
			...params,
			pageSize: String(pageSize),
		});
		if (cursor) queryParams.set("pageCursor", cursor);

		const data = await vantaFetch<PaginatedResponse<T>>(`${endpoint}?${queryParams.toString()}`);

		if (!data?.results?.data) {
			throw new Error(
				`Unexpected response shape from ${endpoint}: missing results.data. ` +
					`Response keys: ${Object.keys(data ?? {}).join(", ")}`,
			);
		}

		allItems.push(...data.results.data);

		if (limit && allItems.length >= limit) {
			return allItems.slice(0, limit);
		}

		if (!data.results.pageInfo) {
			throw new Error(
				`Unexpected response shape from ${endpoint}: missing results.pageInfo. ` +
					`Response had ${data.results.data.length} items but no pagination metadata.`,
			);
		}

		const nextCursor = data.results.pageInfo.hasNextPage ? (data.results.pageInfo.endCursor ?? undefined) : undefined;

		if (nextCursor && nextCursor === cursor) {
			throw new Error(
				`Pagination cursor did not advance for ${endpoint} (stuck at cursor: ${nextCursor}). ` +
					`Collected ${allItems.length} items before stopping.`,
			);
		}

		cursor = nextCursor;
	} while (cursor);

	return allItems;
}

export async function fetchSinglePage<T>(
	endpoint: string,
	params?: Record<string, string>,
	options?: { pageSize?: number; pageCursor?: string },
): Promise<{ data: T[]; pageInfo: PageInfo }> {
	const queryParams = new URLSearchParams({
		...params,
		pageSize: String(options?.pageSize ?? getPageSize()),
	});
	if (options?.pageCursor) queryParams.set("pageCursor", options.pageCursor);

	const response = await vantaFetch<PaginatedResponse<T>>(`${endpoint}?${queryParams.toString()}`);

	if (!response?.results?.data) {
		throw new Error(`Unexpected response shape from ${endpoint}: missing results.data.`);
	}

	return response.results;
}
