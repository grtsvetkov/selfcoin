Template.notice.helpers({
    'list': () => {
        let list = Notice.find({user_id: Meteor.userId()}, { sort: {dt: -1} }).fetch();
        
        _.each(list, (i) => {

            if(i.type == 'goal') {
                i.backgroundHeper = _.times(50, function (n) {
                    return n;
                });
            }

            if(i.data && i.data.owner_id) {
                i.data.owner = Contact.findOne({owner_id: Meteor.userId(), contact_id: i.data.owner_id});
            }
        });
        
        return list;
    }
});

Template.notice.events({
    'click .notice-item .swipeout-delete': (e) => {
        Meteor.call('notice.delete', e.currentTarget.dataset.id);
    },
    
    'click #removeAll': () => {
        app.actions.create({
            buttons: [
                {
                    text: '<div class="action-small">Удалить все уведомления</div>',
                    onClick: () => {
                        Meteor.call('notice.removeAll');
                    }
                },
                {
                    text: '<div class="action-small">Отмена</div>',
                    color: 'red'
                }
            ]
        }).open();
    }
})