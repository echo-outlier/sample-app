import {
  CloudWatchClient,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.
  app.get("/", (req, res) => {
    res.redirect("/atlassian-connect.json");
  });

  // This is an example route used by "generalPages" module (see atlassian-connect.json).
  // Verify that the incoming request is authenticated with Atlassian Connect.
  app.get("/audio", (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    res.render(
      "home.hbs", // change this to 'hello-world.jsx' to use the Atlaskit & React version
      {
        title: "Atlassian Connect",
      }
    );
  });

  app.get("/custom", async (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    const config = { region: "us-east-2" };
    console.log("context", req.context.localBaseUrl);
    const input_params = {
      MetricData: [
        {
          MetricName: "APP_INITIALIZED",
          Dimensions: [{ Name: "NUMBER_OF_TIMES_INITIALIZED", Value: "1" }],
          Unit: "None",
          Value: 1,
        },
      ],
      Namespace: "SITE/TRAFFIC",
    };

    const client = new CloudWatchClient(config);
    const command = new PutMetricDataCommand(input_params);
    const response = await client.send(command);
    console.log("response", response);

    res.render(
      "custom.hbs", // change this to 'hello-world.jsx' to use the Atlaskit & React version
      {
        baseUrl: req.context.localBaseUrl,
        title: "Atlassian Connect",
      }
    );
  });

  app.get("/uploadmetric", (req, res) => {
    const body = req.body;
    res.status(200).send({ hello: "this is yash" });
  });
}
