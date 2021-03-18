const path = require(`path`);

exports.createPages = ({ actions }) => {
  const { createPage } = actions;
  createPage({
    path: "/review/:safeTxHash",
    matchPath: "/review/:safeTxHash",
    component: path.resolve(`src/pages/review.tsx`)
  });
}
