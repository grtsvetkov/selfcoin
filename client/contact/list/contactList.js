let tmpList = [
    'Aaron',
    'Abbie',
    'Adam',
    'Adam',
    'Adam',
    'Adam',
    'Adam',
    'Adam',
    'Bailey',
    'Barclay',
    'Bartolo',
    'Caiden',
    'Caiden',
    'Caiden',
    'Caiden',
    'Caiden',
    'Caiden',
    'Calvin',
    'Candy'
];

Template.contactList.helpers({
    'contact_list': function() {
        
        let list = {};
        
        _.each(tmpList, function(tmp){

            if(!list[tmp.substr(0,1).toUpperCase()]) {
                list[tmp.substr(0,1).toUpperCase()] = [];
            }

            list[tmp.substr(0,1).toUpperCase()].push({
                _id: -1,
                name: tmp,
                username: '79111111111'
            })
        });
        
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