let signinAction = new ReactiveVar(1);

Template.signin.rendered = function() {
    signinAction.set('phone');
};

Template.signin.helpers({
    'action': function() {
        return signinAction.get();
    }
});

Template.signin.events({
    'click #sendPhone': function() {
        app.dialog.progress('Отправка смс кода');
        setTimeout(function () {
            app.dialog.close();
            signinAction.set('code');
        }, 3000);
    },

    'click #sendCode': function() {
        app.dialog.progress('Проверка кода');
        setTimeout(function () {
            app.dialog.close();
            Router.go('index')
        }, 3000);
    }
});