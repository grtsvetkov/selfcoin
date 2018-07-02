let condition = new ReactiveVar(),
    spend = new ReactiveVar();

Template.create.rendered = function() {
    condition.set([1]);
    spend.set([1]);
};

Template.create.helpers({
    'list_condition': function() {
        return condition.get();
    },
    
    'list_spend': function() {
        return spend.get();
    },

    'backgroundByIndex': function(index) {
        return index % 2 == 0 ? 'string2' : 'string1';
    }
});

Template.create.events({
    'click #add_condition': function(e) {
        let tmp = condition.get();

        tmp.push(1);

        condition.set(tmp);
    },
    
    'click #add_spend': function() {
        let tmp = spend.get();

        tmp.push(1);

        spend.set(tmp);
    }
});