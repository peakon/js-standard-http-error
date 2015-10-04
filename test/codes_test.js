var O = require("oolong")
var isVersion = require("semver").satisfies.bind(null, process.version)
var describeNodeV012 = isVersion(">= 0.12 < 0.13") ? describe : xdescribe
var CODES_JSON = require("../codes.json")
var STATUS_CODES = require("http").STATUS_CODES

describeNodeV012("codes.json", function() {
  // Test for superset rather than equivalence because future Node versions
  // might _add_ status codes. During the switch from Node 0.12 to Node v4 some
  // names _were_ changed.
  O.each(STATUS_CODES, function(name, code) {
    it("must have " + code + " equal " + name, function() {
      CODES_JSON[code].must.equal(name)
    })
  })
})
