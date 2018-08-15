import Framework7 from "framework7";
import "framework7/css/framework7.min.css";
import "framework7-icons";
import "jquery-mask-plugin";

app = null,
    mainView = null;

let flag_welcome = localStorage.getItem('_firstTimeOpenedApp') || null;

if (flag_welcome != "true") {
    //localStorage.setItem('_firstTimeOpenedApp', true);
    Router.go('welcome');
}

document.addEventListener('deviceready', function () {
    if (cordova && cordova.plugins && cordova.plugins.statusbarOverlay) {
        cordova.plugins.statusbarOverlay.show();
    }
});

Tracker.autorun(function () {
    if (!Meteor.userId()) {

        let token = localStorage.getItem('_storedLoginToken');

        if (token) {
            Meteor.loginWithToken(token, function (err) {
                if (!err) {
                    if (mainView && Router.current().route.getName() == 'signin') {
                        Router.go('dashboard');
                    }
                } else {
                    console.log(err);
                    localStorage.removeItem('_storedLoginToken');
                    Router.go('signin');
                }
            });
        } else {
            console.log('Я должен перейти на страницу логина');
            Router.go(( localStorage.getItem('_firstTimeOpenedApp') || null ) == "true" ? 'signin' : 'welcome');
        }
    }
});

Template.AppLayout.rendered = function () {
    app = new Framework7({
        root: '#app',
        name: 'Coined Coin',
        id: 'com.coinedcoin.test',
        clicks: {
            externalLinks: ':not(.tab-link)'
        },
        view: {
            main: true,
            stackPages: true,
            animate: true,
            iosDynamicNavbar: false
        }
    });

    mainView = app.views.create('.view-main');


};

Template.navbar.helpers({
    'navbarF5': function () {
        return {
            title: navbarF7.title.get(),
            left: navbarF7.left.get(),
            right: navbarF7.right.get()
        };
    }
});

Template.toolbar.helpers({
    'list': function () {

        let crn = currentRouterName.get();

        return [
            {name: 'Главная', path: 'index', icon: 'star', isActive: crn == 'index'},
            {name: 'Биржа', path: 'market', icon: 'graph_round', isActive: crn == 'market'},
            {name: 'Кошелёк', path: 'coinList', icon: 'money_dollar', isActive: crn == 'coin'},
            {name: 'Профиль', path: 'profile', icon: 'person', isActive: crn == 'profile'},
        ]
    }
});

Template.inputMask.rendered = function () {
    $(this.firstNode).mask(this.data.mask, {reverse: this.data.reverse ? this.data.reverse : false});
};

// =============== GLOBAL FUNCTIONS

$.fn.animateRotate = function(angle, duration, easing, complete) {
    return this.each(function() {
        var $elem = $(this);

        $({deg: 0}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function(now) {
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};

noticeBell = function() {
    $('#noticeBell').animateRotate(30);
    Meteor.setTimeout(() =>{
        $('#noticeBell').animateRotate(0);
        Meteor.setTimeout(() =>{
            $('#noticeBell').animateRotate(-30);
            Meteor.setTimeout(() => {
                $('#noticeBell').animateRotate(0);
            }, 200)
        }, 200)
    }, 200)


};

appAlert = function (text) {
    app.notification.create({
        subtitle: text,
        closeTimeout: 4000,
        closeOnClick: true
    }).open();
};

getDataFromStruct = function (struct) {

    let data = {};

    for (let key in struct) {

        let el = struct[key];

        if ((_.isUndefined(el.notRequired) || !el.notRequired) && !el.val.length) {
            appAlert('Заполните поле "' + el.field + '"');
            return false;
        }

        data[key] = el.val;
    }

    return data;
};

// =============== GLOBAL FUNCTIONS

// =============== GLOBAL HELPERS


Template.registerHelper('concat', function (op1, op2) {
    return op1 + op2;
});

Template.registerHelper('eq', function (op1, op2) {
    return op1 == op2;
});

Template.registerHelper('niceFormat', function (num) {
    return String(Number(num ? num : 0) + '|').replace(/\d(?=(\d{3})+\|)/g, '$& ').replace('|', '');
});

Template.registerHelper('consoleLog', function (obj) {
    console.log(obj);
});

// =============== GLOBAL HELPERS