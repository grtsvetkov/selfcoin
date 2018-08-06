WalletModel = {
    enroll: function (coin_id, to_user, count, description) {
        let owner = Coin.findOne({_id: coin_id, user_id: Meteor.userId()});

        if (!owner) { //Нет такой монеты
            return;
        }

        count = Math.trunc(count);

        let currentW = Wallet.findOne({user_id: to_user, coin_id: coin_id});

        if (!currentW) { //Нет такого кошелька у пользователя - создаём
            currentW = {user_id: to_user, coin_id: coin_id, count: 0};
            currentW._id = Wallet.insert(currentW);
        }

        //Добавляем новое колличество монет в кошелёк
        Wallet.update({_id: currentW._id}, {$set: {count: ( currentW.count + count)}});

        //Записываем данную операцию в коллекцию логов
        WalletLog.insert({
            user_id: to_user, dt: new Date, coin_id: coin_id, count: count, data: {
                from_user: Meteor.userId(),
                wallet_id: currentW._id,
                description: description ? description : ''
                
            }
        });
    }
};

/**
 * Методы Wallet
 */
Meteor.methods({
    'wallet.enroll': WalletModel.enroll
});