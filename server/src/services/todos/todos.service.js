// Initializes the `todos` service on path `/todos`
const createService = require('feathers-nedb');
const createModel = require('../../models/todos.model');
const hooks = require('./todos.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/todos', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('todos');
  // add sample data
  const todos = [
    { title: 'Practice Creating APIs', completed: false },
    { title: 'Install Postman', completed: false },
    { title: 'Learn Feathers.js', completed: false },
    { title: 'Start Exam 2 Cheat Sheet', completed: false }
  ];

  async function add(todos) {
    for (let todo of todos) {
      const found = await service.find({ query: { title: todo.title } });
      if (!found.total) {
        service.create(todo);
      }
    }
  }

  add(todos);

  service.hooks(hooks);
};
