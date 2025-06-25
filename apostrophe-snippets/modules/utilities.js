// @title Utilities Module Example
// @description Common utility functions and helpers

module.exports = {
  options: {
    alias: 'utils'
  },
  init(self) {
    self.addHelpers({
      formatDate(date) {
        return date ? new Date(date).toLocaleDateString() : '';
      },
      truncate(str, length) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
      },
      slugify(text) {
        return text
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
      }
    });
  },
  methods(self) {
    return {
      async generateThumbnail(attachment) {
        // Example thumbnail generation logic
        return {
          url: attachment._url,
          width: 200,
          height: 200
        };
      },
      getFullName(person) {
        return `${person.firstName} ${person.lastName}`;
      }
    };
  }
};
