Template.coinItem.helpers({
    'item': function() {
        let _id = Router.current().params._id;
        
        let item = Coin.findOne({_id: _id}); 
        
        item.user = Meteor.user();

        return item;
    },

    'partyCount': () => {
        return Wallet.find({coin_id: Router.current().params._id}).count();
    }
});

Template.coinItem.events({
    'click #goTo_coinItemParty': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/coinItemParty',
                route: {
                    path: '/coinItemParty',
                    pageName: 'coinItemParty'
                }
            }
        );
    }
});

Template.coinItemParty.helpers({
    'contact_list': () => {

        let list = {};

        _.each(Wallet.find({coin_id: Router.current().params._id}).fetch(), function(w){

            let i = Contact.findOne({contact_id: w.user_id});

            if(!list[i.name.substr(0,1).toUpperCase()]) {
                list[i.name.substr(0,1).toUpperCase()] = [];
            }

            list[i.name.substr(0,1).toUpperCase()].push({
                _id: i.contact_id,
                name: i.name,
                username: i.contact_id
            });
        });

        return _.map(list, function(l, key){
            return {
                litera: key,
                list: l
            }
        })
    }
});

Template.coinItemParty.events({
    'click .coinItemPartyAdd': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'По номеру телефона',
                    onClick: function () {

                    }
                },
                {
                    text: 'Из контактов',
                    onClick: function () {
                        mainView.router.navigate({
                                url: '/coinItemPartyAdd',
                                route: {
                                    path: '/coinItemPartyAdd',
                                    pageName: 'coinItemPartyAdd'
                                }
                            }
                        );
                    }
                }
            ]
        }).open();
    }
});

Template.coinItemPartyAdd.helpers({
    'contact_list': () => {

        let list = {};

        _.each(Contact.find({owner_id: Meteor.userId()}).fetch(), function(i){

            if(!list[i.name.substr(0,1).toUpperCase()]) {
                list[i.name.substr(0,1).toUpperCase()] = [];
            }

            list[i.name.substr(0,1).toUpperCase()].push({
                _id: i.contact_id,
                name: i.name,
                username: i.contact_id
            });
        });

        return _.map(list, function(l, key){
            return {
                litera: key,
                list: l
            }
        })
    }
});

Template.coinItemPartyAdd.events({
    'click .itemAdd': (e) => {
        Meteor.call('wallet.enroll', Router.current().params._id, e.currentTarget.dataset.id, 0, 'Добавление участника');
    }
});