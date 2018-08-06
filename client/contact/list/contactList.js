Template.contactList.helpers({
    'contact_list': function() {
        
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