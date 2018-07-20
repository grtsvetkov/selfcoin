let signinAction = new ReactiveVar('phone'),
    phone = false,
    init = function () {
        signinAction.set('phone');
        phone = false;
        //currentBackButton.set(false);
        $('#phone').val('');
        Meteor.setTimeout(function () {
            $('#phone').focus();
        }, 555);

    };


Template.signinBlock.renderedF7 = function () {
    init();
};

Template.signinBlock.helpers({
    'action': function () {
        return signinAction.get();
    }
});

Template.signinBlock.events({

    'click .item-input': (e) => {
        $(e.currentTarget).find('input').focus();
    },

    'click #sendPhone': function () {

        phone = $('#phone').val().replace(/\D+/g, '');

        if (phone.length != 11) {
            appAlert('Введите корректный номер телефона');
            return;
        }

        app.dialog.progress('Отправка смс кода');

        Meteor.call('accounts-phone.sendVerificationCode', phone, function (err) {
            app.dialog.close();

            if (err) {
                appAlert(err.reason);
            } else {
                signinAction.set('code');
                //currentBackButton.set({onclick: '$(\'#fackeBackButton\').click()'});
                Meteor.setTimeout(function () {
                    $('#code').focus();
                }, 555);
            }
        });
    },

    'click #sendCode': function () {
        app.dialog.progress('Проверка кода');

        let code = $('#code').val();

        if (!code || code.length != 4) {
            appAlert('Введите корректный код');
            return;
        }

        Accounts.callLoginMethod({
            methodArguments: [{
                phone: phone,
                code: code
            }],
            userCallback: function (err) {
                app.dialog.close();

                if (err) {
                    appAlert('Код подтверждения введен неверно');
                    console.log(err);
                } else {
                    localStorage.setItem('_storedLoginToken', Accounts._storedLoginToken());
                    Router.go('index');
                }
            }
        });
    }
});