let selected_party_item = new ReactiveVar();

Template.coinItem.rendered = function () {
    selected_party_item.set(false);
};

Template.coinItem.helpers({
    'item': () => {
        let _id = Router.current().params._id;

        let item = Coin.findOne({_id: _id});

        if (item.user_id != Meteor.userId()) {
            item.user = Contact.findOne({owner_id: Meteor.userId(), contact_id: item.user_id});
            item.isMy = false;
        } else {
            item.user = Meteor.user();
            item.user.name = item.user.username;
            item.isMy = true;
        }

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

    'click .actionEnroll': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'Принять',
                    onClick: function () {
                        Meteor.call('wallet.approveEnroll', e.currentTarget.dataset.id, function() {
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
                        Meteor.call('wallet.approveOffs', e.currentTarget.dataset.id, function() {
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

    'click #enroll': (e) => {
        e.preventDefault();

        let coin = Coin.findOne({_id: Router.current().params._id});

        let list = [];

        _.each(coin.condition, (i) => {

            let name = i.name.length > 25 ? i.name.substring(0, 22) + '...' : i.name;

            list.push({
                text: '<div class="action-small">' + name + '&#160;&#160;&#160;&#160;&#160;&#160;&#160;' + i.price + '</div>',
                onClick: function (a) {
                    console.log(a.params);

                    Meteor.call('wallet.requestEnroll', a.params.coin_id, i.price, i.name, ()=> {
                        appAlert('Успешный запрос на зачисление');
                    });
                }
            })
        });

        list.push({
            text: '<div class="action-small">Другое</div>',
            color: 'greed'
        });

        list.push({
            text: '<div class="action-small">Я передумал</div>',
            color: 'red'
        });

        app.actions.create({
            coin_id: coin._id,
            buttons: list
        }).open();
    },

    'click #offs': (e) => {
        e.preventDefault();

        let coin = Coin.findOne({_id: Router.current().params._id});

        let list = [];

        _.each(coin.spend, (i) => {

            let name = i.name.length > 25 ? i.name.substring(0, 22) + '...' : i.name;

            list.push({
                text: '<div class="action-small">' + name + '&#160;&#160;&#160;&#160;&#160;&#160;&#160;' + i.price + '</div>',
                onClick: function (a) {
                    console.log(a.params);

                    Meteor.call('wallet.requestOffs', a.params.coin_id, i.price, i.name, ()=> {
                        appAlert('Успешный запрос на списание');
                    });
                }
            })
        });

        list.push({
            text: '<div class="action-small">Другое</div>',
            color: 'greed'
        });

        list.push({
            text: '<div class="action-small">Я передумал</div>',
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
            text: '<div class="action-small">Я передумал</div>',
            color: 'red'
        });

        app.actions.create({
            contact_id: contact_id,
            coin_id: coin._id,
            buttons: list
        }).open();
    }
});