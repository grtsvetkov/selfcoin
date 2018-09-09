let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.coinList.helpers({
    'wallet_list': function () {
        let coin = Coin.find({owner: Meteor.userId()}).fetch();

        _.each(coin, function (i, key) {
            i.wallet = Wallet.findOne({coin_id: i._id, user_id: Meteor.userId()});
            i.img = '/assets/img/' + tmpList1[key] + '.png';
            i.isPublic = _.random(0, 1) > 0 ? true : false;
            i.isMy = i.user_id == Meteor.userId();
        });

        return coin;
    },

    'request': function () {
        let count = 0;

        _.each(Coin.find({user_id: Meteor.userId()}).fetch(), function (i) {
            count += RequestEnroll.find({coin_id: i._id}).count();
        });

        count += Coin.find({request: Meteor.userId()}).count();

        return count;
    }
});

Template.coinList.events({

    'click #requestFlag': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/coinRequest',
                route: {
                    path: '/coinRequest',
                    pageName: 'coinRequest'
                }
            }
        );
    },

    'click .goToMoney': (e) => {
        let _id = e.currentTarget.dataset.id;

        Router.go('coinItem', {_id: _id});
    },

    'click .actionRequest': (e) => {
        app.actions.create({
            buttons: [
                {
                    text: 'Принять',
                    onClick: function () {
                        Meteor.call('requestForParty.approve', e.currentTarget.dataset.id, function () {
                            appAlert('Вы успешно добавлены в участики монеты!');
                        });
                    }
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

                    },
                    color: 'green'
                }
            ]
        }).open();
    }
});