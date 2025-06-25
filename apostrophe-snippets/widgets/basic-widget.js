// @title Basic Widget Example
// @description A simple ApostropheCMS widget with text field

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Basic Widget'
  },
  fields: {
    add: {
      text: {
        type: 'string',
        label: 'Text Content',
        required: true
      }
    }
  }
};
