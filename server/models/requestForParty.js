RequestForPartyModel = {
    add: function( to_user, coin_id) {

        let owner = Coin.findOne({_id: coin_id, user_id: Meteor.userId()});

        if (!owner) { //Нет такой монеты
            return;
        }
        
        let flag = RequestForParty.findOne({from_user: Meteor.userId(), to_user: to_user, coin_id: coin_id});

        if(!flag) {
            
            let user = Meteor.users.findOne({_id: Meteor.userId()});
            
            CoinModel._addRequest(coin_id, to_user);

            RequestForParty.insert({from_user: Meteor.userId(), name: user.username, to_user: to_user, coin_id: coin_id});
        }
    },

    approve: function(request_id) {

        let request = RequestForParty.findOne({_id: request_id, to_user: Meteor.userId()});

        if(!request) {
            return;
        }

        let coin = Coin.findOne({_id: request.coin_id});

        if (!coin) { //Нет такой монеты
            return;
        }

        CoinModel._addOwner(request.coin_id, request.to_user);
        WalletModel._enroll(request.from_user, request.coin_id, request.to_user, 0, 'Добавление участника');
        CoinModel._removeRequest(request.coin_id, request.to_user);
        ContactModel._add(request.to_user, request.name, request.name, 'Описание контакта', '');

        NoticeModel.add(request.from_user, 'approveParty', {
            owner_id: request.to_user,
            coin: coin
        });

        RequestForParty.remove({_id: request_id});
    },
    
    reject: function(request_id) {
        let request = RequestForParty.findOne({_id: request_id, to_user: Meteor.userId()});

        if(!request) {
            return;
        }

        CoinModel._removeRequest(request.coin_id, request.to_user);
        RequestForParty.remove({_id: request_id});
        WalletModel._remove(Meteor.userId(), request.coin_id);

        let coin = Coin.findOne({_id: request.coin_id});

        if (!coin) { //Нет такой монеты
            return;
        }

        NoticeModel.add(request.from_user, 'rejectParty', {
            owner_id: request.to_user,
            coin: coin
        });
    }
};


/**
 * Методы RequestForParty
 */
Meteor.methods({
    'requestForParty.approve': RequestForPartyModel.approve,
    'requestForParty.reject': RequestForPartyModel.reject
});