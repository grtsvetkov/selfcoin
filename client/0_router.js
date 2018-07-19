currentRouterName = new ReactiveVar();

navbarF7 = {
    title: new ReactiveVar('Стильные кухни'),
    left: new ReactiveVar(false),
    right: new ReactiveVar(false)
};

F7PageInit = function (rName, attempt) {

    if(attempt == 0) {

        if (Template && Template[rName] && typeof Template[rName].renderedF7 == 'function') {
            this.tmpF = Template[rName].renderedF7;
        } else {
            this.tmpF = () => {
            };
        }
    }

    if (app != null && typeof mainView != 'undefined' && mainView != null) {

        let self = this;

        Template[rName].rendered = function () {
            mainView.emit('pageInit', {$el: $('.page-current')});
            self.tmpF();
        };

        Template[rName].rendered.call(Template[rName]);

    } else if (attempt <= 10) {
        Meteor.setTimeout(function () {
            F7PageInit(rName, attempt + 1);
        }, 333);
    }
};

Router.configure({
    layoutTemplate: 'AppLayout', //AppLayout.html
    notFoundTemplate: 'Error404', //Error404.html
    loadingTemplate: 'Loading', //Loading.html
    controller: RouteController.extend({
        after: function () {

            navbarF7.left.set(false);
            navbarF7.right.set(false);
            navbarF7.title.set(this.route.options.title ? this.route.options.title : 'Стильные кухни');
            currentRouterName.set(this.route.options.menu ? this.route.options.menu : this.route.getName());

            F7PageInit(this.route.getName(), 0);
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

Router.route('/contact/create', {
    title: 'Контакты',
    name: 'contactCreate',
    menu: 'contact',

    waitOn: function () {
        return [
            Meteor.subscribe('contact', 'only_my')
        ];
    }
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