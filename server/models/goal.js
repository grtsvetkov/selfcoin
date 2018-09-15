GoalModel = {
    add: (coin_id, price, name) => {
        Goal.insert({user_id: Meteor.userId(), coin_id: coin_id, price: price, name: name});
    },

    delete: (_id) => {
        Goal.remove({_id: _id, user_id: Meteor.userId()});
    }
};

Meteor.methods({
    'goal.add': GoalModel.add,
    'goal.delete': GoalModel.delete
});