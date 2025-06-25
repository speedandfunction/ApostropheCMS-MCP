// @title Article Piece Example
// @description A content type for blog articles or news posts

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Article',
    pluralLabel: 'Articles'
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Article Title',
        required: true
      },
      content: {
        type: 'area',
        label: 'Article Content',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {},
            '@apostrophecms/video': {}
          }
        }
      },
      publishDate: {
        type: 'date',
        label: 'Publish Date'
      },
      author: {
        type: 'relationship',
        label: 'Author',
        withType: 'person-piece'
      }
    },
    group: {
      basics: {
        label: 'Basic Information',
        fields: ['title', 'author', 'publishDate']
      },
      content: {
        label: 'Article Content',
        fields: ['content']
      }
    }
  }
};
