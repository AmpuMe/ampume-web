// Sanity data fetching - proxied through /api/sanity serverless function

async function sanityFetch(query, params = {}) {
  const response = await fetch('/api/sanity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  });

  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }

  const json = await response.json();
  return json.result;
}

// GROQ Queries

export const PILLARS_QUERY = `
  *[_type == "pillar"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    order,
    color,
    "resourceCount": count(*[_type == "resource" && references(^._id)])
  }
`;

export const PILLAR_WITH_RESOURCES_QUERY = `
  *[_type == "pillar" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    "resources": *[_type == "resource" && references(^._id)] | order(featured desc, publishedAt desc) {
      _id,
      title,
      slug,
      contentType,
      editorialSummary,
      externalUrl,
      videoUrl,
      "thumbnailImage": thumbnail.asset->url,
      thumbnailUrl,
      source,
      featured,
      tags
    }
  }
`;

export const FEATURED_RESOURCES_QUERY = `
  *[_type == "resource" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    contentType,
    editorialSummary,
    externalUrl,
    "thumbnailImage": thumbnail.asset->url,
    thumbnailUrl,
    source,
    featured,
    tags,
    "pillar": pillar->{ title, slug }
  }
`;

export const RESOURCE_DETAIL_QUERY = `
  *[_type == "resource" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    editorialSummary,
    externalUrl,
    videoUrl,
    "thumbnailImage": thumbnail.asset->url,
    thumbnailUrl,
    body,
    source,
    featured,
    tags,
    publishedAt,
    "pillar": pillar->{ title, slug }
  }
`;

// Helper functions

export async function fetchPillars() {
  return sanityFetch(PILLARS_QUERY);
}

export async function fetchPillarWithResources(slug) {
  return sanityFetch(PILLAR_WITH_RESOURCES_QUERY, { slug });
}

export async function fetchFeaturedResources() {
  return sanityFetch(FEATURED_RESOURCES_QUERY);
}

export async function fetchResourceDetail(slug) {
  return sanityFetch(RESOURCE_DETAIL_QUERY, { slug });
}

// Get the best available thumbnail: uploaded Sanity image > external URL > null
export function getThumbnailUrl(resource) {
  return resource?.thumbnailImage || resource?.thumbnailUrl || null;
}

// Extract YouTube embed URL from various YouTube URL formats
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
