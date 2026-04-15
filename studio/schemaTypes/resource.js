import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resource',
  type: 'document',
  title: 'Resource',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pillar',
      type: 'reference',
      title: 'Pillar',
      to: [{type: 'pillar'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      type: 'string',
      title: 'Content Type',
      options: {
        list: [
          {title: 'Article', value: 'article'},
          {title: 'Video', value: 'video'},
          {title: 'External Link', value: 'externalLink'},
          {title: 'Resource Listing', value: 'listing'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorialSummary',
      type: 'text',
      title: 'Editorial Summary',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail Image',
      description: 'Upload an image (preferred). If not set, the Thumbnail URL below will be used as fallback.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'thumbnailUrl',
      type: 'url',
      title: 'Thumbnail URL (fallback)',
      description: 'External image URL. Only used if no uploaded image above.',
    }),
    defineField({
      name: 'externalUrl',
      type: 'url',
      title: 'External URL',
      hidden: ({document}) => document?.contentType !== 'externalLink',
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'YouTube Video URL',
      hidden: ({document}) => document?.contentType !== 'video',
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Source / Organization',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pillar.title',
      contentType: 'contentType',
      media: 'thumbnail',
    },
    prepare({title, subtitle, contentType, media}) {
      return {
        title,
        subtitle: `${subtitle || ''} · ${contentType || ''}`,
        media,
      }
    },
  },
})
