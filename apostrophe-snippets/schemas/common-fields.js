// @title Common Fields Schema Example
// @description Reusable field definitions for content types

module.exports = {
  meta: {
    type: 'object',
    label: 'Meta Information',
    fields: {
      add: {
        metaTitle: {
          type: 'string',
          label: 'Meta Title',
          help: 'Used for SEO. Will default to regular title if empty.'
        },
        metaDescription: {
          type: 'string',
          label: 'Meta Description',
          textarea: true,
          help: 'Brief description for search engines'
        },
        ogImage: {
          type: 'area',
          label: 'Social Share Image',
          options: {
            max: 1,
            widgets: {
              '@apostrophecms/image': {}
            }
          }
        }
      }
    }
  },
  timestamps: {
    type: 'object',
    fields: {
      add: {
        createdAt: {
          type: 'date',
          label: 'Created At'
        },
        updatedAt: {
          type: 'date',
          label: 'Last Updated'
        }
      }
    }
  }
};
