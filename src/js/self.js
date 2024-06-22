import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import {nickTest, sexTest, ageTest} from '../utils/register.js'

// 立即执行函数,检查登录状态并渲染用户信息
(async () => {
    // 判断是否登录
    let {status, user, token} = await isLogin();
    if (status !== 1) {
        alert('请先登录!');
        location.href = './login.html';
    }

    // 将原有的用户信息渲染到表单中
    $('.username').val(user.username);
    $('.age').val(user.age);
    $('.gender').val(user.gender);
    $('.nickname').val(user.nickname);

    // 表单提交事件
    $('form').on('submit', async e => {
        e.preventDefault(); // 阻止表单默认提交行为

        // 获取表单输入值
        let age = $('.age').val();
        let gender = $('.gender').val();
        let nickname = $('.nickname').val();

        // 检查年龄、性别和昵称是否为空
        if (age === '') {
            return alert('年龄不能为空');
        }
        if (gender === '') {
            return alert('性别不能为空');
        }
        if (nickname === '') {
            return alert('昵称不能为空');
        }

        // 检查年龄、性别和昵称格式是否正确
        if (!ageTest(age)) {
            return alert('年龄格式错误');
        }
        if (!sexTest(gender)) {
            return alert('性别格式错误');
        }
        if (!nickTest(nickname)) {
            return alert('昵称格式错误');
        }

        // 发送更新用户信息请求
        let data = {id: user.id, age, gender, nickname};
        let {data: {code}} = await ajax.post('/users/update', data, {headers: {authorization: token}});
        if (code !== 1) {
            return alert('修改失败');
        }

        // 修改成功,提示用户
        alert('修改成功');
    });
})();