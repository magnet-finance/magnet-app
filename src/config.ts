
type Environment = "development" | "production";
type Config = {
}

const Configs : { [index in Environment] : Config} = {
  development: {},
  production: {}
};

export const getConfig = () : Config => {
  const env = process.env.NODE_ENV;
  if (env !== "development" && env !== "production") {
    throw Error(`Invalid Environment: ${env}`);
  }
  return Configs[env];
}
