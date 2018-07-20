Template.profile.events({
    'click #goTo_profileEdit': (e) => {
        e.preventDefault();

        navbarF7.left.set('<a href="#" onclick="event.preventDefault();mainView.router.back(\'/profile\');navbarF7.left.set(false);" class="link back"><i class="icon icon-back" style=""></i><span class="ios-only">Назад</span></a>')

        mainView.router.navigate({
                url: '/profileEdit',
                route: {
                    path: '/profileEdit',
                    pageName: 'profileEdit'
                }
            }
        );
    }
})

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