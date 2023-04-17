/* export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Soccer API",
    description: "Documentation for Soccer API",
    termsOfService: "",
    contact: {
      name: "Amine Trabelsi",
      email: "amin.trabelsi@gmail.com",
      url: "",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost/backend/api/v1",
      description: "Local development",
    },
    {
      url: "https://my_production_url/api/v1",
      description: "Production",
    },
  ],
  apis: ["./src/routes/*.ts"],
}; */

export const swaggerDocument = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost/backend",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
