let selected_party_item = new ReactiveVar(false);

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
                contact_id: i.contact_id,
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
        let id = e.currentTarget.dataset.id;
        if (id) {
            selected_party_item.set(id);
            mainView.router.navigate({
                    url: '/coinItemPartyItem',
                    route: {
                        path: '/coinItemPartyItem',
                        pageName: 'coinItemPartyItem'
                    }
                }
            );
        }
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
            appAlert('Запрос на добавление отправлен участнику');
        });
    }
});

Template.coinItemPartyItemCreate.events({
    'click #create': function () {

        let phone = $('#phone').val().replace(/\D+/g, '');

        if (phone.length != 11) {
            appAlert('Введите корректный номер телефона');
            return;
        }

        let data = getDataFromStruct({
            name: {val: $('#name').val(), field: 'Название'},
            phone: {val: phone, field: 'Телефон'}
        });

        if (data === false) {
            return;
        }

        Meteor.call('contact.add', data.phone, data.name, 'Описание контакта', '', function (err, data) {
            if (err) {
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
