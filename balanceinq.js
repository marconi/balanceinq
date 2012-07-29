var casper = require('casper').create({
    logLevel: 'debug'
});

casper.test.comment('Checking BDO account balance');

var username = '<your BDO username>',
    password = '<your BDO password>';

casper.start("https://www.mybdo.com.ph/fo/login", function() {
    this.test.assertTitle('Banco De Oro Retail Internet Banking', 'Correct title');
    this.test.assertExists('form#id2', 'Login form is available');
    casper.test.info('Populating login form...');
    this.fill('form#id2', {
        'channelUserID': username,
        'channelPswdPin': password
    }, false);
    casper.test.info('Logging in...');
    this.click('input[value=Login]');
});

casper.waitFor(function() {
    return this.getCurrentUrl() === "https://www.mybdo.com.ph/fo/index";
}, function() {
    this.click('div.landing-accountinquiry');
}, function timeout() {
    this.echo("Ran out of time.", "ERROR").exit();
}, 10000);

casper.waitFor(function() {
    return this.getCurrentUrl() === "https://www.mybdo.com.ph/fo/main";
}, function() {

    var balance = this.evaluate(function() {
        var tables = Array.prototype.slice.call(document.querySelectorAll('table')),
            csAccountsTbl = tables[3],
            currency = csAccountsTbl.getElementsByTagName('span')[19].innerHTML,
            amount = csAccountsTbl.getElementsByTagName('span')[21].innerHTML,
            balance = currency + ' ' + amount;
        return balance;
    });

    this.echo('YOUR BALANCE: ' + balance, 'GREEN_BAR');

    casper.test.info('Logging out...');
    this.click('div.logout');
}, function timeout() {
    this.echo("Ran out of time.", "ERROR").exit();
}, 10000);

casper.run(function() {
    this.test.done();
});
