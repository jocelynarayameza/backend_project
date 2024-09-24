export const info = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API News",
        version: "1.0.0",
        description: "Documentacion de Backend Ecommerce",
      },
      servers: [
        {
          url: "http://localhost:8080",
        },
      ],
    },
    apis: ["./src/docs/*.yml"],
  };