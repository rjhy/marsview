/**
 * 组件默认属性值
 */

/**
 * 页面配置和属性值
 */

export default {
  // 页面属性配置JSON
  attrs: [
    {
      key: 'PageSet',
      type: 'Title',
      label: '页面配置',
    },
    {
      type: 'InputNumber',
      label: '宽度',
      name: 'width',
    },
    {
      type: 'InputNumber',
      label: '高度',
      name: 'height',
    },
    {
      key: 'rotate',
      type: 'Switch',
      label: '开启自动旋转',
      name: ['isAutoFun'],
    },
    {
      type: 'Select',
      label: '车辆颜色',
      name: ['color'],
      props: {
        placeholder: 'http://',
        options: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green' },
          { label: '蓝色', value: 'blue' },
        ],
      },
    },
  ],
  config: {
    props: {
      width: 1200,
      height: 500,
      isAutoFun: true,
      color: 'red',
    },
    style: {},
    scopeCss: '',
    scopeStyle: {},
    events: [],
    api: {
      sourceType: 'json',
      id: '',
      source: {},
      sourceField: '',
    },
  },
  // 组件事件
  events: [
    {
      value: 'onLoad',
      name: '初始化事件',
    },
  ],
};
