/**
 * Translation API Service
 * Handles communication with the backend translation API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Represents a single translated item from the API
 */
export interface TranslationItem {
    original_word: string;
    matched_word?: string | null;
    processed_word?: string; // Kept for backward compatibility
    type: 'video' | 'fingerspell' | 'skipped';
    url: string | null;
    letters: string[] | null;
    similarity?: number | null;
}

/**
 * Translation statistics
 */
export interface TranslationStats {
    video_count: number;
    fingerspell_count: number;
    skipped_count: number;
    total: number;
}

/**
 * Full translation response from the API
 */
export interface TranslationResponse {
    success: boolean;
    original_text: string;
    translations: TranslationItem[];
    stats: TranslationStats;
}

/**
 * Health check response
 */
export interface HealthResponse {
    status: string;
    version: string;
    available_words: number;
}

/**
 * API error class for handling backend errors
 */
export class TranslationApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'TranslationApiError';
    }
}

/**
 * Get the full URL for a sign video
 */
export function getSignVideoUrl(relativePath: string): string {
    // Remove leading slash if present
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Translate text to sign language video references
 * @param text - The text to translate
 * @returns Translation response with video URLs and fingerspelling info
 */
export async function translateText(text: string): Promise<TranslationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new TranslationApiError(
            errorData.detail || 'Translation failed',
            response.status,
            errorData
        );
    }

    return response.json();
}

/**
 * Check if the translation API is healthy
 * @returns Health check response
 */
export async function checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);

    if (!response.ok) {
        throw new TranslationApiError('Health check failed', response.status);
    }

    return response.json();
}

/**
 * Check if the API is available
 * @returns true if API is reachable
 */
export async function isApiAvailable(): Promise<boolean> {
    try {
        await checkHealth();
        return true;
    } catch {
        return false;
    }
}
