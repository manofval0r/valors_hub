export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

/**
 * Builds a Cloudinary delivery URL from a public ID.
 * If the input is already an absolute URL, it is returned as-is.
 */
export function getCloudinaryVideoUrl(
  videoPublicId?: string,
  options: { transformation?: string } = {},
): string | undefined {
  if (!videoPublicId) return undefined;

  if (/^https?:\/\//i.test(videoPublicId)) {
    return videoPublicId;
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    return undefined;
  }

  const normalizedPublicId = videoPublicId.replace(/^\/+/, '');
  const transformation = options.transformation || 'f_auto,q_auto';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformation}/${normalizedPublicId}`;
}

/**
 * Resolves the final video source with priority:
 * 1) Cloudinary public ID (preferred)
 * 2) Explicit URL fallback
 */
export function resolveVideoSource(params: {
  videoPublicId?: string;
  videoUrl?: string;
}): string | undefined {
  return getCloudinaryVideoUrl(params.videoPublicId) || params.videoUrl;
}
