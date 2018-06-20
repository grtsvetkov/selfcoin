import  Framework7 from 'framework7';

import "framework7/css/framework7.min.css";
import 'framework7-icons';

app = null, mainView = null;

Template.AppLayout.rendered = function() {
    app = new Framework7({
        root: '#app',
        name: 'Coined Coin',
        id: 'com.coinedcoin.test',
        panel: {
            swipe: 'left'
        }
    });

    mainView = app.views.create('.view-main');
};

Template.toolbar.helpers({
    'list': function() {
        
        let crn = currentRouterName.get();
        
        return [
            {name: 'Welcome', path: 'welcome', icon1: 'today_fill', icon2: 'today', isActive: crn == 'welcome'},
            {name: 'SignIn', path: 'signin', icon1: 'today_fill', icon2: 'today', isActive: crn == 'signin'},

            {name: 'Главная', path: 'index', icon1: 'email_fill', icon2: 'email', isActive: crn == 'index'},
            {name: 'Биржа', path: 'market', icon1: 'graph_square_fill', icon2: 'graph_square', isActive: crn == 'market'},
            {name: 'Профиль', path: 'profile', icon1: 'person_fill', icon2: 'person', isActive: crn == 'profile'}
        ]
    }
});