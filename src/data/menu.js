const menu = [
  {
    title:'店铺管理',
    icon: 'appstore',
    key: '/store'
  },
  {
    title:'商品管理',
    icon:'appstore',
    key: '/goods',
    sub:[
      {
        title:'商品列表',
        icon:'bars',
        key:'/goods/list'
      },
      {
        title:'添加商品',
        icon:'plus',
        key:'/goods/add'
      }
    ]
  },
  {
    title:'订单管理',
    icon:'appstore',
    key: '/orders',
  },
  {
    title:'课程管理',
    icon:'appstore',
    key: 'course',
    sub:[
      {
        title:'课程列表',
        icon:'bars',
        key: '/course/list',
      },
      {
        title:'添加课程',
        icon:'plus',
        key: '/course/add',
      }
    ]
  }
]

export default menu