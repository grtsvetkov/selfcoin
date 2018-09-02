let edit_status = new ReactiveVar(false),
    coin_name = ReactiveVar('Монета'),
    coin_item = ReactiveVar(),
    wallet_count = new ReactiveVar(0);

Template.coinItem.rendered = function () {

    edit_status.set(false);

    Meteor.setTimeout(() => {
        Meteor.defer(() => {
            app.swiper.create('#coinItem-swiper', {
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets'
                },
                speed: 400,
                slidesPerView: 1,
                direction: 'vertical'
            });
        })
    }, 333);
};

Template.coinItem.helpers({

    'editStatus': () => {
        return edit_status.get();
    },

    'coin_name': () => {
        return coin_name.get();
    },

    'item': () => {
        let _id = Router.current().params._id;

        let item = Coin.findOne({_id: _id});

        if (!item) {
            console.log('ERROR');
            return;
        }

        coin_name.set(item.name);

        let w = Wallet.findOne({user_id: Meteor.userId(), coin_id: _id});

        wallet_count.set(w.count);

        if (item.user_id != Meteor.userId()) {
            item.user = Contact.findOne({owner_id: Meteor.userId(), contact_id: item.user_id});
            item.isMy = false;
        } else {
            item.user = Meteor.user();
            item.user.name = item.user.username;
            item.isMy = true;
        }

        coin_item.set(item);
        return item;
    },

    'condition': () => {
        let ci = coin_item.get();
        return ci ? ci.condition : null;
    },

    'spend': () => {
        let ci = coin_item.get();
        return ci ? ci.spend : null;
    }
});

