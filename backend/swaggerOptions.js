const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SlimMom API",
        version: "1.0.0",
        description: "API documentation for the SlimMom project",
      },
      servers: [
        {
          url: "http://localhost:5000",
          description: "Local server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          DiaryEntry: {
            type: "object",
            properties: {
              _id: { type: "string" },
              user_id: { type: "string" },
              entry_date: { type: "string", format: "date" },
              product_name: { type: "string" },
              grams: { type: "number" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  module.exports = options;
  