//模型定义
module.exports = Model(function () {
    return {
        //获取用户列表
        getBrand: function () {
            //实例化模型类
            return this.order('id').select().then(function(data) {
                return data;
            });
        }
    }
});