Template.coinItem.events({

    'click #setEditStatus': (e) => {
        edit_status.set(true);
    },

    'click #logoEdit': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'Конструктор логотипа',
                    onClick: function () {
                        mainView.router.navigate({
                                url: '/coinItemEditLogo',
                                route: {
                                    path: '/coinItemEditLogo',
                                    pageName: 'coinItemEditLogo'
                                }
                            }
                        );
                        coinItemEditLogoReinit();
                    }
                },
                {
                    text: 'Сделать снимок',
                    onClick: function () {
                    }
                },
                {
                    text: 'Выбрать из галереи',
                    onClick: function () {
                    }
                },
                {
                    text: 'Отклонить',
                    onClick: function () {

                    },
                }
            ]
        }).open();
    },

    'click #add_fake_condition': () => {

        let ci = coin_item.get();

        if (ci) {
            ci.condition.push({name: '', price: 0, description: ''})
        }

        coin_item.set(ci);
    },

    'click #add_fake_spend': () => {

        let ci = coin_item.get();

        if (ci) {
            ci.spend.push({name: '', price: 0, description: ''})
        }

        coin_item.set(ci);
    },
    'click #saveEditStatus': (e) => {

        let condition = [],
            spend = [],
            name = $('#edit_name').val(),
            description = $('#edit_description').val();

        if (!name) {
            appAlert('Введите название монеты');
            return;
        }

        if (!description) {
            appAlert('Введите описание монеты');
            return;
        }

        $('.condition_edit').each(function () {
            let name = $(this).find('input[name="condition_name"]').val(),
                price = $(this).find('input[name="condition_price"]').val().replace(/\D+/g, '');

            if (name && price) {
                condition.push({name: name, price: price, description: ''});
            }
        });

        $('.spend_edit').each(function () {
            let name = $(this).find('input[name="spend_name"]').val(),
                price = $(this).find('input[name="spend_price"]').val().replace(/\D+/g, '');

            if (name && price) {
                spend.push({name: name, price: price, description: ''});
            }
        });


        edit_status.set(false);
        Meteor.call('coin.edit', Router.current().params._id, {
            name: name,
            description: description,
            condition: condition,
            spend: spend
        }, (err) => {
            appAlert('Изменения успешно сохранены');
        });
    },

    'click .goTo_coinItemParty': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/coinItemParty',
                route: {
                    path: '/coinItemParty',
                    pageName: 'coinItemParty'
                }
            }
        );
    },

    'click .info-icon': (e) => {

        e.preventDefault();

        let dataset = e.currentTarget.dataset;

        let coin = coin_item.get();

        if (dataset.edit && dataset.edit == "true") {
            app.popup.create({
                content: `<div id="advInfoPopup" class="popup">
            <div class="navbar">
            <div class="navbar-inner navbar-current">
            <div class="left"><a href="#" onclick="app.popup.close(\'#advInfoPopup\', true)"
                                     class="link back"><i class="icon icon-back" style=""></i></a></div>
            <div class="title">` + coin[dataset.type][dataset.index].name + `</div>
            <div class="right"></div>
            </div>
            </div>
            <div class="block">` +
                '<p><input type="text" value="' + coin[dataset.type][dataset.index].name + '" /></p>' +
                '<p><input type="tel" value="' + coin[dataset.type][dataset.index].price + '" /></p>' +
                '<p><textarea>' + coin[dataset.type][dataset.index].description + '</textarea></p>' +
                '</div>' +
                '</div>'
            }).open()
        } else {
            app.popup.create({
                content: `<div id="advInfoPopup" class="popup">
            <div class="navbar">
            <div class="navbar-inner navbar-current">
            <div class="left"><a href="#" onclick="app.popup.close(\'#advInfoPopup\', true)"
                                     class="link back"><i class="icon icon-back" style=""></i></a></div>
            <div class="title">` + coin[dataset.type][dataset.index].name + `</div>
            <div class="right"></div>
            </div>
            </div>
            <div class="block">
            <p>` + coin.name + '</p>' +
                '<p>' + coin[dataset.type][dataset.index].name + '</p>' +
                '<p>' + coin[dataset.type][dataset.index].price + '</p>' +
                '<p>' + coin[dataset.type][dataset.index].description + '</p>' +
                '</div>' +
                '</div>'
            }).open()
        }
    },


    'click .actionEnroll': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'Принять',
                    onClick: function () {
                        Meteor.call('wallet.approveEnroll', e.currentTarget.dataset.id, function () {
                            appAlert('Зачисление прошло успешно!');
                        });
                    },
                    color: 'green'
                },
                {
                    text: 'Отклонить',
                    onClick: function () {

                    },
                    color: 'red'
                },
                {
                    text: 'Подробнее',
                    onClick: function () {

                    }
                }
            ]
        }).open();
    },

    'click .actionOffs': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'Принять',
                    onClick: function () {
                        Meteor.call('wallet.approveOffs', e.currentTarget.dataset.id, function () {
                            appAlert('Списание прошло успешно!');
                        });
                    },
                    color: 'green'
                },
                {
                    text: 'Отклонить',
                    onClick: function () {

                    },
                    color: 'red'
                },
                {
                    text: 'Подробнее',
                    onClick: function () {

                    }
                }
            ]
        }).open();
    },

    'click .enroll': (e) => { //Запрос на зачисление

        if (e.isDefaultPrevented()) {
            return;
        }

        let data = e.currentTarget.dataset,
            coin = Coin.findOne({_id: Router.current().params._id});

        let list = [];


        list.push({
            text: '<div class="action-small">Запрос на зачисление "' + data.name + '"&#160;&#160;&#160;&#160;&#160;&#160;&#160; за ' + data.price + '</div>',
            onClick: function (a) {

                Meteor.call('wallet.requestEnroll', coin._id, data.price, data.name, ()=> {
                    appAlert('Успешный запрос на зачисление');
                });
            }
        });

        list.push({
            text: '<div class="action-small">Отмена</div>',
            color: 'red'
        });

        app.actions.create({
            coin_id: coin._id,
            buttons: list
        }).open();
    },

    'click .offs': (e) => {  //Запрос на списание

        if (e.isDefaultPrevented()) {
            return;
        }

        let data = e.currentTarget.dataset,
            coin = Coin.findOne({_id: Router.current().params._id});

        let list = [];

        if (data.price <= wallet_count.get()) {
            list.push({
                text: '<div class="action-small">Запрос на списание "' + data.name + '"&#160;&#160;&#160;&#160;&#160;&#160;&#160; за ' + data.price + '</div>',
                onClick: function (a) {

                    Meteor.call('wallet.requestOffs', coin._id, data.price, data.name, ()=> {
                        appAlert('Успешный запрос на списание');
                    });
                }
            })
        } else {
            list.push({
                text: '<div class="action-small">Добавить в цели "' + data.name + '"&#160;&#160;&#160;&#160;&#160;&#160;&#160; за ' + data.price + '</div>',
                onClick: function (a) {

                    Meteor.call('wallet.requestOffs', coin._id, data.price, data.name, ()=> {
                        appAlert('Успешный запрос на списание');
                    });
                }
            })
        }

        list.push({
            text: '<div class="action-small">Отмена</div>',
            color: 'red'
        });

        app.actions.create({
            coin_id: coin._id,
            buttons: list
        }).open();
    }
});
