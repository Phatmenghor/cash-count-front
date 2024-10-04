const ENV = process.env.NEXT_PUBLIC_ENV;

const CONFIG = {
  development: {
    apiUrl: "http://localhost:3000/api",
    featureFlag: true,
  },
  production: {
    apiUrl: "https://api.example.com",
    featureFlag: false,
  },
  preProduction: {
    apiUrl: "https://pre-api.example.com",
    featureFlag: true,
  },
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export const textConfig = {
  development: {
    welcomeMessage: "Welcome to the Development Environment!",
    featureInfo: "New feature is enabled in dev mode.",
    apiErrorMessage: "API error in development mode!",
  },
  production: {
    welcomeMessage: "Welcome to the Production Environment!",
    featureInfo: "This feature is live for all users.",
    apiErrorMessage: "Something went wrong. Please try again later.",
  },
  preProduction: {
    welcomeMessage: "Welcome to the Pre-Production Environment!",
    featureInfo: "Feature is available for testing in pre-production.",
    apiErrorMessage: "API error in pre-production mode!",
  },
};

// Select the config based on the environment
export const currentConfig =
  CONFIG[
    ENV === "production"
      ? "production"
      : ENV === "pre-production"
      ? "preProduction"
      : "development"
  ];
