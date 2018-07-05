currentRouterName = new ReactiveVar();
currentTitle = new ReactiveVar('Coined Coin');
currentBackButton = new ReactiveVar(false);

F7PageInit = function(attempt) {
    if(typeof mainView != 'undefined' && mainView != null) {

        let tmpF = function () {};

        if(Template && Template[Router.current().route.options.name]) {
            if(typeof Template[Router.current().route.options.name].rendered == 'function') {
                tmpF = Template[Router.current().route.options.name].rendered;
            }
        }

        Template[Router.current().route.options.name].rendered = function() {
            mainView.emit('pageInit', {$el: $('.page-current')});
            tmpF();
        };
    } else if(attempt <= 10) {
        Meteor.setTimeout(function(){
            F7PageInit(attempt + 1);
        }, 333); 
    }
    
};

ApplicationController = RouteController.extend({
    after: function () {

        currentBackButton.set(false);

        currentTitle.set(Router.current().route.options.title ? Router.current().route.options.title : 'Coined Coin');
        
        currentRouterName.set(Router.current().route.options.name);

        F7PageInit(0);
    }
});

Router.configure({
    layoutTemplate: 'AppLayout', //AppLayout.html
    notFoundTemplate: 'Error404', //Error404.html
    loadingTemplate: 'Loading', //Loading.html
    controller: ApplicationController
});

Router.route('/', {
    title: 'Рабочий стол',
    name: 'index'
});

Router.route('/market', {
    title: 'Биржа',
    name: 'market'
});

Router.route('/profile', {
    title: 'Профиль',
    name: 'profile'
});

Router.route('/contact', {
    title: 'Контакты',
    name: 'contact',

    action: function() {
        this.route.options.name = (this.params._id) ? 'ContactItem' : 'ContactList';
        this.render(this.route.options.name);
    },

    waitOn: function () {
        return [
            Meteor.subscribe('contact', 'only_my')
        ];
    }
});

Router.route('/welcome', {
    title: 'Добро пожаловать',
    name: 'welcome'
});

Router.route('/signin', {
    title: 'Авторизация',
    name: 'signin'
});

Router.route('/coin/:_id?', {
    title: 'Монета',
    name: 'coin',

    action: function() {
        this.route.options.name = (this.params._id) ? 'CoinItem' : 'CoinList';
        this.render(this.route.options.name);
    },

    waitOn: function () {
        return [
            Meteor.subscribe('coin', 'only_my')
        ];
    }
});

Router.route('/create', {
    title: 'Создать монету',
    name: 'create'
});