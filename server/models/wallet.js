WalletModel = {
    enroll: function (coin_id, to_user_id, count, description) {
        WalletModel._enroll(Meteor.userId(), coin_id, to_user_id, count, description)
    },

    _enroll: function (creator, coin_id, to_user_id, count, description) {
        let owner = Coin.findOne({_id: coin_id, user_id: creator});

        if (!owner) { //Нет такой монеты
            return;
        }


        let to_user = Meteor.users.findOne({_id: to_user_id});

        if(!to_user) {
            return;
        }

        count = Math.trunc(count);

        let currentW = Wallet.findOne({user_id: to_user_id, coin_id: coin_id});

        if (!currentW) { //Нет такого кошелька у пользователя - создаём
            currentW = {user_id: to_user_id, coin_id: coin_id, count: 0};
            currentW._id = Wallet.insert(currentW);

            if(to_user_id == creator) {
                CoinModel._addOwner(coin_id, to_user_id);
            } else {
                RequestForPartyModel.add(to_user_id, coin_id);
                return;
            }
        }

        //Добавляем новое колличество монет в кошелёк
        Wallet.update({_id: currentW._id}, {$set: {count: ( currentW.count + count)}});

        //Записываем данную операцию в коллекцию логов
        WalletLog.insert({
            user_id: to_user_id, dt: new Date, coin_id: coin_id, count: count, data: {
                from_user: creator,
                wallet_id: currentW._id,
                description: description ? description : ''

            }
        });

        let twilioClient = require('twilio')(twilioConfig.sid, twilioConfig.token);

        twilioClient.messages.create({
            to: '+' + to_user.username,
            from: twilioConfig.from,
            body: 'Зачисление "'+description+'"! монета '+owner.name
        }, function (err, message) {
            if (err) {
                console.log('Twilio send SMS error: ', err);
            } else {
                //console.log(message);
            }
        });
    },

    requestEnroll: function(coin_id, price, name) {

        let coin = Coin.findOne({_id: coin_id});

        if (!coin) { //Нет такой монеты
            return;
        }
        
        RequestEnroll.insert({coin_id: coin_id, user_id: Meteor.userId(), price: price, name: name});
    },
    
    approveEnroll: function(request_id) {

        let request = RequestEnroll.findOne({_id: request_id});

        if(!request) {
            return false;
        }

        let coin = Coin.findOne({_id: request.coin_id, user_id: Meteor.userId()});

        if (!coin) { //Нет такой монеты
            return;
        }

        WalletModel.enroll(request.coin_id, request.user_id, request.price, request.name);

        RequestEnroll.remove({_id: request_id});
    }
};

/**
 * Методы Wallet
 */
Meteor.methods({
    'wallet.enroll': WalletModel.enroll,
    'wallet.requestEnroll': WalletModel.requestEnroll,
    'wallet.approveEnroll': WalletModel.approveEnroll
});