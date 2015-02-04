/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function() {
    "use strict";
    return {
        indexAction: function() {
            var userInfo = this.userInfo;
            var self = this;
            var isLogin = false;

            if (!isEmpty(userInfo)) {
                isLogin = true;
            }

            var brandModel = D('Brand');
            var brandData = [];

            //将用户信息赋值到模版变量里，供模版里使用
            brandModel.getBrand().then(function(data) {
                self.assign({
                    'title': '管理-首页',
                    'brand': data,
                    'isLogin': isLogin
                });
                return self.display();
            });
        }
    };
});
