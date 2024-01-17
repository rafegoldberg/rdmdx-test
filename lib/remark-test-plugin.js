import { visit } from "unist-util-visit";
import { find } from "unist-util-find";
import replaceAllBetween from "unist-util-replace-all-between";

function findCodeTabs(tree) {
  const blocks = [];
  visit(tree, "code", (node) => {
    const next = { line: node.position.end.line + 1 };
    const prev = { line: node.position.start.line - 1 };
    const nextBlock = find(tree, { type: "code", position: { start: next } });
    const prevBlock = find(tree, { type: "code", position: { end: prev } });
    if (nextBlock || prevBlock) blocks.push(node);
  });
  return blocks;
}

function groupCodeTabs(tabs) {
  const groups = [];
  let currentGroup = [];
  tabs.forEach((tab, x) => {
    if (x === 0) currentGroup.push(tab);
    else {
      const prevTab = tabs[x - 1];
      if (tab.position.start.line === prevTab.position.end.line + 1) {
        currentGroup.push(tab);
      } else {
        groups.push(currentGroup);
        currentGroup = [tab];
      }
    }
  });
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

function wrapCodeTabGroups(tree, groups) {
  groups.forEach((group) => {
    replaceAllBetween(tree, group[0], group[group.length - 1], () => [
      {
        name: "CodeTabs",
        type: "mdxJsxFlowElement",
        children: group,
        // attributes: [{ type: "mdxJsxAttribute", name: "key", value: "val" }],
      },
    ]);
  });
}

export default function remarkTestPlugin() {
  return (tree) => {
    const tabs = findCodeTabs(tree);
    const groups = groupCodeTabs(tabs);

    wrapCodeTabGroups(tree, groups);

    console.log(tree);
    // console.log(tabs);
    // console.log(groups);
  };
}
