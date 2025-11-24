import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from 'lib/sanity.api'
import type { Image } from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  // Check for both _ref (reference) and _id (dereferenced asset)
  if (!source?.asset) {
    return undefined
  }

  // If asset is already dereferenced (has _id), use it directly
  // Otherwise, check for _ref
  if (!source.asset._ref && !source.asset._id) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}
