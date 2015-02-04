/**
 * controller
 * @return
 */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var dateFormat = require('date-format-lite');
var random = require('random-js')();
var webshot = require('webshot');
var Crawler = require("crawler");

module.exports = Controller('Admin/BaseController', function() {
    'use strict';
    return {
        //登录
        loginAction: function() {
            var self = this;

            //页面post
            if (self.isPost()) {
                //用户登录成功写入Session
                var name = self.post('name'); //获取post过来的用户名
                var pwd = self.post('pwd'); //获取post过来的密码

                return D('User').where({ //根据用户名和密码查询符合条件的数据
                    name: name,
                    pwd: md5(pwd)
                }).find().then(function(data) {
                    if (isEmpty(data)) {
                        //用户名或者密码不正确，返回错误信息
                        return self.error(403, '用户名或者密码不正确');
                    } else {
                        return self.session('userInfo', data);
                    }
                }).then(function() {
                    //登录成功跳转
                    return self.redirect('index');
                });
            } else {
                //页面加载
                self.assign({
                    'title': '管理-登录'
                });
                return self.display();
            }
        },
        //注销
        logoutAction: function() {
            var self = this;
            self.session('userInfo', '');
            self.redirect('login');
        },
        //首页
        indexAction: function() {
            var userInfo = this.userInfo;
            var self = this;

            if (!isEmpty(userInfo)) {
                var brandModel = D('Brand');
                var brandData = [];

                //将用户信息赋值到模版变量里，供模版里使用
                brandModel.getBrand().then(function(data) {
                    userInfo.name === 'admin' ? brandData = data : brandData = [];

                    self.assign({
                        'title': '管理-首页',
                        'brand': brandData,
                        'user': userInfo
                    });
                    return self.display();
                });
            }
        },
        //通用图片上传
        utilUploadImg: function(upImgName, upImgPath) {
            var extension = '';
            var finalFileName = '';

            //处理后缀和文件名
            upImgPath.indexOf('png') !== -1 ? extension = '.png' : extension = '.jpg';
            finalFileName = new Date().getTime() + extension;

            //读取文件
            fs.readFile(upImgPath, function(err, data) {
                if (err) {
                    console.log('There was an error when reading file');
                } else {
                    //写入文件到uplaod
                    fs.writeFile('upload/' + finalFileName, data, function(err) {
                        if (err) {
                            console.log('There was an error when write file');
                        } else {
                            console.log('saved');
                        }
                    });
                }
            });

            return finalFileName;
        },
        //添加
        addAction: function() {
            var self = this;
            var where = {
                name: ''
            };

            if (self.isPost()) {
                var brandModel = D('Brand');
                var pData = self.post();
                var vBImg = self.file('img');
                var finalFileName = this.utilUploadImg(pData.name, vBImg.path);

                where.name = pData.name;
                //保存数据到数据库
                pData.img = finalFileName;
                brandModel.thenAdd(pData, where, true).then(function(insertId) {
                    if (insertId.type === 'add') {
                        return self.redirect('/home/index/index');
                    } else {
                        return self.error(insertId.type);
                    }
                });
            } else {
                self.assign({
                    'title': '管理-新增品牌'
                });
                return self.display();
            }
        },
        //删除
        delAction: function() {
            var self = this;

            if (self.isGet()) {
                //获取name值
                var id = this.get('id');

                D('Brand').where({
                    id: id
                }).delete().then(function(affectedRows) {
                    if (affectedRows > 0) {
                        return self.redirect('/home/index/index');
                    }
                });
            }
        },
        //修改
        updateAction: function() {
            var self = this;
            var id = 0;

            //GET数据
            if (self.isGet()) {
                //获取name值
                id = self.get('id');

                D('Brand').where({
                    id: id
                }).find().then(function(theBrand) {
                    self.assign({
                        'title': '管理-修改',
                        'brand': theBrand
                    });
                    self.display();
                });
            } else if (self.isPost()) {
                //POST数据
                var updateData = self.post();
                var vBImg = self.file('img');
                console.log(vBImg);

                // 如果没有更改图片， 防止上传空文件
                if (vBImg.originalFilename !== '') {
                    var finalFileName = this.utilUploadImg(updateData.name, vBImg.path);
                    updateData.img = finalFileName;
                }

                id = self.post('id');
                D('Brand').where({
                    id: id
                }).update(updateData).then(function(affectedRows) {
                    if (affectedRows > 0) {
                        return self.redirect('/home/index/index');
                    }
                });
            }
        }
    };
});
