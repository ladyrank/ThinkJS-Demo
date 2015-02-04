/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
module.exports = Controller(function() {
    'use strict';

    return {
        init: function(http) {
            this.super("init", http);
            //其他的通用逻辑
            var self = this;

            //登录页面不检测用户是否已经登录
            return self.session('userInfo').then(function(userInfo) {
                self.userInfo = userInfo;
                self.assign('userInfo', userInfo);
            })
        }
    }
});
