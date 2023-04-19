export const swaggerDocument = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Soccer API",
      version: "1.0.0",
      description:
        "This is a Demo CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Amine Trabelsi",
        email: "amin.trabelsi@gmail.com",
        url: "",
      },
    },
    servers: [
      {
        url: "http://localhost/backend/api-docs/",
        description: "Local development",
      },
      {
        url: "http://http://soccerrestdemo-env.eba-xkmaupa2.eu-west-3.elasticbeanstalk.com/backend/api-docs/",
        description: "Production",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
