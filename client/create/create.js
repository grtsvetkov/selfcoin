let condition = new ReactiveVar(),
    spend = new ReactiveVar(),

    firstTimeHelperFlag = new ReactiveVar(false);

Template.create.rendered = function () {
    //currentBackButton.set({href:'/mycoin'});
    condition.set([1]);
    spend.set([1]);

    firstTimeHelperFlag.set(false);

    localStorage.setItem('_create_coin_firstTimeFlag_ne', false); //FOR TEST
};

Template.create.helpers({
    'firstTime': function() {

        let firstTimeFlag = localStorage.getItem('_create_coin_firstTimeFlag_ne') || false;

        if (firstTimeFlag != "true" && !firstTimeHelperFlag.get()) {
            localStorage.setItem('_create_coin_firstTimeFlag_ne', true);

            Meteor.setTimeout(() => {
                Meteor.defer(() => {
                    let mySwiper = app.swiper.create('.welcome', {
                        touchEventsTarget: 'wrapper',
                        speed: 400,
                        on: {
                            slideChangeTransitionStart: function () {
                                if (mySwiper.activeIndex == 3) {
                                    firstTimeHelperFlag.set(Math.random());
                                }
                            }
                        }
                    });
                })
            }, 333);

            return true;
        }

        return false;
    },

    'list_condition': function () {
        return condition.get();
    },

    'list_spend': function () {
        return spend.get();
    },

    'backgroundByIndex': function (index) {
        return index % 2 == 0 ? 'string2' : 'string1';
    }
});

Template.create.events({
    'click #add_condition': function (e) {

        let tmp = condition.get();

        tmp.push(1);

        condition.set(tmp);
    },

    'click #add_spend': function () {

        let tmp = spend.get();

        tmp.push(1);

        spend.set(tmp);
    },

    'click #createCoin': function () {
        let data = getDataFromStruct({
            name: {val: $('#name').val(), field: 'Название монеты'},
            description: {val: $('#description').val(), field: 'Описание', notRequired: true},
            public: {val: $('#public').is(':checked'), field: 'Публичная', notRequired: true}
        });

        if (data === false) {
            return;
        }

        data.condition = [];

        $('#list_condition li').each(function () {

            let name = $(this).find('input[name=name]').val(),
                price = $(this).find('input[name=price]').val(),
                description = $(this).find('textarea').val();

            if (name && price.replace(/\D+/g, '')) {
                data.condition.push({
                    name: name,
                    price: price.replace(/\D+/g, ''),
                    description: description
                })
            }
        });

        data.spend = [];

        $('#list_spend li').each(function () {

            let name = $(this).find('input[name=name]').val(),
                price = $(this).find('input[name=price]').val(),
                description = $(this).find('textarea').val();

            if (name && price.replace(/\D+/g, '')) {
                data.spend.push({
                    name: name,
                    price: price.replace(/\D+/g, ''),
                    description: description
                })
            }
        });

        app.dialog.progress('Создание монеты');
        Meteor.call('coin.add', data, function (err, data) {
            app.dialog.close();
            if (err) {
                appAlert(err.reason);
            } else {
                Router.go('coinItem', {_id: data});
            }
        });
    }
});