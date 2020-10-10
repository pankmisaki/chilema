// 引入axios
import axios from 'axios'

// 设置基本服务器路径
axios.defaults.baseURL= 'http://127.0.0.1:5000'


// ---------------------------账号管理接口-------------------------------
// 登录API接口
export let  api_login = params => axios.post('/users/checkLogin',params)

// 添加账号API接口
export let  api_adduser = params => axios.post('/users/add',params)

// 账号列表API接口
export let  api_userlist = params => axios.get('/users/list',params)

// 删除单挑账号数据
export let  api_deleteuser = params => axios.get('/users/del',params)

// 批量删除账号数据
export let  api_batchdel = params => axios.get('/users/batchdel',params)

// 修改账号接口
export let  api_edituser = params => axios.post('/users/edit',params)

// 检查旧密码是否正确
export let  api_checkoldpwd = params => axios.get('/users/checkoldpwd',params)

// 修改密码接口
export let  api_editpwd = params => axios.post('/users/editpwd',params)

// 验证token是否过期
export let  api_token = params => axios.get('/users/checktoken',params)

// 获取个人信息
export let  api_accountinfo = params => axios.get('/users/accountinfo',params)

// 头像上传接口
export let  api_upload = params => axios.post('/users/avatar_upload',params)

// ---------------------------商品管理接口----------------------------------

// 获取商品分类接口
export let  api_catelist = pramas => axios.get('/goods/catelist',pramas)

// 删除商品分类接口
export let  api_delcate = pramas => axios.get('/goods/delcate',pramas)

//添加商品分类接口
export let  api_addcate = pramas => axios.post('/goods/addcate',pramas)

// 修改分类接口
export let  api_editcate = pramas => axios.post('/goods/editcate',pramas)

// 获取商品列表接口
export let  api_goodsList = pramas => axios.get('/goods/list',pramas)

//查询所有分类名称接口
export let  api_categories = pramas => axios.get('/goods/categories',pramas)

// 添加商品接口
export let  api_goodsadd= pramas => axios.post('/goods/add',pramas)

// 删除商品接口
export let  api_delgoods = pramas => axios.get('/goods/del',pramas)

// 修改商品接口
export let  api_goodsedit= pramas => axios.post('/goods/edit',pramas)


// ---------------------------店铺管理接口----------------------------------
// 获取店铺数据接口
export let  api_shopinfo = pramas => axios.get('/shop/info',pramas)

// 店铺内容修改接口
export let  api_shopedit = pramas => axios.post('/shop/edit',pramas)


// 获取订单列表(带查询功能)接口
export let  api_orderList = pramas => axios.get('/order/list',pramas)

// 获取当前行订单详情接口
export let  api_orderDetail = pramas => axios.get('/order/detail',pramas)

// 获取修改订单数据接口
export let  api_orderEdit = pramas => axios.post('/order/edit',pramas)

// ---------------------------订单报表接口接口----------------------------------
// 获取订单报表数据接口
export let  api_ordertotaldata = pramas => axios.get('/order/totaldata',pramas)

// 订单报表接口
export let  api_ordertotal = pramas => axios.get('/order/ordertotal',pramas)






 






