// @title Image Widget Example
// @description An image widget with alt text and optional caption

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Image Widget'
  },
  fields: {
    add: {
      image: {
        type: 'area',
        label: 'Image',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        },
        required: true
      },
      altText: {
        type: 'string',
        label: 'Alt Text',
        required: true
      },
      caption: {
        type: 'string',
        label: 'Caption',
        textarea: true
      }
    }
  }
};
