/**
 * Created by huning on 16/2/23.
 */
;(function($,win){
    var main = {
        init: function(){
            /*配置左侧*/
            this.config();
            this.addEvent();
            this.isLogin();

        },

        config: function(){
            var httpurl = new lib.httpurl(location.href);
            var pathname = httpurl.pathname.substring(1).split('/');//.replace('/','-');
            var mainpath = pathname[0]+'-'+pathname[1];
            if(pathname.length<2){
                mainpath = pathname[0]
            }
            $('li[data-index='+mainpath+']').addClass('active');
        },

        addEvent: function(){
            var self = this;
            $('header').on('click','.J-logout',function(){
                location.replace('/logout');
            })
        },

        isLogin: function(){
            var self = this;
            lib.api.get({
                api:'/isLogin',
                success: function(data){
                    if(data.data.isLogin == 1){
                        self.renderUser(data.data.isLogin);
                    }else{
                        var $inner = $('header .inner');
                        var user = topUser_template({
                            isLogin: data.data.isLogin
                        })
                        $inner.append(user);
                    }
                },
                error: function(err){
                    //console.log(err);
                    //lib.notification.simple(err.msg,{bg:'#e15f63',font:'#fff'},2000);
                },
                complete: function(){

                }
            })
        },

        renderUser: function(isLogin){
            var self = this;
            lib.api.get({
                api:'/user/detail',
                success: function(data){
                    var user = data.data;
                    if(user.role){
                        var $inner = $('header .inner');
                        var userhtml = topUser_template({
                            isLogin: isLogin,
                            depart: user.role.department.name,
                            role: user.role.name,
                            realname: user.realname,
                            head_url: user.head_url
                        });
                        $inner.append(userhtml);
                    }
                    lib.storage.set('user',user);
                    //socket
                    self.chat(user._id);
                },
                error: function(err){
                    //console.log(err);
                    //lib.notification.simple(err.msg,{bg:'#e15f63',font:'#fff'},2000);
                },
                complete: function(){

                }
            })
        },

        chat: function(_id){
            var self = this;
            this.socket = io();

            this.socket.on(_id, function(obj){
                if(obj.from._id==obj.to._id) {
                    return;
                }
                self.showRed();
            });
        },

        showRed: function(){
            $('#user').find('.J-red').show();
        }
    }

    $(function(){
        main.init();
    })
})(jQuery,window)