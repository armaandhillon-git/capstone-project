let constants = {};

const oneDay = 1000 * 60 * 60 * 24;

constants.session_options = {
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
};

// Application constants
constants.app_const = {
  site_name: "Share It",
  site_email: "info@share-it.com",
  site_phone: "+42227298",
  site_address: "45, Kilometer Stree, <b> London, UK"
};

module.exports = constants;

