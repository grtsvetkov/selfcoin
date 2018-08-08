Template.profile.events({
    'click #goTo_profileEdit': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/profileEdit',
                route: {
                    path: '/profileEdit',
                    pageName: 'profileEdit'
                }
            }
        );
    },

    'click #logout': () => {
        Meteor.logout();
        Router.go('/signin');
    }
});

Template.profileEdit.passwordEdit = (e) => {
    e.preventDefault();
    appAlert('Пароль успешно изменён');
    //app.popup.create({el: '#editPasswordPopup'}).close();
};

Template.profileEdit.events({

    'click #saveButton': (e) => {
        e.preventDefault();
        appAlert('Изменения сохранены');
    },

    'click #editPasswordButton': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/profileEditPassword',
                route: {
                    path: '/profileEditPassword',
                    pageName: 'profileEditPassword'
                }
            }
        );
        //app.popup.create({el: '#editPasswordPopup'}).open();
    }
});