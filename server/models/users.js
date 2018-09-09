UserModel = {

    /** Создание нового пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    add: function (username, name) {
        if(UserModel._getUserByUsername(username)) {
            throw new Meteor.Error('501', 'Пользователь с таким телефоном уже зарегестрирован');
        }

        let profile = {};
        
        if(name) {
            profile['name'] = name;
        }
        
        return {
            _id: Accounts.createUser({username: UserModel._normalizeUsername(username), profile: profile})
        };
    },
    
    _getUserByUsername: function(username) {
        return Meteor.users.findOne({username: UserModel._normalizeUsername(username)});
    },
    
    _normalizeUsername: function(username) {
        if(!username) {
            throw new Meteor.Error('502', 'Неверно указан username');
        }

        username = username.replace(/\D+/g, '');
        
        if (username.length != 11) {
            throw new Meteor.Error('503', 'Неверно указан username');
        }
        
        return username;
    },
    
    setAvatar: function(file_id) {
        let user = Meteor.user();
        
        if(!user) {
            return;
        }
        
        Meteor.users.update({_id: user._id}, { $set: { 'profile.avatar': file_id } });
    },

    setName: function(name) {

        let user = Meteor.user();

        if(!user) {
            return;
        }

        Meteor.users.update({_id: user._id}, { $set: { 'profile.name': name } });
    }
};

/**
 * Методы Users
 */
Meteor.methods({
    'user.add': UserModel.add, //Создание нового пользователя
    
    'user.setAvatar': UserModel.setAvatar,
    'user.setName': UserModel.setName
});
