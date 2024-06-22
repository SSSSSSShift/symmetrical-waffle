import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'
import { nameTest, pwdTest } from "../utils/register.js" // 导入用户名与密码正则校验

// 表单提交事件
$('form').on('submit', async e => {
    e.preventDefault(); // 阻止表单默认提交行为

    // 获取用户输入的用户名和密码
    let username = $('.username').val();
    let password = $('.password').val();

    // 检查用户名和密码是否为空
    if (username === '' || password === '') {
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

    // 发送登录请求
    let {data: {code, message, token, user}} = await ajax.post('/users/login', {username, password});

    // 登录失败,显示错误信息
    if (code !== 1) {
        if (message === '用户名或密码错误') {
            $('.error').css('display', 'block');
        } else {
            alert(message); // 可能是被冻结,输出联系管理员
        }
        return;
    }

    // 登录成功,保存 token 和 id,跳转到主页
    localStorage.setItem('token', token);
    localStorage.setItem('uid', user.id);
    location.href = './index.html';
});