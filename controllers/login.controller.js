﻿var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var userService = require('services/user.service');

router.get('/', function (req, res) {
    delete req.session.token;
    
    var viewData = { success: req.session.success };
    delete req.session.success;
    
    res.render('login', viewData);
    
 });

router.post('/', function (req, res) {
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }

        if (!body.token) {
            return res.render('login', { error: body, username: req.body.username });
        }

        req.session.token = body.token;

        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

module.exports = router;