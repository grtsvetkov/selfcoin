currentRouterName = new ReactiveVar();
currentTitle = new ReactiveVar('Coined Coin');
currentBackButton = new ReactiveVar(false);

F7PageInit = function (attempt) {
    if (typeof mainView != 'undefined' && mainView != null) {

        let tmpF = function () {
            },
            rName = Router.current().route.getName();


        if (Template && Template[rName]) {
            if (typeof Template[rName].rendered == 'function') {
                tmpF = Template[rName].rendered;
            }
        }

        Template[rName].rendered = function () {
            mainView.emit('pageInit', {$el: $('.page-current')});
            tmpF();
        };
    } else if (attempt <= 10) {
        Meteor.setTimeout(function () {
            F7PageInit(attempt + 1);
        }, 333);
    }

};

Router.configure({
    layoutTemplate: 'AppLayout', //AppLayout.html
    notFoundTemplate: 'Error404', //Error404.html
    loadingTemplate: 'Loading', //Loading.html
    controller: RouteController.extend({
        after: function () {

            currentBackButton.set(false);

            currentTitle.set(Router.current().route.options.title ? Router.current().route.options.title : 'Coined Coin');

            currentRouterName.set(Router.current().route.options.menu ? Router.current().route.options.menu : Router.current().route.getName());

            F7PageInit(0);
        }
    })
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

Router.route('/contact/:_id', {
    title: 'Контакты',
    name: 'contactItem',
    menu: 'contact',

    waitOn: function () {
        return [
            Meteor.subscribe('contact', 'only_my')
        ];
    }
});

Router.route('/contact', {
    title: 'Контакты',
    name: 'contactList',
    menu: 'contact',

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

Router.route('/coin/:_id', {
    title: 'Монета',
    name: 'coinItem',
    menu: 'coin',
    waitOn: function () {
        return [
            Meteor.subscribe('coin', 'only_my')
        ];
    }
});

Router.route('/coin', {
    title: 'Монета',
    name: 'coinList',
    menu: 'coin',

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