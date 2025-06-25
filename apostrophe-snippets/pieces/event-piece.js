// @title Event Piece Example
// @description A content type for events with date, time and location

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Event',
    pluralLabel: 'Events'
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Event Title',
        required: true
      },
      startDate: {
        type: 'date',
        label: 'Start Date',
        required: true
      },
      endDate: {
        type: 'date',
        label: 'End Date'
      },
      location: {
        type: 'string',
        label: 'Location',
        required: true
      },
      description: {
        type: 'area',
        label: 'Event Description',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          }
        }
      },
      organizer: {
        type: 'relationship',
        label: 'Organizer',
        withType: 'person-piece'
      }
    },
    group: {
      basics: {
        label: 'Basic Information',
        fields: ['title', 'startDate', 'endDate', 'location']
      },
      details: {
        label: 'Event Details',
        fields: ['description', 'organizer']
      }
    }
  }
};
