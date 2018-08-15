let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.coinList.helpers({
    'wallet_list': function () {
        let coin = Coin.find({owner: Meteor.userId()}).fetch();

        _.each(coin, function(i, key){
            i.wallet = Wallet.findOne({coin_id: i._id, user_id: Meteor.userId()});
            i.img = '/asserts/img/' + tmpList1[key] + '.png';
            i.isPublic = _.random(0, 1) > 0 ? true : false;
            i.isMy = i.user_id == Meteor.userId();
        });
        
        return coin;
    },

    'notice': function() {
        let count = 0;

        _.each(Coin.find({user_id: Meteor.userId()}).fetch(), function(i){
            count += RequestEnroll.find({coin_id: i._id}).count();
        });

        return count;
    },

    'request_list': function() {
        let coin = Coin.find({request: Meteor.userId()}).fetch();

        _.each(coin, function(i){
            let request = RequestForParty.findOne({from_user: i.user_id});

            i.creator = request.name;
            i.request_id = request._id;
        });

        return coin;
    },

    'backgroundByIndex': function (index) {
        return index % 2 == 0 ? 'string2' : 'string1';
    }
});

Template.coinList.events({

    'click #noticeBell': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/coinNotice',
                route: {
                    path: '/coinNotice',
                    pageName: 'coinNotice'
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
                        Meteor.call('requestForParty.approve', e.currentTarget.dataset.id, function() {
                            appAlert('Вы успешно добавлены к монете!');
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