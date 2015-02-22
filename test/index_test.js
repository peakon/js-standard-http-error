var Ow = require("objectware")
var STATUS_NAMES = require("http-codes")
var HttpError = require("..")

function RemoteError(code, msg) { HttpError.apply(this, arguments) }

RemoteError.prototype = Object.create(HttpError.prototype, {
  constructor: {value: RemoteError, configurable: true, writeable: true}
})

describe("HttpError", function() {
  describe("new", function() {
    it("must be an instance of HttpError", function() {
      new HttpError(400).must.be.an.instanceof(HttpError)
    })

    it("must set code", function() {
      new HttpError(404).code.must.equal(404)
    })

    it("must throw TypeError given undefined code", function() {
      !function() { new HttpError(undefined) }.must.throw(TypeError, /HTTP/)
    })

    it("must throw TypeError given null code", function() {
      !function() { new HttpError(null) }.must.throw(TypeError, /HTTP/)
    })

    it("must set code from constant name", function() {
      new HttpError("NOT_FOUND").code.must.equal(404)
    })

    it("must throw TypeError given unknown constant", function() {
      !function() { new HttpError("DUNNO") }.must.throw(TypeError, /HTTP/)
    })

    it("must set message from code", function() {
      new HttpError(404).message.must.equal("Not Found")
    })

    it("must set message from constant name", function() {
      new HttpError("NOT_FOUND").message.must.equal("Not Found")
    })

    it("must set message if given", function() {
      new HttpError(404, "Dunno").message.must.equal("Dunno")
    })

    it("must set name to HttpError", function() {
      new HttpError(400).name.must.equal("HttpError")
    })

    it("must set name to constructor's name", function() {
      new RemoteError(400).name.must.equal("RemoteError")
    })

    it("must set code, message and properties", function() {
      var err = new RemoteError(404, "Dunno", {url: "/dunno"})
      err.code.must.equal(404)
      err.message.must.equal("Dunno")
      err.url.must.equal("/dunno")
    })

    it("must set code and properties", function() {
      var err = new RemoteError(404, {url: "/dunno"})
      err.code.must.equal(404)
      err.message.must.equal("Not Found")
      err.url.must.equal("/dunno")
    })

    it("must set stack", function() {
      var stack = new HttpError(400).stack.split(/\n\s*/)
      stack[0].must.equal("HttpError: Bad Request")
      stack[1].must.include("index_test.js")
    })

    it("must set stack from constructor", function() {
      var stack = new RemoteError(400).stack.split(/\n\s*/)
      stack[0].must.equal("RemoteError: Bad Request")
      stack[1].must.include("index_test.js")
      stack[2].must.not.include("index_test.js")
    })
  })

  describe(".prototype.status", function() {
    it("must be an alias to code", function() {
      new HttpError(404).status.must.equal(404)
    })

    it("must be non-enumerable", function() {
      new HttpError(404).must.have.nonenumerable("status")
    })

    it("must be overwritable", function() {
      var err = new HttpError(404, {status: "OK"})
      err.must.have.enumerable("status")
      err.status.must.equal("OK")
    })
  })

  describe(".prototype.statusCode", function() {
    it("must be an alias to code", function() {
      new HttpError(404).statusCode.must.equal(404)
    })

    it("must be non-enumerable", function() {
      new HttpError(412).must.have.nonenumerable("statusCode")
    })

    it("must be overwritable", function() {
      var err = new HttpError(404, {statusCode: "OK"})
      err.must.have.enumerable("statusCode")
      err.statusCode.must.equal("OK")
    })
  })

  describe(".prototype.statusMessage", function() {
    it("must be an alias to message", function() {
      var err = new HttpError(412, "Bad CSRF Token")
      err.statusMessage.must.equal("Bad CSRF Token")
    })

    it("must be non-enumerable", function() {
      new HttpError(412).must.have.nonenumerable("statusMessage")
    })

    it("must be overwritable", function() {
      var err = new HttpError(404, {statusMessage: "OK"})
      err.must.have.enumerable("statusMessage")
      err.statusMessage.must.equal("OK")
    })
  })

  describe(".prototype.toString", function() {
    it("must return code and message", function() {
      new HttpError(404, "Dunno").toString().must.equal("HttpError: 404 Dunno")
    })

    it("must use set name", function() {
      var err = new HttpError(404, "Dunno")
      err.name = "OtherError"
      err.toString().must.equal("OtherError: 404 Dunno")
    })
  })

  describe("HTTP status codes", function() {
    // Fail safes:
    STATUS_NAMES.must.have.property("NOT_FOUND", 404)
    STATUS_NAMES.must.have.property("INTERNAL_SERVER_ERROR", 500)

    Ow.each(STATUS_NAMES, function(code, constant) {
      it("must have " + constant + " equal " + code, function() {
        HttpError[constant].must.equal(code)
      })
    })
  })
})
