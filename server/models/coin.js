CoinModel = {
    add: function (data) {
        data.user_id = Meteor.userId();

        if(!data.user_id || !data.name) {
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
            request: []
        });

        WalletModel.enroll(coin_id, Meteor.userId(), 0, 'Добавление участника');

        return coin_id;
    },
    
    _addOwner: function(coin_id, user_id) {
        Coin.update({_id: coin_id}, {$addToSet: { owner: user_id } });
    },

    _addRequest: function(coin_id, user_id) {
        Coin.update({_id: coin_id}, {$addToSet: { request: user_id } });
    },

    _removeRequest: function(coin_id, user_id) {
        Coin.update({_id: coin_id}, { $pull: { request: user_id } });
    }
};

/**
 * Методы Coin
 */
Meteor.methods({
    'coin.add': CoinModel.add //Создание новой монеты
});