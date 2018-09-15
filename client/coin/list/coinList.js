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

    'goal_list': function () {
        let goal = Goal.find({user_id: Meteor.userId()}).fetch();

        let max_width_goal = 60;
        let min_width_goal = 20;

        _.each(goal, function (i, key) {
            let coin = Coin.findOne({_id: i.coin_id});
            let wallet = Wallet.findOne({coin_id: i.coin_id, user_id: Meteor.userId()})

            i.logo = coin.logo;
            i.coin_name = coin.name;
            i.coin_id = coin._id;
            i.count = wallet.count;
            i.progress = Math.ceil(i.count * 100 / i.price);
            i.backgroundHeper = _.times(50, function (n) {
                return n
            });


            i.progress = i.progress > 100 ? 100 : i.progress;
            i.gw = Math.ceil(min_width_goal + ( (max_width_goal - min_width_goal) * i.progress / 100 ));

            /*i.wallet = Wallet.findOne({coin_id: i._id, user_id: Meteor.userId()});
             i.img = '/assets/img/' + tmpList1[key] + '.png';
             i.isMy = i.user_id == Meteor.userId();*/
        });

        return goal;
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

    'click .goal-item': (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }

        let data = e.currentTarget.dataset;

        let list = [{
            text: '<div class="action-small">Удалить цель</div>',
            color: 'red',
            onClick: function (a) {

                Meteor.call('goal.delete', data.id, ()=> {
                    appAlert('Успешное удаление в цели');
                });
            }
        }];

        if(parseInt(data.count) >= parseInt(data.price)) {
            list.push({
                text: '<div class="action-small">Запрос на списание "' + data.name + '"&#160;&#160;&#160;&#160;&#160;&#160;&#160; за ' + data.price + '</div>',
                onClick: function (a) {

                    Meteor.call('wallet.requestOffs', data.coin_id, data.price, data.name, ()=> {
                        appAlert('Успешный запрос на списание');
                        Meteor.call('goal.delete', data.id);
                    });
                }
            });
        }

        app.actions.create({
            _id: data.id,
            name: data.name,
            count: data.count,
            price: data.price,
            buttons: list
        }).open();
    },

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