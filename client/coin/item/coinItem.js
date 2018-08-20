let selected_party_item = new ReactiveVar();

let coin_name = ReactiveVar('Монета'),
    coin_item = ReactiveVar(),
    wallet_count = new ReactiveVar(0);

Template.coinItem.rendered = function () {
    selected_party_item.set(false);

    Meteor.setTimeout(() => {
        Meteor.defer(() => {
            let mySwiper = app.swiper.create('#coinItem-swiper', {
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                },
                speed: 400,
                slidesPerView: 1,
                direction: 'vertical'
            });
        })
    }, 333);
};

Template.coinItem.helpers({

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

    'request_enroll': () => {
        let list = RequestEnroll.find({coin_id: Router.current().params._id, type: 'enroll'}).fetch();

        _.each(list, function (item) {
            console.log(item);
            if (item.user_id != Meteor.userId()) {
                item.user = Contact.findOne({owner_id: Meteor.userId(), contact_id: item.user_id});
                item.isMy = false;
            } else {
                item.user = Meteor.user();
                item.user.name = item.user.username;
                item.isMy = true;
            }
        });

        return list;
    },

    'request_offs': () => {
        let list = RequestEnroll.find({coin_id: Router.current().params._id, type: 'offs'}).fetch();

        _.each(list, function (item) {
            console.log(item);
            if (item.user_id != Meteor.userId()) {
                item.user = Contact.findOne({owner_id: Meteor.userId(), contact_id: item.user_id});
                item.isMy = false;
            } else {
                item.user = Meteor.user();
                item.user.name = item.user.username;
                item.isMy = true;
            }
        });

        return list;
    },

    'backgroundByIndex': (index) => {
        return index % 2 == 0 ? 'string2' : 'string1';
    }
});

Template.coinItem.events({
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

Template.coinItemParty.helpers({
    'contact_list': () => {

        let list = {};

        _.each(Wallet.find({coin_id: Router.current().params._id}).fetch(), function (w) {

            let i = false;

            if (w.user_id == Meteor.userId()) {
                i = Meteor.user();
                i.name = i.username;
            } else {
                i = Contact.findOne({contact_id: w.user_id});
            }

            if (!i) {
                return;
            }

            if (!list[i.name.substr(0, 1).toUpperCase()]) {
                list[i.name.substr(0, 1).toUpperCase()] = [];
            }

            list[i.name.substr(0, 1).toUpperCase()].push({
                _id: i.contact_id,
                name: i.name,
                username: i.contact_id
            });
        });

        return _.map(list, (l, key) => {
            return {
                litera: key,
                list: l
            }
        })
    }
});

Template.coinItemParty.events({
    'click .coinItemPartyAdd': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'По номеру телефона',
                    onClick: function () {
                        mainView.router.navigate({
                                url: '/coinItemPartyItemCreate',
                                route: {
                                    path: '/coinItemPartyItemCreate',
                                    pageName: 'coinItemPartyItemCreate'
                                }
                            }
                        );
                    }
                },
                {
                    text: 'Из контактов',
                    onClick: function () {
                        mainView.router.navigate({
                                url: '/coinItemPartyAdd',
                                route: {
                                    path: '/coinItemPartyAdd',
                                    pageName: 'coinItemPartyAdd'
                                }
                            }
                        );
                    }
                }
            ]
        }).open();
    },

    'click .partyItem': (e) => {
        selected_party_item.set(e.currentTarget.dataset.id);
        mainView.router.navigate({
                url: '/coinItemPartyItem',
                route: {
                    path: '/coinItemPartyItem',
                    pageName: 'coinItemPartyItem'
                }
            }
        );
    }
});

Template.coinItemPartyAdd.helpers({
    'contact_list': () => {

        let list = {};

        _.each(Contact.find({owner_id: Meteor.userId()}).fetch(), function (i) {

            if (!list[i.name.substr(0, 1).toUpperCase()]) {
                list[i.name.substr(0, 1).toUpperCase()] = [];
            }

            list[i.name.substr(0, 1).toUpperCase()].push({
                _id: i.contact_id,
                name: i.name,
                username: i.contact_id
            });
        });

        return _.map(list, function (l, key) {
            return {
                litera: key,
                list: l
            }
        })
    }
});

Template.coinItemPartyAdd.events({
    'click .itemAdd': (e) => {
        Meteor.call('wallet.enroll', Router.current().params._id, e.currentTarget.dataset.id, 0, 'Добавление участника', () => {
            mainView.router.back('/coinItemParty');
            appAlert('Запрос на добавление отправле участнику');
        });
    }
});


Template.coinItemPartyItemCreate.events({
    'click #create': function() {

        let phone = $('#phone').val().replace(/\D+/g, '');

        if (phone.length != 11) {
            appAlert('Введите корректный номер телефона');
            return;
        }

        let data = getDataFromStruct({
            name: {val: $('#name').val(), field: 'Название'},
            phone: {val: phone, field: 'Телефон'}
        });

        if(data === false) {
            return;
        }

        Meteor.call('contact.add', data.phone, data.name, 'Описание контакта', '',  function(err, data){
            if(err) {
                appAlert(err.reason);
                console.log(err);
            } else {
                appAlert('Контакт успешно добавлен');
                Meteor.call('wallet.enroll', Router.current().params._id, data, 0, 'Добавление участника', () => {
                    mainView.router.back('/coinItemParty');
                    appAlert('Запрос на добавление отправле участнику');
                });
                
            }
        });
    }
});

Template.coinItemPartyItem.helpers({
    'item': () => {
        let contact_id = selected_party_item.get();

        let contact = Contact.findOne({contact_id: contact_id});

        let coin = Coin.findOne({_id: Router.current().params._id});

        let wallet = Wallet.findOne({coin_id: Router.current().params._id, user_id: contact_id});

        return {
            contact: contact,
            coin: coin,
            wallet: wallet
        };
    }
});

Template.coinItemPartyItem.events({
    'click #enroll': function () {

        let contact_id = selected_party_item.get();

        let coin = Coin.findOne({user_id: Meteor.userId(), _id: Router.current().params._id});

        let list = [];

        _.each(coin.condition, (i) => {

            let name = i.name.length > 25 ? i.name.substring(0, 22) + '...' : i.name;

            list.push({
                text: '<div class="action-small">' + name + '&#160;&#160;&#160;&#160;&#160;&#160;&#160;' + i.price + '</div>',
                onClick: function (a) {
                    console.log(a.params);

                    Meteor.call('wallet.enroll', a.params.coin_id, a.params.contact_id, i.price, i.name, ()=> {
                        appAlert('Успешное зачисление');
                    });
                }
            })
        });

        list.push({
            text: '<div class="action-small">Другое</div>',
            color: 'greed'
        });

        list.push({
            text: '<div class="action-small">Отмена</div>',
            color: 'red'
        });

        app.actions.create({
            contact_id: contact_id,
            coin_id: coin._id,
            buttons: list
        }).open();
    }
});

