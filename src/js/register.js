import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'
import { nameTest, pwdTest, nickTest } from "../utils/register.js"

// 表单提交事件
$('form').on('submit', async e => {
    e.preventDefault(); // 阻止表单默认提交行为

    // 获取表单输入值
    let username = $('.username').val();
    let password = $('.password').val();
    let rpassword = $('.rpassword').val();
    let nickname = $('.nickname').val();

    // 检查表单输入是否为空
    if (username === '' || password === '' || rpassword === '' || nickname === '') {
        return alert('表单不能为空');
    }

    // 检查用户名格式是否正确
    if (!nameTest(username)) {
        return alert('用户名格式错误');
    }

    // 检查密码格式是否正确
    if (!pwdTest(password)) {
        return alert('密码格式错误');
    }

    // 检查昵称格式是否正确
    if (!nickTest(nickname)) {
        return alert('昵称格式错误');
    }

    // 检查两次密码是否一致
    if (password !== rpassword) {
        return alert('两次密码不一致');
    }

    // 发送注册请求
    let {data: {code}} = await ajax.post('/users/register', {username, password, rpassword, nickname});

    // 注册失败,显示错误信息
    if (code !== 1) {
        $('.error').css('display', 'block');
        return;
    }

    // 注册成功,跳转到登录页面
    alert('注册成功,点击确定跳转到登录页面');
    location.href = './login.html';
});