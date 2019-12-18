
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
     table.bigInteger('age').nullable();
     table.string('pet').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
     table.dropColumns('age', 'pet');
  });
};
