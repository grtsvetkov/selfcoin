let F7PageFix = function (rName) {
    Template[rName].renderedNative = Template[rName].rendered || function () {
        };

    Template[rName].rendered = () => {

        Template[rName].fixed = true;

        if (typeof Template[rName].attempt == 'undefined') {
            Template[rName].attempt = 0;
        }

        Template[rName].attempt++;

        if (typeof mainView != 'undefined' && mainView != null) {

            Template[rName].attempt = 0;

            Meteor.defer(() => {
                Template[rName].renderedNative.call(Template[rName]);
                mainView.emit('pageInit', {$el: $('.page')});
                mainView.router.clearHistory();
                mainView.router.init();
                mainView.router.allowPageChange = true;
            });
        } else if (Template[rName].attempt <= 100) {
            Meteor.setTimeout(function () {
                Template[rName].rendered(rName);
            }, 111);
        }
    }
};

RouteController.__super__.render = function (template, options) {

    if (options && (typeof options.data !== 'undefined')) {
        options.data = bindData(options.data, this);
    }

    let self = this,
        tmpl = this._layout.render(template, options),
        camelTmpl = Iron.utils.camelCase(template);

    if (typeof Template[camelTmpl] != 'undefined' && (typeof Template[camelTmpl].fixed == 'undefined' || !Template[camelTmpl].fixed)) {
        F7PageFix(camelTmpl);
    }

    return {
        data: function (func) {
            return tmpl.data(bindData(func, self));
        }
    };
};


currentRouterName = new ReactiveVar();

navbarF7 = {
    title: new ReactiveVar('Coined Coin'),
    left: new ReactiveVar(false),
    right: new ReactiveVar(false)
};

Router.configure({
    layoutTemplate: 'AppLayout', //AppLayout.html
    notFoundTemplate: 'Error404', //Error404.html
    loadingTemplate: 'Loading', //Loading.html
    controller: RouteController.extend({
        after: function () {
            navbarF7.left.set(false);
            navbarF7.right.set(false);
            navbarF7.title.set(this.route.options.title ? this.route.options.title : 'Coined Coin');
            currentRouterName.set(this.route.options.menu ? this.route.options.menu : this.route.getName());
        }
    })
});


Router.route('/', {
    title: 'Подборка монет',
    name: 'index',

    waitOn: function () {
        return [
            Meteor.subscribe('coin', 'only_my')
        ];
    }
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
            Meteor.subscribe('coin', 'only_my'),
            Meteor.subscribe('wallet', 'byMyCoin', this.params._id),
            Meteor.subscribe('contact', 'only_my'),
            Meteor.subscribe('request_enroll', 'only_my', this.params._id)
        ];
    }
});

Router.route('/coin', {
    title: 'Монета',
    name: 'coinList',
    menu: 'coin',

    waitOn: function () {
        return [
            Meteor.subscribe('coin', 'only_my'),
            Meteor.subscribe('wallet'),
            Meteor.subscribe('requestForParty')
        ];
    }
});

Router.route('/create', {
    title: 'Создать монету',
    name: 'create',
    menu: 'coin'
});