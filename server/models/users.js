UserModel = {

    /** Создание нового пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    add: function (username) {
        if(UserModel._getUserByUsername(username)) {
            throw new Meteor.Error('501', 'Пользователь с таким телефоном уже зарегестрирован');
        }

        return {
            _id: Accounts.createUser({username: UserModel._normalizeUsername(username)})
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
    }
};

/**
 * Методы Users
 */
Meteor.methods({
    'user.add': UserModel.add //Создание нового пользователя
});
