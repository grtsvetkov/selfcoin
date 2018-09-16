NoticeModel = {
    add: (user_id, type, data) => {
        Notice.insert({user_id: user_id,  dt: new Date, type: type, data: data});
    },

    delete: (_id) => {
        Notice.remove({_id: _id, user_id: Meteor.userId()});
    },

    removeAll: () => {
        Notice.remove({user_id: Meteor.userId()});
    }
};

Meteor.methods({
    'notice.delete': NoticeModel.delete,
    'notice.removeAll': NoticeModel.removeAll
});