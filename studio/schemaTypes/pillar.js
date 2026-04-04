import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pillar',
  type: 'document',
  title: 'Pillar',
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
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon (Lucide name)',
      description: 'Name of a Lucide icon (e.g. Heart, Cog, Sun, Users, BookOpen, Shield)',
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'Color',
      description: 'Hex color code (e.g. #E57373)',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Display Order',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
