App.info({
    id: "com.coinedcoin.app",
    buildNumber: "1",
    version: "0.0.1",
    description: "coined coin",
    author: "gr.tsvetkov",
    email: "gr.tsvetkov@gmail.com",
    website: "coinedcoin.ru"
});

App.appendToConfig('<any-xml-content/>');

App.setPreference('StatusBarOverlaysWebView' ,'true');
App.setPreference('CrosswalkAnimatable', 'true');
App.setPreference('UIWebViewDecelerationSpeed' ,'fast');
App.setPreference('StatusBarStyle', 'Blackcontent');
App.setPreference('KeyboardDisplayRequiresUserAction', 'true');
App.setPreference('SuppressesIncrementalRendering', 'true');
App.setPreference('BackupWebStorage' ,'local');
App.setPreference('HideKeyboardFormAccessoryBar', 'true');
App.setPreference('AllowInlineMediaPlayback', 'true');
App.setPreference('DisallowOverscroll', 'true');
App.setPreference('SplashScreen', 'screen');
App.setPreference('SplashScreenDelay', '1000');
App.setPreference('ShowSplashScreenSpinner' , 'false');
App.setPreference('WebAppStartupTimeout' , '1000');
App.setPreference('Fullscreen', 'true');
App.setPreference('Suppresses3DTouchGesture', 'true');
App.setPreference('SuppressesLongPressGesture', 'true');

App.accessRule('data:*', { type: 'navigation' });
App.accessRule('content:///*', { type: 'navigation' });
App.accessRule('blob:*', { type: 'network' } );
App.accessRule('blob:*', { type: 'navigation' } );

App.accessRule('blobinternal:*', { type: 'network' } );
App.accessRule('blobinternal:*', { type: 'navigation' } );

App.accessRule('http://*', { type: 'navigation' } );
App.accessRule('https://*/*', { type: 'navigation' } );
App.accessRule('*', { type: 'navigation' } );

App.accessRule('http://*', { type: 'network' } );
App.accessRule('https://*/*', { type: 'network' } );
App.accessRule('*', { type: 'network' } );

App.accessRule('https://hotsfun.ru/*', { type: 'navigation' } );
App.accessRule('*://hotsfun.ru/*', { type: 'navigation' } );

App.accessRule('https://hotsfun.ru/*', { type: 'network' } );
App.accessRule('*://hotsfun.ru/*', { type: 'network' } );

App.accessRule('https://hotsfun.ru', {
    'minimum-tls-version': 'TLSv1.0',
    'requires-forward-secrecy': false
});

/* localhos:3000 */
App.accessRule('https://localhos:3000/*', { type: 'navigation' } );
App.accessRule('*://localhos:3000/*', { type: 'navigation' } );

App.accessRule('https://localhos:3000/*', { type: 'network' } );
App.accessRule('*://localhos:3000/*', { type: 'network' } );