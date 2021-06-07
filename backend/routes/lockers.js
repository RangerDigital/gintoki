const LockerService = require('../services/LockerService');

async function routes(router) {
  router.register(require('../hooks/authHook'));

  router.get(
    '/',
    {
      schema: {
        summary: 'Get the all the lockers.',
        tags: ['Lockers'],
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                location: { type: 'array' },
                available: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
    async (req, res) => {
      const lockers = await LockerService.getAll();

      return res.send(lockers);
    }
  );

  router.get(
    '/:lockerId/commands',
    {
      schema: {
        summary: 'Get commands to the microcontroller.',
        tags: ['Lockers'],
        security: [{ BearerAuth: [] }],

        querystring: {
          key: { type: 'string' },
        },
      },
    },
    async (req, res) => {
      const { lockerId } = req.params;
      const { key } = req.query;

      const commands = await LockerService.getCommands(lockerId, key);

      return res.send(commands);
    }
  );

  router.post(
    '/',
    {
      schema: {
        summary: 'Create a new locker.',
        tags: ['Lockers'],
        security: [{ BearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            location: { type: 'array' },
            slots: { type: 'array' },
          },
        },

        response: {
          200: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              location: { type: 'array' },
              slots: { type: 'array' },
            },
          },
        },
      },
    },
    async (req, res) => {
      const { name, location, slots } = req.body;

      const locker = await LockerService.create(name, location, slots);

      return res.send(locker);
    }
  );
}

module.exports = routes;