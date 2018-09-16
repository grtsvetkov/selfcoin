import Framework7 from "framework7";
import "framework7/css/framework7.min.css";
import "framework7-icons";
import "jquery-mask-plugin";

app = null,
    mainView = null;

let flag_welcome = localStorage.getItem('_firstTimeOpenedApp') || null;

if (flag_welcome != "true") {
    localStorage.setItem('_firstTimeOpenedApp', true);
    Router.go('welcome');
}

Meteor.subscribe('avatar128');
Meteor.subscribe('logo128');

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

Template.AppLayout.helpers({
    'toolbarEnabled': () => {
        return ['welcome', 'signin'].indexOf(Router.current().route.getName()) > -1 ? false : true;
    }
});

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
            {name: 'Кошелёк', path: 'coinList', icon: 'money_dollar', isActive: crn == 'coin'},
            //{name: 'Биржа', path: 'market', icon: 'graph_round', isActive: crn == 'market'},
            {name: 'Уведомления', path: 'notice', icon: 'bell', isActive: crn == 'notice'},
            {name: 'Профиль', path: 'profile', icon: 'person', isActive: crn == 'profile'}
        ]
    }
});


let phoneFirstInputFix = function (value, event) {
    if (value == '+7 (8') {
        event.target.value = '+7 ('
    }
};

Template.inputMask.rendered = function () {

    let options = {reverse: this.data.reverse ? this.data.reverse : false, placeholder: this.data.placeholder};

    if (this.data.isPhone) {
        options.onKeyPress = phoneFirstInputFix;
    }

    $(this.firstNode).mask(this.data.mask, options);
};

// =============== GLOBAL FUNCTIONS

$.fn.animateRotate = function (angle, duration, easing, complete) {
    return this.each(function () {
        var $elem = $(this);

        $({deg: 0}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function (now) {
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};

requestFlag = function () {
    $('#requestFlag').animateRotate(30);
    Meteor.setTimeout(() => {
        $('#requestFlag').animateRotate(0);
        Meteor.setTimeout(() => {
            $('#requestFlag').animateRotate(-30);
            Meteor.setTimeout(() => {
                $('#requestFlag').animateRotate(0);
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

let randomString = function () {
    let digits = [],
        str = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
    for (let i = 0; i < 20; i++) {
        digits[i] = str.substr(Math.floor(Math.random() * str.length), 1);
    }
    return digits.join("");
};

// =============== GLOBAL FUNCTIONS


// =============== GLOBAL HELPERS


Template.registerHelper('coinLogo', function (logo, sizeString) {

    let size = sizeString.split('x');

    if (logo && logo.type) {
        switch (logo.type) {
            case 'standart':

                let img_id = randomString();

                $.get('/assets/standart/' + logo.name + '.svg').done(function (data) {

                    if(logo.colors) {
                        //console.log(img_id,  $('#' + img_id).find('defs').html());
                        $(data).find('defs>style').html('.fil'+img_id+' {fill:url(#'+img_id+'_lg)}' );
                        $(data).find('defs>linearGradient').attr('id', img_id+'_lg');
                        $(data).find('defs>linearGradient stop[offset=0]').css({'stop-color': logo.colors.start});
                        $(data).find('defs>linearGradient stop[offset=1]').css({'stop-color': logo.colors.stop});
                        $(data).find('path').attr('class', 'fil'+img_id);
                    }

                    $('#'+img_id).append($(data).find('defs')[0]);
                    $('#'+img_id).append($(data).find('path')[0]);


                    //$('#'+img_id).find('path').attr('fill', logo.color);
                 });

                return '<svg class="coinLogo" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" id="'+img_id+'" width="'+size[0]+'" height="'+size[1]+'" viewBox="0 0 256 256"></svg>';

                break;

            case 'file':

                let logoFile = Logo128.findOne({originalId: logo._id});

                if(logoFile) {

                    if(logoFile.uploading) {
                        return '<div class="preloader" style="width: 44px; height: 44px"></div>';
                    } else {
                        return '<img class="coinLogo" src="'+logoFile.url+'?token='+logoFile.token+'" width="'+size[0]+'" height="">';
                    }
                } else {
                    return '<div class="preloader" style="width: 44px; height: 44px"></div>';
                }

                break;
        }
    } else {
        return '<img src="/assets/img/default.svg" width="'+size[0]+'" height="">';
    }
});

Template.registerHelper('avatarImg', function (user_id) {
    let avatar128 = Avatar128.findOne({userId: user_id}, {sort: { uploadedAt: -1 }});

    if(avatar128) {
        if(avatar128.uploading) {
            return '<div class="preloader" style="width: 44px; height: 44px"></div>';
        } else {

            let url = avatar128.url+'?token='+avatar128.token;

            return '<img class="avatar" src="'+url+'">';
        }
    } else {
        return '<div class="preloader" style="width: 44px; height: 44px"></div>';
    }
});

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