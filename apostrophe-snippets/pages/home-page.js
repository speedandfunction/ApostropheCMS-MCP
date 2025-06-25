// @title Home Page Example
// @description Configuration for the home page type

module.exports = {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Home Page'
  },
  fields: {
    add: {
      hero: {
        type: 'area',
        label: 'Hero Section',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {}
          }
        }
      },
      main: {
        type: 'area',
        label: 'Main Content',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {},
            '@apostrophecms/video': {},
            'basic-widget': {},
            'rich-text-widget': {},
            'image-widget': {}
          }
        }
      },
      featuredArticles: {
        type: 'relationship',
        label: 'Featured Articles',
        withType: 'article-piece',
        max: 3
      }
    },
    group: {
      hero: {
        label: 'Hero',
        fields: ['hero']
      },
      content: {
        label: 'Page Content',
        fields: ['main', 'featuredArticles']
      }
    }
  }
};
