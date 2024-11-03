import { ISocialPost } from "@/domain/interfaces/ISocialPost";

export class ThreadsService {
    private readonly THREADS_API_URL = "https://graph.threads.net/v1.0";
    private readonly userId: string;
    private readonly accessToken: string;

    constructor(userId: string, accessToken: string) {
        this.userId = userId;
        this.accessToken = accessToken;
    }

    async post(post: ISocialPost): Promise<{ success: boolean; error?: string }> {
        try {
            // Step 1: Create the media container
            const containerResponse = await fetch(
                `${this.THREADS_API_URL}/${this.userId}/threads`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: post.content,
                        media_type: "TEXT", // Adding the required media_type parameter
                        access_token: this.accessToken,
                    }),
                }
            );

            if (!containerResponse.ok) {
                const error = await containerResponse.json();
                throw new Error(
                    error.error?.message || "Failed to create Threads container"
                );
            }

            const { id: containerId } = await containerResponse.json();

            // Step 2: Publish the container
            const publishResponse = await fetch(
                `${this.THREADS_API_URL}/${this.userId}/threads_publish`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        creation_id: containerId,
                        access_token: this.accessToken,
                    }),
                }
            );

            if (!publishResponse.ok) {
                const error = await publishResponse.json();
                throw new Error(error.error?.message || "Failed to publish to Threads");
            }

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: "Failed to post to Threads",
                details: error.message,
            };
        }
    }
}
