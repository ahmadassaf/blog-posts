export const gaudiBarRegions = [
  {
    'bar': 'top',
    'description': 'Yabai keeps named workspaces and their active applications in one compact, scannable strip.',
    'id': 'top-left',
    'label': 'Left region',
    'layout': 'spaces',
    'widgets': [
      { 'apps': [ 'AppWindow', 'Mail' ], 'icon': 'Panels', 'label': 'Main', 'value': '01' },
      { 'apps': [ 'ChatBubbleLeftRightIcon' ], 'icon': 'ChatBubbleLeftRightIcon', 'label': 'Comms', 'value': '02' },
      { 'apps': [ 'FileText' ], 'icon': 'FileText', 'label': 'Productivity', 'value': '03' },
      { 'apps': [ 'Code' ], 'icon': 'Code', 'label': 'Terminal', 'value': '04' },
      { 'apps': [ 'Robot' ], 'icon': 'Robot', 'label': 'AI', 'value': '05' }
    ]
  },
  {
    'bar': 'top',
    'description': 'Date and time share the centre without fixed positioning.',
    'id': 'top-middle',
    'label': 'Middle region',
    'widgets': [
      { 'icon': 'Calendar', 'label': 'Date', 'value': 'Thu 19' },
      { 'icon': 'Clock', 'label': 'Time', 'value': '10:42' },
      { 'icon': 'AppWindow', 'label': 'Window', 'value': 'Code' }
    ]
  },
  {
    'bar': 'top',
    'description': 'Context-aware widgets expand and contract together as their content changes.',
    'id': 'top-right',
    'label': 'Right region',
    'widgets': [
      { 'icon': 'Wifi', 'label': 'Wi-Fi', 'value': 'Studio' },
      { 'icon': 'CloudSun', 'label': 'Weather', 'value': '22°' },
      { 'icon': 'Battery', 'label': 'Battery', 'meter': 86, 'tone': 'success', 'value': '86%' }
    ]
  },
  {
    'bar': 'bottom',
    'description': 'Yabai state, active space, display, and focused window remain visible without opening another tool.',
    'id': 'bottom-left',
    'label': 'Left region',
    'widgets': [
      { 'icon': 'Panels', 'label': 'Yabai', 'value': 'bsp' },
      { 'icon': 'Grid', 'label': 'Space', 'value': '03' },
      { 'icon': 'AppWindow', 'label': 'Window', 'value': 'Code' },
      { 'icon': 'Server', 'label': 'Display', 'value': 'Main' }
    ]
  },
  {
    'bar': 'bottom',
    'description': 'This secondary region is intentionally empty in the current layout.',
    'id': 'bottom-middle',
    'label': 'Middle region',
    'widgets': []
  },
  {
    'bar': 'bottom',
    'description': 'Storage, memory, temperature, processor load, and latency stay dense while their values update.',
    'id': 'bottom-right',
    'label': 'Right region',
    'layout': 'telemetry',
    'widgets': [
      { 'icon': 'Server', 'label': 'SSD', 'meter': 68, 'tone': 'success', 'value': '129GB' },
      { 'icon': 'Memory', 'label': 'MEM', 'meter': 25, 'tone': 'success', 'value': '25%' },
      { 'icon': 'Gauge', 'label': 'TEMP', 'status': true, 'tone': 'success', 'value': '41°C' },
      { 'icon': 'Cpu', 'label': 'CPU', 'trend': [ 8, 9, 8, 10, 9, 11, 10, 12, 35, 29, 55 ], 'value': '55%' },
      { 'icon': 'Wifi', 'label': 'PING', 'status': true, 'tone': 'success', 'trend': [ 8, 3, 9, 2, 7, 3, 6, 2, 5, 3, 4 ], 'value': '3ms' }
    ]
  }
];

export const gaudiBarRegionsById = Object.fromEntries(gaudiBarRegions.map((region) => [ region.id, region ]));
