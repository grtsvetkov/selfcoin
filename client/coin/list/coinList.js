Template.coinList.helpers({
    'list': function () {
        return Coin.find({user_id: Meteor.userId()}).fetch();
    },

    'backgroundByIndex': function (index) {
        return index % 2 == 0 ? 'string2' : 'string1';
    }
});

Template.coinList.events({
    'click .goToMoney': function (e) {
        let _id = e.currentTarget.dataset.id;

        Router.go('coinItem', {_id: _id});
    }
});