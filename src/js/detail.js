import {ajax} from '../utils/ajax.js'
import '../lib/jquery.js'

// 渲染商品详情页面
async function renderGoodsDetails() {
    // 获取商品ID从sessionStorage
    const goodsId = sessionStorage.getItem('id');

    // 如果没有商品ID,则报非法访问并跳转到商品列表页
    if (!goodsId) {
        alert('非法访问');
        return location.href = './list.html';
    }

    // 请求获取商品详情信息
    const { data: { code, info } } = await ajax.get(`/goods/item/${goodsId}`);

    // 如果请求失败,则提示获取商品详情失败并跳转到商品列表页
    if (code !== 1) {
        alert('获取商品详情失败');
        return location.href = './list.html';
    }

    // 设置商品详情页面元素
    $('.title').text(info.title);
    $('.middleimg').attr('src', info.img_big_logo);
    $('.desc').html(info.goods_introduce);
    $('.old').text(info.price);
    $('.discount').text(info.current_price / info.price);
    $('.curprice').text(info.current_price);
}

// 调用渲染函数
renderGoodsDetails();