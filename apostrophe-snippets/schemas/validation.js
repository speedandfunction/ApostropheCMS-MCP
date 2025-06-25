// @title Validation Schema Example
// @description Common validation rules and custom validators

module.exports = {
  validators: {
    email(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      return false;
    },
    phone(value) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
      return false;
    },
    url(value) {
      try {
        new URL(value);
        return false;
      } catch {
        return 'Please enter a valid URL';
      }
    },
    dateRange(startDate, endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return 'End date must be after start date';
      }
      return false;
    }
  },
  sanitizers: {
    stripHtml(value) {
      return value.replace(/<[^>]*>/g, '');
    },
    normalizePhone(value) {
      return value.replace(/[^\d+]/g, '');
    },
    trim(value) {
      return value.trim();
    }
  }
};
