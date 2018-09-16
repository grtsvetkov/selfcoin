GoalModel = {
    add: (coin_id, price, name) => {
        Goal.insert({user_id: Meteor.userId(), coin_id: coin_id, price: parseInt(price), name: name});
    },

    delete: (_id) => {
        Goal.remove({_id: _id, user_id: Meteor.userId()});
    },

    _checkByCoin: (user_id, coin_id) => {

        let coin = Coin.findOne({_id: coin_id});

        if (!coin) { //Нет такой монеты
            return;
        }

        let wallet = Wallet.findOne({user_id: user_id, coin_id: coin._id});

        _.each(Goal.find({user_id: user_id, coin_id: coin._id}).fetch(), (i) => {
            if(parseInt(i.price) <= parseInt(wallet.count)) {
                NoticeModel.add(user_id, 'goal', {
                    goal: i,
                    count: parseInt(wallet.count),
                    coin: coin
                });
            }
        });
    }
};

Meteor.methods({
    'goal.add': GoalModel.add,
    'goal.delete': GoalModel.delete
});