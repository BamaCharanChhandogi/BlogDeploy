// src/platforms/devto/client.ts
const DEVTO_ENDPOINT = "https://dev.to/api/articles";

export async function postToDevto(
	apiKey: string,
	title: string,
	bodyMarkdown: string,
	tags: string[] = [],
	coverImageURL?: string,
) {
	const article: any = {
		title,
		body_markdown: bodyMarkdown,
		published: true,
		tags,
	};
	if (coverImageURL) {
		article.main_image = coverImageURL;
	}
	
	const res = await fetch(DEVTO_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
			"User-Agent": "MyApp/1.0"
		},
		body: JSON.stringify({ article }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`DEV.to publish failed: ${res.status} ${errorText}`);
	}

	const data = await res.json();
	return data; // contains id, url, slug etc
}

