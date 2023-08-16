const contentFields = {
  'author': {
    'avatar': { 'type': 'string' },
    'company': { 'type': 'string' },
    'email': { 'type': 'string' },
    'github': { 'type': 'string' },
    'layout': { 'type': 'string' },
    'linkedin': { 'type': 'string' },
    'name': { 'required': true, 'type': 'string' },
    'occupation': { 'type': 'string' },
    'twitter': { 'type': 'string' }
  },
  'post': {
    'bibliography': { 'type': 'string' },
    'category': { 'required': true, 'type': 'string' },
    'date': { 'required': true, 'type': 'date' },
    'draft': { 'type': 'boolean' },
    'featured': { 'type': 'boolean' },
    'layout': { 'type': 'string' },
    'subtitle': { 'required': false, 'type': 'string' },
    'summary': { 'type': 'string' },
    'tags': { 'default': [], 'of': { 'type': 'string' }, 'type': 'list' },
    'title': { 'required': true, 'type': 'string' }
  },
  'project': {
    'bibliography': { 'type': 'string' },
    'category': { 'required': true, 'type': 'string' },
    'date': { 'required': true, 'type': 'date' },
    'draft': { 'type': 'boolean' },
    'featured': { 'type': 'boolean' },
    'github': { 'required': true, 'type': 'string' },
    'layout': { 'required': true, 'type': 'string' },
    'subtitle': { 'required': false, 'type': 'string' },
    'summary': { 'type': 'string' },
    'tags': { 'default': [], 'of': { 'type': 'string' }, 'type': 'list' },
    'title': { 'required': true, 'type': 'string' }
  }
};

export default contentFields;
