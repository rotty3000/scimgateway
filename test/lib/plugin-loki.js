'use strict'

// Natural language-like assertions
const expect = require('chai').expect
const scimgateway = require('../../lib/plugin-loki.js')
const server_8880 = require('supertest').agent('http://localhost:8880') // module request is an alternative

const auth = 'Basic ' + Buffer.from('gwadmin:password').toString('base64')
const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: auth
  }
}

describe('plugin-loki tests', () => {
  it('exploreUsers test', function (done) {
    server_8880.get('/Users' +
      '?attributes=userName&startIndex=1&count=100')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const users = res.body
        expect(res.statusCode).to.equal(200)
        expect(users.totalResults).to.equal(2)
        expect(users.itemsPerPage).to.equal(2)
        expect(users.startIndex).to.equal(1)
        expect(users).to.not.equal('undefined')
        expect(users.Resources[0].userName).to.equal('bjensen')
        expect(users.Resources[0].id).to.equal(undefined)
        expect(users.Resources[1].userName).to.equal('jsmith')
        expect(users.Resources[1].id).to.equal(undefined)
        done()
      })
  })

  it('exploreGroups test', (done) => {
    server_8880.get('/Groups' +
      '?attributes=displayName&startIndex=1&count=100')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const groups = res.body
        expect(res.statusCode).to.equal(200)
        expect(groups.totalResults).to.be.above(3)
        expect(groups.itemsPerPage).to.be.above(3)
        expect(groups.startIndex).to.equal(1)
        expect(groups).to.not.equal('undefined')
        expect(groups.Resources[0].displayName).to.equal('Admins')
        expect(groups.Resources[0].id).to.equal('Admins')
        expect(groups.Resources[0].externalId).to.equal(undefined)
        expect(groups.Resources[1].displayName).to.equal('Employees')
        expect(groups.Resources[1].id).to.equal('Employees')
        expect(groups.Resources[1].externalId).to.equal(undefined)
        expect(groups.Resources[2].displayName).to.equal('UserGroup-1')
        expect(groups.Resources[2].id).to.equal('UserGroup-1')
        expect(groups.Resources[2].externalId).to.equal(undefined)
        expect(groups.Resources[3].displayName).to.equal('UserGroup-2')
        expect(groups.Resources[3].id).to.equal('UserGroup-2')
        expect(groups.Resources[3].externalId).to.equal(undefined)
        done()
      })
  })

  it('getUser test (1)', function (done) {
    server_8880.get('/Users/bjensen')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const user = res.body
        expect(res.statusCode).to.equal(200)
        expect(user).to.not.equal(undefined)
        expect(user.id).to.equal('bjensen')
        expect(user.active).to.equal(true)
        expect(user.name.givenName).to.equal('Barbara')
        expect(user.name.familyName).to.equal('Jensen')
        expect(user.name.formatted).to.equal('Ms. Barbara J Jensen, III')
        expect(user.entitlements[0].type).to.equal('newentitlement')
        expect(user.entitlements[0].value).to.equal('bjensen entitlement')
        expect(user.phoneNumbers[0].type).to.equal('work')
        expect(user.phoneNumbers[0].value).to.equal('555-555-5555')
        expect(user.emails[0].type).to.equal('work')
        expect(user.emails[0].value).to.equal('bjensen@example.com')
        expect(user.meta.location).to.not.equal(undefined)
        expect(user.schemas).to.not.equal(undefined)
        done()
      })
  })

  it('getUser test (2)', function (done) {
    server_8880.get('/Users' +
      '?filter=userName eq "bjensen"&attributes=ims,locale,name.givenName,externalId,preferredLanguage,userType,id,title,timezone,name.middleName,name.familyName,nickName,name.formatted,meta.location,userName,name.honorificSuffix,meta.version,meta.lastModified,meta.created,name.honorificPrefix,emails,phoneNumbers,photos,x509Certificates.value,profileUrl,roles,active,addresses,displayName,entitlements')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        let user = res.body
        user = user.Resources[0]
        expect(res.statusCode).to.equal(200)
        expect(user).to.not.equal(undefined)
        expect(user.id).to.equal('bjensen')
        expect(user.active).to.equal(true)
        expect(user.name.givenName).to.equal('Barbara')
        expect(user.name.familyName).to.equal('Jensen')
        expect(user.name.formatted).to.equal('Ms. Barbara J Jensen, III')
        expect(user.entitlements[0].type).to.equal('newentitlement')
        expect(user.entitlements[0].value).to.equal('bjensen entitlement')
        expect(user.phoneNumbers[0].type).to.equal('work')
        expect(user.phoneNumbers[0].value).to.equal('555-555-5555')
        expect(user.emails[0].type).to.equal('work')
        expect(user.emails[0].value).to.equal('bjensen@example.com')
        done()
      })
  })

  it('getUser test (3)', function (done) {
    server_8880.get('/Users' +
      '?filter=emails.value eq "bjensen@example.com"&attributes=emails,id,name.givenName')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        let user = res.body
        user = user.Resources[0]
        expect(res.statusCode).to.equal(200)
        expect(user).to.not.equal(undefined)
        expect(user.emails[0].value).to.equal('bjensen@example.com')
        expect(user.id).to.equal('bjensen')
        expect(user.name.givenName).to.equal('Barbara')
        expect(user.active).to.equal(undefined)
        expect(user.entitlements).to.equal(undefined)
        expect(user.phoneNumbers).to.equal(undefined)
        done()
      })
  })

  it('getGroup test (1)', function (done) {
    server_8880.get('/Groups/Admins')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const group = res.body
        expect(res.statusCode).to.equal(200)
        expect(group).to.not.equal(undefined)
        expect(group.schemas).to.not.equal(undefined)
        expect(group.meta.location).to.not.equal(undefined)
        expect(group.displayName).to.equal('Admins')
        expect(group.id).to.equal('Admins')
        expect(group.members[0].value).to.equal('bjensen')
        // expect(group.members[0].display).to.equal('bjensen');
        done()
      })
  })

  it('getGroup test (2)', function (done) {
    server_8880.get('/Groups' +
      '?filter=displayName eq "Admins"&attributes=externalId,id,members.value,displayName')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const groups = res.body
        expect(res.statusCode).to.equal(200)
        expect(groups).to.not.equal(undefined)
        expect(groups.schemas).to.not.equal(undefined)
        expect(groups.Resources[0].displayName).to.equal('Admins')
        expect(groups.Resources[0].id).to.equal('Admins')
        expect(groups.Resources[0].members[0].value).to.equal('bjensen')
        // expect(groups.Resources[0].members[0].display).to.equal('bjensen');
        done()
      })
  })

  it('getGroupMembers test', (done) => {
    server_8880.get('/Groups' +
      '?filter=members.value eq "bjensen"&attributes=members.value,displayName')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const groupMembers = res.body
        expect(res.statusCode).to.equal(200)
        expect(groupMembers).to.not.equal('undefined')
        expect(groupMembers.Resources[0].displayName).to.equal('Admins')
        expect(groupMembers.Resources[0].members[0].value).to.equal('bjensen')
        expect(groupMembers.Resources[0].totalResults).to.equal(groupMembers.Resources[0].members[0].length)
        done()
      })
  })

  it('createUser test', (done) => {
    const newUser = {
      userName: 'jgilber',
      active: true,
      password: 'secretpassword',
      name: {
        formatted: 'Mr. Jeff Gilbert',
        familyName: 'Gilbert',
        givenName: 'Jeff'
      },
      title: 'test title',
      emails: [{
        value: 'jgilber@example.com',
        type: 'work'
      }],
      phoneNumbers: [{
        value: 'tel:555-555-8376',
        type: 'work'
      }],
      entitlements: [{
        value: 'Test Company',
        type: 'company'
      }],
      addresses: [{
        type: 'work',
        streetAddress: 'City Plaza',
        postalCode: '9559'
      }]
    }

    server_8880.post('/Users')
      .set(options.headers)
      .send(newUser)
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(201)
        expect(res.body.meta.location).to.equal('http://localhost:8880/Users/jgilber')
        done()
      })
  })

  it('getUser just created test', (done) => {
    server_8880.get('/Users/jgilber')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const user = res.body
        expect(res.statusCode).to.equal(200)
        expect(user).to.not.equal(undefined)
        expect(user.id).to.equal('jgilber')
        expect(user.active).to.equal(true)
        expect(user.name.givenName).to.equal('Jeff')
        expect(user.name.familyName).to.equal('Gilbert')
        expect(user.name.formatted).to.equal('Mr. Jeff Gilbert')
        expect(user.title).to.equal('test title')
        expect(user.emails[0].type).to.equal('work')
        expect(user.emails[0].value).to.equal('jgilber@example.com')
        expect(user.entitlements[0].type).to.equal('company')
        expect(user.entitlements[0].value).to.equal('Test Company')
        expect(user.phoneNumbers[0].type).to.equal('work')
        expect(user.phoneNumbers[0].value).to.equal('tel:555-555-8376')
        expect(user.addresses[0].type).to.equal('work')
        expect(user.addresses[0].streetAddress).to.equal('City Plaza')
        expect(user.addresses[0].postalCode).to.equal('9559')
        done()
      })
  })

  // scim v1.1
  /*
  it('modifyUser test', (done) => {
    var user = {
      name: {
        givenName: 'Jeff-Modified'
      },
      active: false,
      title: 'New title',
      phoneNumbers: [{
        type: 'work',
        value: 'tel:123'
      }],
      entitlements: [{
        type: 'company',
        value: 'New Company'
      }],
      emails: [{
        operation: 'delete',
        type: 'work',
        value: 'jgilber@example.com'
      }],
      addresses: [{
        type: 'work',
        streetAddress: 'New Address',
        postalCode: '1111'
      }],
      meta: { attributes: ['name.familyName'] }
    }
  */

  it('modifyUser test', (done) => {
    var user = {
      Operations: [
        {
          op: 'replace',
          path: 'name.givenName',
          value: [{
            value: 'Jeff-Modified'
          }]
        },
        {
          op: 'replace',
          path: 'active',
          value: [{
            value: false
          }]
        },
        {
          op: 'replace',
          path: 'phoneNumbers[type eq \"work\"].value',
          value: 'tel:123'
        },
        {
          op: 'replace',
          value: {
            title: 'New title',
            entitlements: [{
              value: 'New Company',
              type: 'company'
            }]
          }
        },
        {
          op: 'remove',
          path: 'emails[type eq \"work\"].value'
        },
        {
          op: 'replace',
          path: 'addresses[type eq \"work\"]',
          value: {
            type: 'work',
            streetAddress: 'New Address',
            postalCode: '1111'
          }
        }
      ]
    }

    server_8880.patch('/Users/jgilber')
      .set(options.headers)
      .send(user)
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(204)
        done()
      })
  })

  it('getUser just modified test', (done) => {
    server_8880.get('/Users/jgilber')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const user = res.body
        expect(res.statusCode).to.equal(200)
        expect(user).to.not.equal(undefined)
        expect(user.id).to.equal('jgilber')
        expect(user.active).to.equal(false) // modified
        expect(user.name.givenName).to.equal('Jeff-Modified') // modified
        // expect(user.name.familyName).to.equal(undefined) // cleared - scim 1.1
        expect(user.name.formatted).to.equal('Mr. Jeff Gilbert')
        expect(user.title).to.equal('New title') // modified
        expect(user.emails).to.equal(undefined) // deleted
        expect(user.entitlements[0].type).to.equal('company')
        expect(user.entitlements[0].value).to.equal('New Company') // modified
        expect(user.phoneNumbers[0].type).to.equal('work')
        expect(user.phoneNumbers[0].value).to.equal('tel:123') // modiied
        expect(user.addresses[0].type).to.equal('work')
        expect(user.addresses[0].streetAddress).to.equal('New Address') // modified
        expect(user.addresses[0].postalCode).to.equal('1111') // modified
        done()
      })
  })

  it('deleteUser test', (done) => {
    server_8880.delete('/Users/jgilber')
      .set(options.headers)
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(204)
        done()
      })
  })

  it('createGroup test', (done) => {
    const newGroup = {
      displayName: 'GoGoLoki',
      externalId: undefined,
      members: [{
        value: 'bjensen'
      }]
    }

    server_8880.post('/Groups')
      .set(options.headers)
      .send(newGroup)
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(201)
        expect(res.body.meta.location).to.equal('http://localhost:8880/Groups/GoGoLoki')
        done()
      })
  })

  it('getGroup just created test', (done) => {
    server_8880.get('/Groups/GoGoLoki')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const group = res.body
        expect(res.statusCode).to.equal(200)
        expect(group).to.not.equal('undefined')
        expect(group.displayName).to.equal('GoGoLoki')
        expect(group.id).to.equal('GoGoLoki')
        done()
      })
  })

  it('modifyGroupMembers test', (done) => {
    server_8880.patch('/Groups/GoGoLoki?attributes=displayName')
      .set(options.headers)
      // .send({ members: [{ value: 'jsmith' }, { operation: 'delete', value: 'bjensen' }], schemas: ['urn:scim:schemas:core:1.0'] }) // scim v1.1
      .send({ 
        Operations: [
          {
            op: 'add',
            path: 'members',
            value: [
              { value: 'jsmith' }
            ]
          },
          {
            op: 'remove',
            path: 'members',
            value: [
              { value: 'bjensen' }
            ]
          }
        ]
      })
      .end(function (err, res) {
        const group = res.body
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(200)
        expect(group.displayName).to.equal('GoGoLoki')
        done()
      })
  })

  it('getGroup just modified members test', (done) => {
    server_8880.get('/Groups/GoGoLoki')
      .set(options.headers)
      .end(function (err, res) {
        if (err) { }
        const group = res.body
        expect(res.statusCode).to.equal(200)
        expect(group).to.not.equal('undefined')
        expect(group.displayName).to.equal('GoGoLoki')
        expect(group.id).to.equal('GoGoLoki')
        expect(group.members.length).to.equal(1) // bjensen removed
        expect(group.members[0].value).to.equal('jsmith') // added
        done()
      })
  })

  it('deleteGroup test', (done) => {
    server_8880.delete('/Groups/GoGoLoki')
      .set(options.headers)
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.statusCode).to.equal(204)
        done()
      })
  })
})
