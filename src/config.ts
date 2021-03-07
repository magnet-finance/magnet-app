
type Environment = "development" | "production";
type Config = {
  chainId: number
}

const Configs : { [index in Environment] : Config} = {
  development: {
    chainId: 3, // Ropsten
  },
  production: {
    chainId: 1 //Mainnet
  }
};

export const getConfig = () : Config => {
  const env = process.env.NODE_ENV;
  if (env !== "development" && env !== "production") {
    throw Error(`Invalid Environment: ${env}`);
  }
  return Configs[env];
}
