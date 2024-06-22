import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import {pwdTest} from '../utils/register.js'

// 立即执行函数,检查登录状态
(async () => {
    // 判断是否登录
    let {status, user, token} = await isLogin();
    if (status !== 1) {
        alert('请先登录!');
        location.href = './login.html';
    }

    // 表单提交事件
    $('form').on('submit', async e => {
        e.preventDefault(); // 阻止表单默认提交行为

        // 获取表单输入值
        let oldPassword = $('.oldpassword').val();
        let newPassword = $('.newpassword').val();
        let rNewPassword = $('.rnewpassword').val();

        // 检查旧密码、新密码和确认新密码是否为空
        if (oldPassword === '') {
            return alert('旧密码不能为空');
        }
        if (newPassword === '') {
            return alert('新密码不能为空');
        }
        if (rNewPassword === '') {
            return alert('确认新密码不能为空');
        }

        // 检查新密码格式是否正确
        if (!pwdTest(newPassword)) {
            return alert('新密码格式错误');
        }

        // 检查两次新密码是否一致
        if (newPassword !== rNewPassword) {
            return alert('两次密码不一致');
        }

        // 发送修改密码请求
        let data = {id: user.id, oldPassword, newPassword, rNewPassword};
        let {data: {code}} = await ajax.post('/users/rpwd', data, {headers: {authorization: token}});
        if (code !== 1) {
            return alert('修改失败');
        }

        // 修改密码成功后,删除本地存储的token和uid,并跳转到登录页面
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        alert('修改成功,点击确定跳转至登录页面');
        location.href = './login.html';
    });
})();