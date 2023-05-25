// eslint-disable-next-line no-undef
db.createUser({
  user: 'brick',
  pwd: 'brick',
  roles: [
    {
      role: 'readWrite',
      db: 'brick'
    }
  ]
})
