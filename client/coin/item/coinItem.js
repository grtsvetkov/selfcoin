Template.coinItem.helpers({
    'item': function() {
        let _id = Router.current().params._id;
        
        let item = Coin.findOne({_id: _id}); 
        
        item.user = Meteor.user();



        return item;
    }
});


