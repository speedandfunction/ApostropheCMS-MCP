// @title Person Piece Example
// @description A content type for team members or authors

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Person',
    pluralLabel: 'People'
  },
  fields: {
    add: {
      firstName: {
        type: 'string',
        label: 'First Name',
        required: true
      },
      lastName: {
        type: 'string',
        label: 'Last Name',
        required: true
      },
      title: {
        type: 'string',
        label: 'Job Title'
      },
      photo: {
        type: 'area',
        label: 'Photo',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      bio: {
        type: 'area',
        label: 'Biography',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          }
        }
      },
      email: {
        type: 'email',
        label: 'Email Address'
      }
    },
    group: {
      basics: {
        label: 'Basic Information',
        fields: ['firstName', 'lastName', 'title', 'email']
      },
      content: {
        label: 'Profile Content',
        fields: ['photo', 'bio']
      }
    }
  }
};
