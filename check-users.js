require('dotenv').config({path:'.env'});
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({select:{id:true,email:true,name:true,role:true}})
  .then(u => { console.log(JSON.stringify(u, null, 2)); p.$disconnect(); })
  .catch(e => { console.error(e.message); p.$disconnect(); });