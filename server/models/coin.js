CoinModel = {
    add: function (data) {
        data.user_id = Meteor.userId();

        if (!data.user_id || !data.name) {
            return;
        }

        let coin_id = Coin.insert({
            user_id: data.user_id,
            name: String(data.name),
            description: data.description ? String(data.description) : '',
            public: Boolean(data.public),
            condition: data.condition,
            spend: data.spend,
            count: 0,
            owner: [],
            request: [],
            logo: {}
        });

        WalletModel.enroll(coin_id, Meteor.userId(), 0, 'Добавление участника');

        return coin_id;
    },

    edit: (coin_id, data) => {
        let coin = Coin.findOne({_id: coin_id, user_id: Meteor.userId()});

        if (!coin) {
            throw new Meteor.Error('01', 'Ошибка редактирования монеты');
        }

        _.each(data, (val, key) => {

            if (['name', 'description', 'condition', 'spend'].indexOf(key) > -1) {

                let s = {};
                s[key] = val;

                Coin.update({_id: coin_id, user_id: Meteor.userId()}, {$set: s});
            }
        });
    },

    _addOwner: function (coin_id, user_id) {
        Coin.update({_id: coin_id}, {$addToSet: {owner: user_id}});
    },

    _addRequest: function (coin_id, user_id) {
        Coin.update({_id: coin_id}, {$addToSet: {request: user_id}});
    },

    _removeRequest: function (coin_id, user_id) {
        Coin.update({_id: coin_id}, {$pull: {request: user_id}});
    },

    _recalcCount: function (coin_id) {

        let count = 0;

        _.each(Wallet.find({coin_id: coin_id}).fetch(), (i) => {
            count += i.count;
        });

        Coin.update({_id: coin_id}, {$set: {count: count}});
    },


    setStandartLogo: (coin_id, name, colors) => {
        let coin = Coin.findOne({_id: coin_id, user_id: Meteor.userId()});

        if (!coin) {
            throw new Meteor.Error('01', 'Ошибка редактирования монеты');
        }


        Coin.update({_id: coin._id}, {
            $set: {
                logo: {
                    type: 'standart',
                    name: name,
                    colors: colors
                }
            }
        })
    },

    setFileLogo: (coin_id, file_id) => {
        let coin = Coin.findOne({_id: coin_id, user_id: Meteor.userId()});

        if (!coin) {
            throw new Meteor.Error('01', 'Ошибка редактирования монеты');
        }

        Coin.update({_id: coin._id}, {
            $set: {
                logo: {
                    type: 'file',
                    _id: file_id
                }
            }
        })
    }
};

/**
 * Методы Coin
 */
Meteor.methods({
    'coin.add': CoinModel.add, //Создание новой монеты
    'coin.edit': CoinModel.edit,
    'coin.setStandartLogo': CoinModel.setStandartLogo, //
    'coin.setFileLogo': CoinModel.setFileLogo //
});