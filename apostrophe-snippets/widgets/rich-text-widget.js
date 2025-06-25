// @title Rich Text Widget Example
// @description A rich text editor widget with formatting options

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Rich Text Widget'
  },
  fields: {
    add: {
      content: {
        type: 'area',
        label: 'Rich Text Content',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles',
                'bold',
                'italic',
                'link'
              ]
            }
          }
        }
      }
    }
  }
};
