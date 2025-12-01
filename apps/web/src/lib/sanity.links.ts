export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    case 'post':
      return slug ? `/blog/${slug}` : undefined
    case 'product':
      return slug ? `/products/${slug}` : undefined
    case 'course':
      return slug ? `/courses/${slug}` : undefined
    case 'collection':
      return slug ? `/collections/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

