import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import '../lib/layui/layui.js';

// 检查用户登录状态并执行相应操作
(async () => {
    // 检查用户登录状态
    let {status, user} = await isLogin();

    // 如果用户已登录
    if (status === 1) {
        // 切换显示状态
        $('.off').removeClass('active');
        $('.on').addClass('active');
        
        // 显示用户昵称并添加个人中心链接
        $('.nickname').text(user.nickname);
        $('.self').on('click', () => location.href = './self.html');
        
        // 添加退出登录事件
        $('.logout').on('click', async () => {
            // 弹窗确认是否注销
            if (!confirm('确定要退出登录吗？')) return;
            
            // 获取本地存储中的用户信息
            let id = localStorage.getItem('uid');
            let token = localStorage.getItem('token');
            
            // 发起退出登录请求
            let {data: {code}} = await ajax.get('/users/logout', {params: {id}, headers: {authorization: token}});
            
            // 如果退出登录失败，则提示注销失败
            if (code !== 1) return alert('注销失败');
            
            // 清除本地存储数据
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            
            // 切换显示状态
            $('.off').addClass('active');
            $('.on').removeClass('active');
        })
    }
})();

// 渲染轮播图
async function renderCarousel() {
    // 获取轮播图列表
    let { data: { code, list } } = await ajax.get('/carousel/list');
    
    // 如果获取轮播图失败，则在控制台打印错误信息
    if (code !== 1) return console.log('获取轮播图失败');
    
    // 构建轮播图HTML
    let carouselHtml = '';
    list.forEach(e => carouselHtml += `<div><img src="${ajax.defaults.baseURL}/${e.name}"></div>`);
    
    // 将轮播图HTML渲染到页面
    $('#carousel > :first-child').html(carouselHtml);

    // 使用layui渲染轮播图
    layui.carousel.render({
        elem: '#carousel', // 轮播图容器选择器
        width: '1200px', // 设置容器宽度
        height: '600px', // 设置容器高度
        arrow: 'hover', // 鼠标悬停时显示箭头
        anim: 'fade' // 切换动画方式
    });
}

// 调用渲染轮播图函数
renderCarousel();