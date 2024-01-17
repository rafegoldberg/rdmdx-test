import runtime from "react/jsx-runtime";

import { compileSync, runSync } from "@mdx-js/mdx";
import * as MDXReact from "@mdx-js/react";
import remarkGFM from "remark-gfm";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import remarkTestPlugin from "../lib/remark-test-plugin";

import "./gfm.css";

console.clear();

const components = {
  pre: (props) => {
    console.log("<pre>", props);
    return <pre {...props} />;
  },
  code: (props) => {
    console.log("<code>", props);
    return <code {...props} />;
  },
  CodeTabs: (props) => {
    console.log("<CodeTabs>", props);
    return (
      <div
        {...props}
        className="CodeTabs"
        style={{ outline: "1px solid red", outlineOffset: 3, borderRadius: 3 }}
      />
    );
  },
};

const markdown = `\`\`\`js title="Standalone Code Block 1"
console.log('Standalone 0');
\`\`\`

this is some *emphasized* text!

\`\`\`js title="Code Block Tab A1"
console.log('Code Tab A1');
\`\`\`
\`\`\`js title="Code Block Tab A2"
console.log('Code Tab A2');
\`\`\`
\`\`\`js title="Code Block Tab A3"
console.log('Code Tab A3');
\`\`\`

- [x] checked item
- [ ] unchecked item

\`\`\`js title="Standalone Code Block 1"
console.log('Standalone 1');
\`\`\`

\`\`\`js title="Standalone Code Block 2"
console.log('Standalone 2');
\`\`\`

\`\`\`js title="Code Block Tab B1"
console.log('Code Tab B1');
\`\`\`
\`\`\`js title="Code Block Tab B2"
console.log('Code Tab B2');
\`\`\`

\`\`\`js title="Standalone Code Block 3"
console.log('Standalone 3');
\`\`\`
Other paragraph text?
`;

const mdxCode = compileSync(markdown, {
  outputFormat: "function-body",
  remarkPlugins: [remarkGFM, remarkTestPlugin],
  providerImportSource: "@mdx-js/react",
  rehypePlugins: [rehypeMdxCodeProps],
});

const { default: MDXContent } = runSync(String(mdxCode), {
  ...runtime,
  ...MDXReact,
});

// console.log({ vfile: mdxCode, string: String(mdxCode) });

const App = () => (
  <MDXReact.MDXProvider components={components}>
    <div className="markdown-body">
      <MDXContent />
    </div>
  </MDXReact.MDXProvider>
);

export default App;
