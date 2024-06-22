import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'

// 获取页面元素
let listBox = $('.list');  // 商品列表
let categoryBox = $('.category');  // 分类列表
let filterBox = $('.filterBox').first();  // 热销/折扣筛选
let saleBox = $('.saleBox');  // 折扣筛选
let sortBox = $('.sortBox');  // 排序
let searchBox = $('.search');  // 搜索框

// 分页相关元素
let firstBtn = $('.first');  // 首页按钮
let prevBtn = $('.prev');  // 上一页按钮
let nextBtn = $('.next');  // 下一页按钮
let lastBtn = $('.last');  // 末页按钮
let totalBox = $('.total');  // 当前页/总页数
let pagesizeBox = $('.pagesize');  // 每页显示条数
let jumpBox = $('.jump');  // 跳转页码输入框
let jumpBtn = $('.go');  // 跳转按钮

// 请求参数
let data = {
    current: 1,  // 当前页
    pagesize: 12,  // 每页显示条数
    search: '',  // 搜索关键字
    filter: '',  // 热销/折扣筛选
    saleType: 10,  // 折扣类型
    sortType: 'id',  // 排序类型
    sortMethod: 'ASC',  // 排序方式
    category: '',  // 分类
}

// 渲染分类列表
async function renderCategory(){
    // 请求分类列表数据
    let {data: {code, list}} = await ajax.get('/goods/category');
    if (code !== 1) return console.log('获取分类列表失败');

    // 清空原有分类列表,并添加"全部"选项
    categoryBox.empty();
    let str = `<li class="active">全部</li>`;

    // 遍历分类列表,添加到分类列表中
    list.forEach(e => str += `<li>${e}</li>`);
    categoryBox.html(str);
}
renderCategory();

// 渲染商品列表
async function renderList() {
    // 请求商品列表数据
    let {data: {code, list, total}} = await ajax.get('/goods/list', {params: data});
    if (code !== 1) return console.log('获取商品列表失败');

    // 渲染商品列表
    let str = '';
    list.forEach(e => {
        str += `<li data-id="${e.goods_id}">
                    <div class="show">
                        <img src="${e.img_big_logo}">
                        ${e.is_hot ? '<span class="hot">热销</span>' : ''}
                        ${e.is_sale ? '<span>折扣</span>' : ''}
                    </div>
                    <div class="info">
                        <p class="title">${e.title}</p>
                        <p class="price">
                            <span class="curr">¥ ${e.current_price}</span>
                            <span class="old">¥ ${e.price}</span>
                        </p>        
                    </div>
                </li>`;
    });

    // 如果没有商品,显示"nothing"图片,并将当前页设为0
    if (list.length === 0) {
        data.current = 0;
        str = '<img src="../img/no.png" alt="">';
    }
    listBox.html(str);

    // 更新分页信息
    totalPage = total;
    totalBox.text(`${data.current} / ${totalPage}`);
    jumpBox.val(`${data.current}`);

    // 根据当前页,更新分页按钮的禁用状态
    prevBtn.removeClass('disable');
    nextBtn.removeClass('disable');
    firstBtn.removeClass('disable');
    lastBtn.removeClass('disable');

    if (data.current <= 1) {
        prevBtn.addClass('disable');
        firstBtn.addClass('disable');
    }
    if (data.current === totalPage) {
        nextBtn.addClass('disable');
        lastBtn.addClass('disable');
    }
}
renderList();

// 分类选择事件
categoryBox.on('click', ({target}) => {
    // 如果点击的是li标签
    if (target.nodeName === 'LI') {
        // 移除所有li的active类,添加到当前选中的li上
        categoryBox.children().removeClass('active');
        target.classList.add('active');

        // 获取选中的分类,并更新请求参数
        let category = target.innerText;
        data.category = category === '全部' ? '' : category;
        renderList();
    }
});

// 首页、末页、上一页、下一页事件
firstBtn.on('click', () => { data.current = 1; renderList(); });
lastBtn.on('click', () => { data.current = totalPage; renderList(); });
prevBtn.on('click', () => { if (data.current > 1) data.current--; renderList(); });
nextBtn.on('click', () => { if (data.current < totalPage) data.current++; renderList(); });

// 跳转页事件
jumpBtn.on('click', () => {
    let target = jumpBox.val();
    if (target < 1 || target > totalPage) return alert('跳转页不合法');
    data.current = target;
    renderList();
});

// 每页显示条数事件
pagesizeBox.on('change', () => {
    data.pagesize = pagesizeBox.val();
    data.current = 1;
    renderList();
});

// 热销/折扣筛选事件
filterBox.on('click', ({target}) => {
    if (target.nodeName === 'LI') {
        filterBox.children().removeClass('active');
        target.classList.add('active');
        data.filter = target.dataset.type;
        data.current = 1;
        renderList();
    }
});

// 折扣筛选事件
saleBox.on('click', ({target}) => {
    if (target.nodeName === 'LI') {
        saleBox.children().removeClass('active');
        target.classList.add('active');
        data.saleType = target.dataset.type;
        data.current = 1;
        renderList();
    }
});

// 排序事件
sortBox.on('click', ({target}) => {
    if (target.nodeName === 'LI') {
        sortBox.children().removeClass('active');
        target.classList.add('active');
        data.sortType = target.dataset.type;
        data.sortMethod = target.dataset.method;
        data.current = 1;
        renderList();
    }
});

// 搜索事件
searchBox.on('input', () => {
    data.search = searchBox.val();
    data.current = 1;
    renderList();
});

// 商品详情事件
listBox.on('click', ({target}) => {
    if (target.nodeName === 'LI') {
        let id = target.dataset.id;
        sessionStorage.setItem('id', id);
        location.href = './detail.html';
    }
});