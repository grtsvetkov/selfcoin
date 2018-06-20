currentRouterName = new ReactiveVar();

ApplicationController = RouteController.extend({
    after: function () {
        currentRouterName.set(Router.current().route.getName());
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
