// @title Article Page Example
// @description Configuration for the article listing page type

module.exports = {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Article Index Page'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Page Heading',
        required: true
      },
      description: {
        type: 'area',
        label: 'Page Description',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          }
        }
      }
    }
  },
  components: {
    async articles(req) {
      return await self.apos.article.find(req)
        .sort({ publishDate: -1 })
        .limit(10)
        .toArray();
    }
  }
};
