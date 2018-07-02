currentRouterName = new ReactiveVar();

ApplicationController = RouteController.extend({
    after: function () {

        currentRouterName.set(Router.current().route.getName());
        if(typeof mainView != 'undefined' && mainView != null) {

            let tmpF = function () {

            };

            if(Template && Template[Router.current().route.getName()]) {
                if(typeof Template[Router.current().route.getName()].rendered == 'function') {
                    tmpF = Template[Router.current().route.getName()].rendered;
                }
            }

            Template[Router.current().route.getName()].rendered = function() {
                mainView.emit('pageInit', {$el: $('.page-current')});
                tmpF();
            };

        }
    }
});

Router.configure({
    layoutTemplate: 'AppLayout', //AppLayout.html
    notFoundTemplate: 'Error404', //Error404.html
    loadingTemplate: 'Loading', //Loading.html
    controller: ApplicationController
});

Router.route('/', {
    name: 'index'
});

Router.route('/market', {
    name: 'market'
});

Router.route('/profile', {
    name: 'profile'
});

Router.route('/welcome', {
    name: 'welcome'
});

Router.route('/signin', {
    name: 'signin'
});

Router.route('/coin', {
    name: 'coin'
});

Router.route('/mycoin', {
    name: 'mycoin'
});

Router.route('/create', {
    name: 'create'
});